import Link from "next/link"
import Select from "react-select"
import styles from '../styles/search.module.scss'
import Modal from "./Modal"
import {Formik, Form, Field} from "formik";
import RadioBtn from "./RadioBtn"
import {useState} from "react"
import {useForm} from "react-hook-form"


const Search = () => {
    const selectStyles = {
        control: () => ({
            border: '2px solid #EEEDF0',
            width: '100%',
            height: 36,
            display: 'flex',
            alignItems: 'center',
            borderRadius: 7,
            fontSize: 11
        })
    }
    const selectTheme = theme => ({
        ...theme,
        borderRadius: 0,
        colors: {
            ...theme.colors,
            neutral50: '#C8C8C8',  // Placeholder color
        }
    })
    const selectComponents = {
        IndicatorSeparator: () => null
    }

    const [popupSaveFilter, setPopupSaveFilter] = useState(false)
    const [popupSelectColumns, setPopupSelectColumns] = useState(false)

    const {register, handleSubmit, formState: {errors}} = useForm();
    const onSubmitSaveFilterForm = data => {
        console.log(data)
        setPopupSaveFilter(false)
    }

    return (
        <>
            <main className={styles.main}>
                {/*todo: component}*/}
                <div className={`${styles.main__title} ${styles.main__item}`}>
                    <h2>Поиск записей</h2>
                    <button className={styles.saveFilter}
                            onClick={() => setPopupSaveFilter(true)}>Сохранить фильтр
                    </button>
                    <button className={styles.selectColumn}
                            onClick={() => setPopupSelectColumns(true)}>Выбор столбцов
                    </button>
                    <Link href="/filters" className={styles.selectFilter}>Выбрать фильтр</Link>
                </div>

                <div className={`${styles.main__item} ${styles.main__item_50p}`}>
                    <h3>Временной диапазон</h3>
                    <div>
                        <input type="datetime-local" placeholder='От'/>
                        <input type="datetime-local" placeholder='До'/>
                    </div>
                </div>
                <div className={`${styles.main__item} ${styles.main__item_50p}`}>
                    <h3>Ограничения по длительности</h3>
                    <div>
                        <input type="text" placeholder='От'/>
                        <input type="text" placeholder='До'/>
                    </div>
                </div>
                <div className={`${styles.main__item} ${styles.main__item_50p}`}>
                    <h3>Информация по взаимодействию </h3>
                    <div>
                        <Select options={[
                            {value: 0, label: 'Все медиаканалы'},
                            {value: 1, label: '1'},
                            {value: 2, label: '2'},
                            {value: 3, label: '3'}
                        ]}
                                instanceId="mediaChanel"
                                placeholder='Медиаканал'
                                styles={selectStyles}
                                components={selectComponents}
                                theme={selectTheme}
                        />
                        <input type="text" placeholder='Проект'/>
                        <Select options={[
                            {value: 0, label: 'Все направления'},
                            {value: 1, label: '1'},
                            {value: 2, label: '2'},
                            {value: 3, label: '3'}
                        ]}
                                instanceId="direction"
                                placeholder='Направление'
                                styles={selectStyles}
                                components={selectComponents}
                                theme={selectTheme}
                        />
                        <input type="text" placeholder='Введите результат'/>
                    </div>
                </div>
                <div className={`${styles.main__item} ${styles.main__item_50p}`}>
                    <h3>Информация по услуге</h3>
                    <div>
                        <input type="text" placeholder='Введите тип услуги'/>
                        <input type="text" placeholder='Название услуги'/>
                        <input type="text" placeholder='Название задачи'/>
                        <input type="text" placeholder='Номер задачи'/>
                    </div>
                </div>
                <div className={`${styles.main__item} ${styles.main__item_50p}`}>
                    <h3>Номера телефонов</h3>
                    <div>
                        <input type="text" placeholder='Звонок с номера'/>
                        <input type="text" placeholder='Звонок на номер'/>
                    </div>
                </div>
                <div className={`${styles.main__item} ${styles.main__item_25p}`}>
                    <h3>Агенты</h3>
                    <input type="text" placeholder='Введите имя агента'/>
                </div>
                <div className={`${styles.main__item} ${styles.main__item_25p}`}>
                    <h3>Информация по клиенту</h3>
                    <input type="text" placeholder='Введите тип клиента'/>
                </div>
                <div className={`${styles.main__item}`}>
                    <h3>Дополнительные данные для поиска</h3>
                    <div className={styles.additionalParam}>
                        <input type="text" placeholder='Введите параметр' className={styles.name}/>
                        <input type="text" placeholder='Введите значение' className={styles.value}/>
                        <label className={styles.additionalParam__checkbox}>
                            <input type="checkbox"/>
                            Отключено
                        </label>
                    </div>
                    <button className={styles.addAdditionalParam}>+ Добавить</button>
                </div>
            </main>
            <Modal isNegative={false}
                   title="Сохранить фильтр"
                   text="Вы хотите сохранить текущий фильтр."
                   cancelText="Отменить"
                   confirmText="Сохранить"
                   cancel={() => setPopupSaveFilter(false)}
                   active={popupSaveFilter}
                   setActive={setPopupSaveFilter}
                   form={"saveFilterForm"}
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
                    initialValues={{
                        columns: []
                    }}
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
        </>
    )
};

export default Search;