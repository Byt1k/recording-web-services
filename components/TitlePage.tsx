import Link from "next/link";
import styles from '../styles/titlePage.module.scss'
import {useEffect, useState} from "react";
import {Field, Form, Formik} from "formik";
import Modal from "./Modal";
import {useAppSelector} from "../redux/hooks";
import {selectAuthUserData} from "../redux/slices/auth";
import modalStyles from "../styles/modal.module.scss";
import {useRouter} from "next/router";

interface PropsType {
    title: string,
    isListRecordsPage?: boolean
    isSearch?: boolean
    isInteraction?: boolean
    selectedTrackId?: string,
    setPageSize?: (size: number) => void
    pageSize?: number
    setPopupSelectColumns?: (value: boolean) => void,
    setCurrentPage?: (value: number) => void
}

const TitlePage: React.FC<PropsType> = ({
                                            title,
                                            isListRecordsPage = false,
                                            isSearch = false,
                                            isInteraction = false,
                                            selectedTrackId,
                                            setPageSize,
                                            pageSize,
                                            setPopupSelectColumns,
                                            setCurrentPage
                                        }) => {

    const [popupSaveFilter, setPopupSaveFilter] = useState(false)

    const userData = useAppSelector(selectAuthUserData)

    const possibleListPageSize = [10, 25, 50, 100]

    const onSubmitSaveFilterForm = data => {
        alert(data)
        setPopupSaveFilter(false)
    }

    // Проверка есть ли записи в localstorage, чтобы показать кнопку
    const [backToListVisible, setBackToListVisible] = useState(false)
    useEffect(() => {
        const recordings = JSON.parse(localStorage.getItem('recordings'))
        setBackToListVisible(!!recordings)
    }, [])

    return (
        <>
            <div className={styles.title}>
                <h2>{title}</h2>
                {isListRecordsPage && <div className={styles.title__count}>
                    <p>Записей на странице</p>
                    {possibleListPageSize.map(size => (
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
                        && <Link href={`/list/${selectedTrackId}`} className={styles.title__actions__btn_outline}>Взаимодействие</Link>}
                    <button
                        className={styles.title__actions__btn_outline}
                        onClick={() => setPopupSelectColumns(true)}
                    >
                        Выбор столбцов
                    </button>
                    <Link href="/" className={styles.title__actions__btn_fill}>
                        {/*<span className={styles.count}>5</span>*/}
                        Вернуться к поиску
                    </Link>
                </div>}
                {isSearch && <div className={styles.title__actions}>
                    <button className={styles.title__actions__btn_outline}
                            onClick={() => setPopupSaveFilter(true)}>Сохранить фильтр
                    </button>
                    <Link href="/filters" className={styles.title__actions__btn_fill}>Выбрать фильтр</Link>
                    {backToListVisible
                        && <Link href="/list" className={styles.title__actions__btn_fill}>Вернуться к списку</Link>}
                </div>}
                {isInteraction && <div className={styles.title__actions}>
                    <Link href="/list" className={styles.title__actions__btn_outline}>Вернуться к списку</Link>
                </div>}
            </div>

            <Modal title="Сохранить фильтр" text="Вы хотите сохранить текущий фильтр." active={popupSaveFilter}
                   setActive={setPopupSaveFilter}>
                <Formik
                    initialValues={{
                        filterName: '',
                        filterType: 'private'
                    }}
                    onSubmit={async (values, {resetForm}) => {
                        await new Promise((r) => setTimeout(r, 500));
                        alert(JSON.stringify(values, null, 2));
                        resetForm();
                        setPopupSaveFilter(false)
                    }}
                >
                    <Form id="saveFilterForm" className={styles.saveFilterForm}>
                        <div className={styles.saveFilterForm__field}>
                            <p>Название фильтра</p>
                            <Field type="text" name="filterName" required={true} placeholder="Введите название"/>
                        </div>
                        <div className={styles.saveFilterForm__field}>
                            <p>Тип фильтра</p>
                            <div className={styles.saveFilterForm__field__types}>
                                <label>
                                    <Field type="radio" name="filterType" value="private"/>
                                    Личный
                                </label>
                                <label>
                                    <Field type="radio" name="filterType" value="public"/>
                                    Общий
                                </label>
                            </div>
                        </div>
                    </Form>
                </Formik>
                <div className={`${modalStyles.modal__content__action} ${modalStyles.modal__content_blue}`}>
                    <button onClick={() => setPopupSaveFilter(false)}>Отменить</button>
                    <button className={modalStyles.positive} onClick={() => {}} form="saveFilterForm" type="submit">
                        Сохранить
                    </button>
                </div>
            </Modal>
        </>
    )
};

export default TitlePage;