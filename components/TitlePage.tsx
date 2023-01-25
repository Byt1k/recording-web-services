import Link from "next/link";
import styles from '../styles/titlePage.module.scss'
import {useEffect, useState} from "react";
import Modal from "./Modal";
import {useAppSelector} from "../redux/hooks";
import {selectAuthUserData} from "../redux/slices/auth";
import modalStyles from "../styles/modal.module.scss";
import {useForm} from "react-hook-form";
import {Api} from "../api";

interface PropsType {
    title: string,
    isListRecordsPage?: boolean
    isSearch?: boolean
    isInteraction?: boolean
    selectedTrackId?: string,
    setPageSize?: (size: number) => void
    pageSize?: number
    setPopupSelectColumns?: (value: boolean) => void,
    setCurrentPage?: (value: number) => void,
    getFormValues?: () => any
}

const TitlePage: React.FC<PropsType> = ({
                                            title, isListRecordsPage = false, isSearch = false,
                                            isInteraction = false, selectedTrackId, setPageSize,
                                            pageSize, setPopupSelectColumns, setCurrentPage, getFormValues
                                        }) => {

    const [popupSaveFilter, setPopupSaveFilter] = useState(false)

    const userData = useAppSelector(selectAuthUserData)

    const possiblePageSize = [10, 25, 50, 100]

    // Сохранение формы поиска (фильтра)
    const {handleSubmit, register, reset} = useForm({
        defaultValues: {
            filterName: '',
            filterType: 'private'
        }
    })

    const [isSubmiting, setIsSubmiting] = useState(false)

    const saveFilter = async ({filterName, filterType}) => {
        setIsSubmiting(true)

        const formValues = getFormValues()

        let data = {filterName, filterType, ...formValues}
        Object.keys(formValues.metadataQuery).map(key => {
            data = {
                ...data,
                [key]: formValues.metadataQuery[key]
            }
        })
        delete data.metadataQuery

        let currentFilters = []

        try {
            currentFilters = await Api().filters.getFilters()
        } catch (e) {
            console.log(e)
        }

        try {
            await Api().filters.setFilters([
                ...currentFilters, {...data, filterName, filterType, id: new Date().getTime()}
            ])
        } catch (e) {
            console.log(e)
        }

        reset()
        setIsSubmiting(false)
        setPopupSaveFilter(false)
    }

    // Проверка есть ли записи в localstorage, чтобы показать кнопку 'Вернуться к записям' из формы поиска
    const [isRecordings, setIsRecordings] = useState(false)
    useEffect(() => {
        const recordings = JSON.parse(localStorage.getItem('recordings'))
        setIsRecordings(!!recordings)
    }, [])

    return (
        <>
            <div className={styles.title}>
                <h2>{title}</h2>
                {isListRecordsPage && <div className={styles.title__count}>
                    <p>Записей на странице</p>
                    {possiblePageSize.map(size => (
                        <button key={size} className={size === pageSize ? styles.active : ""}
                                onClick={() => {
                                    setPageSize(size)
                                    setCurrentPage(1)
                                    localStorage.setItem('pageSize', size.toString())
                                }}
                        >{size}</button>
                    ))}
                </div>}
                {isListRecordsPage && <div className={styles.title__actions}>
                    {userData?.Capabilities[0].CanDetailView === 'true'
                        && <Link href={selectedTrackId ? `/list/${selectedTrackId}` : `/list`}
                                 className={styles.title__actions__btn_outline}>Взаимодействие</Link>}
                    <button className={styles.title__actions__btn_outline} onClick={() => setPopupSelectColumns(true)}>
                        Выбор столбцов
                    </button>
                    <Link href="/" className={styles.title__actions__btn_fill}>Вернуться к поиску</Link>
                </div>}
                {isSearch && <div className={styles.title__actions}>
                    <button className={styles.title__actions__btn_outline}
                            onClick={() => setPopupSaveFilter(true)}>Сохранить фильтр
                    </button>
                    <Link href="/filters" className={styles.title__actions__btn_fill}>Выбрать фильтр</Link>
                    {isRecordings &&
                        <Link href="/list" className={styles.title__actions__btn_fill}>Вернуться к списку</Link>}
                </div>}
                {isInteraction && <div className={styles.title__actions}>
                    <Link href="/list" className={styles.title__actions__btn_outline}>Вернуться к списку</Link>
                </div>}
            </div>

            <Modal title="Сохранить фильтр" text="Вы хотите сохранить текущий фильтр."
                   active={popupSaveFilter} setActive={setPopupSaveFilter}>
                <form onSubmit={handleSubmit(saveFilter)} className={styles.saveFilterForm}>
                    <div className={styles.saveFilterForm__field}>
                        <p>Название фильтра</p>
                        <input {...register('filterName')} type="text" required={true} placeholder="Введите название"/>
                    </div>
                    <div className={styles.saveFilterForm__field}>
                        <p>Тип фильтра</p>
                        <div className={styles.saveFilterForm__field__types}>
                            <label>
                                <input {...register('filterType')} type="radio" value="private"/>
                                Личный
                            </label>
                            <label>
                                <input {...register('filterType')} disabled={true} type="radio" value="public"/>
                                Общий
                            </label>
                        </div>
                    </div>
                    <div className={`${modalStyles.modal__content__action} ${modalStyles.modal__content_blue}`}>
                        <button onClick={() => setPopupSaveFilter(false)} type="button">Отменить</button>
                        <button className={modalStyles.positive} type="submit" disabled={isSubmiting}>Сохранить</button>
                    </div>
                </form>
            </Modal>
        </>
    )
};

export default TitlePage;