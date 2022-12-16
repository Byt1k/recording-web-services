import Link from "next/link";
import styles from '../styles/titlePage.module.scss'
import {useState} from "react";
import {Field, Form, Formik} from "formik";
import Modal from "./Modal";
import {useAppSelector} from "../redux/hooks";
import {selectAuthUserData} from "../redux/slices/auth";
import {log} from "util";

interface PropsType {
    title: string,
    isListRecordsPage?: boolean
    isSearch?: boolean
    isInteraction?: boolean
    selectedTrackId?: string,
    selectColumn?: (any) => void
    setPageSize?: (number) => void
    pageSize?: number
}

const TitlePage: React.FC<PropsType> = ({
                                            title,
                                            isListRecordsPage = false,
                                            isSearch = false,
                                            isInteraction = false,
                                            selectedTrackId,
                                            selectColumn,
                                            setPageSize,
                                            pageSize
                                        }) => {

    const [popupSelectColumns, setPopupSelectColumns] = useState(false)
    const [popupSaveFilter, setPopupSaveFilter] = useState(false)

    const onSubmitSaveFilterForm = data => {
        alert(data)
        setPopupSaveFilter(false)
    }

    const userData = useAppSelector(selectAuthUserData)
    const businessAttributes = userData.BusinessAttributes[0]

    // Сортировака столбцов по алфавиту
    // const sortableBusinessAttributes = [];
    // for (const key in businessAttributes) {
    //     sortableBusinessAttributes.push([businessAttributes[key]]);
    // }
    // sortableBusinessAttributes.sort();

    const possibleListPageSize = [10, 25, 50, 100]

    return (
        <>
            <div className={styles.title}>
                <h2>{title}</h2>
                {isListRecordsPage && <div className={styles.title__count}>
                    <p>Записей на странице</p>
                    {possibleListPageSize.map(size => (
                        <button key={size} className={size === pageSize ? styles.active : ""}
                                onClick={() => setPageSize(size)}
                        >{size}</button>
                    ))}
                </div>}
                {isListRecordsPage && <div className={styles.title__actions}>
                    {userData.Capabilities[0].CanDetailView === 'true' && <Link href={`/list/${selectedTrackId}`}
                                                                                className={styles.title__actions__btn_outline}>Взаимодействие</Link>}
                    <button
                        className={styles.title__actions__btn_outline}
                        onClick={() => setPopupSelectColumns(true)}
                    >
                        Выбор столбцов
                    </button>
                    <Link href="/" className={styles.title__actions__btn_fill}>
                        <span className={styles.count}>5</span>
                        Фильтр
                    </Link>
                </div>}
                {isSearch && <div className={styles.title__actions}>
                    <button className={styles.title__actions__btn_outline}
                            onClick={() => setPopupSaveFilter(true)}>Сохранить фильтр
                    </button>
                    <Link href="/filters" className={styles.title__actions__btn_fill}>Выбрать фильтр</Link>
                </div>}
                {isInteraction && <div className={styles.title__actions}>
                    <Link href="/list" className={styles.title__actions__btn_outline}>Вернуться к списку</Link>
                </div>}
            </div>
            <Modal isNegative={false}
                   title="Выберите столбцы"
                   cancelText="Отменить"
                   confirmText="Выбрать"
                   cancel={() => setPopupSelectColumns(false)}
                   form={"selectColumnsForm"}
                   active={popupSelectColumns}
                   setActive={setPopupSelectColumns}
            >
                <Formik
                    initialValues={{columns: []}}
                    onSubmit={values => selectColumn(values)}
                >
                    <Form id="selectColumnsForm" className={styles.selectColumnsForm}>
                        <div className={styles.wrapper}>
                            <div className={styles.selectColumnsForm__columns}>
                                {Object.keys(businessAttributes).map(key => (
                                    <label key={key}>
                                        <Field type="checkbox" value={key} name="columns"/>
                                        {businessAttributes[key]}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </Form>
                </Formik>
            </Modal>
            <Modal isNegative={false}
                   title="Сохранить фильтр"
                   text="Вы хотите сохранить текущий фильтр."
                   cancelText="Отменить"
                   confirmText="Сохранить"
                   cancel={() => setPopupSaveFilter(false)}
                   active={popupSaveFilter}
                   setActive={setPopupSaveFilter}
                   form={"saveFilterForm"}
                   confirm={() => {
                   }}
            >
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
            </Modal>
        </>
    )
};

export default TitlePage;