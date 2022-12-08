import Link from "next/link";
import styles from '../styles/titlePage.module.scss'
import {useState} from "react";
import {Field, Form, Formik} from "formik";
import Modal from "./Modal";

interface PropsType {
    title: string,
    isListRecordsPage?: boolean
    isSearch?: boolean
    isInteraction?: boolean
    selectedTrackId?: string
}

const TitlePage: React.FC<PropsType> = ({
                       title,
                       isListRecordsPage = false,
                       isSearch = false,
                       isInteraction = false,
                       selectedTrackId
                   }) => {

    const [popupSelectColumns, setPopupSelectColumns] = useState(false)
    const [popupSaveFilter, setPopupSaveFilter] = useState(false)

    const onSubmitSaveFilterForm = data => {
        alert(data)
        setPopupSaveFilter(false)
    }

    return (
        <>
            <div className={styles.title}>
                <h2>{title}</h2>
                {isListRecordsPage && <div className={styles.title__count}>
                    <p>Записей на странице</p>
                    <button className={styles.active}>10</button>
                    <button>25</button>
                    <button>50</button>
                    <button>100</button>
                </div>}
                {isListRecordsPage && <div className={styles.title__actions}>
                    <Link href={`/list/${selectedTrackId}`}
                          className={styles.title__actions__btn_outline}>Взаимодействие</Link>
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
                    onSubmit={async (values) => {
                        await new Promise((r) => setTimeout(r, 500));
                        alert(JSON.stringify(values, null, 2));
                        setPopupSelectColumns(false)
                    }}
                >
                    <Form id="selectColumnsForm" className={styles.selectColumnsForm}>
                        <div className={styles.wrapper}>
                            <div className={styles.selectColumnsForm__columns}>
                                <label>
                                    <Field type="checkbox" value="datetime" name="columns"/>
                                    Дата и время
                                </label>
                                <label>
                                    <Field type="checkbox" value="mediaChanel" name="columns"/>
                                    Медиаканал
                                </label>
                                <label>
                                    <Field type="checkbox" value="agent" name="columns"/>
                                    Агент
                                </label>
                                <label>
                                    <Field type="checkbox" value="callFromNumber" name="columns"/>
                                    Звонок с номера
                                </label>
                                <label>
                                    <Field type="checkbox" value="callToNumber" name="columns"/>
                                    Звонок на номер
                                </label>
                                <label>
                                    <Field type="checkbox" value="direction" name="columns"/>
                                    Направление
                                </label>
                                <label>
                                    <Field type="checkbox" value="duration" name="columns"/>
                                    Длительность
                                </label>
                                <label>
                                    <Field type="checkbox" value="typeClient" name="columns"/>
                                    Тип клиента
                                </label>
                                <label>
                                    <Field type="checkbox" value="interactionId" name="columns"/>
                                    Идентификатор взаимодействия
                                </label>
                                <label>
                                    <Field type="checkbox" value="_CB_DIM_CHANNEL" name="columns"/>
                                    _CB_DIM_CHANNEL
                                </label>
                                <label>
                                    <Field type="checkbox" value="_CB_DIM_TYPE" name="columns"/>
                                    _CB_DIM_TYPE
                                </label>
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
                   confirm={()=>{}}
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