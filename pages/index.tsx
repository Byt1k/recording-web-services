import dynamic from 'next/dynamic'
import styles from '../styles/search.module.scss'
import Header from "../components/Header";
import {useEffect, useState} from "react";
import Modal from "../components/Modal";
import {useAppDispatch, useAppSelector} from "../redux/hooks";
import {selectAuthUserData} from "../redux/slices/auth";
import {Controller, useForm} from "react-hook-form";
import {useRouter} from "next/router";
import {Api} from "../api";
import {setRecordings} from "../redux/slices/recordings";
import TitlePage from "../components/TitlePage";
import Select from "react-select";
import modalStyles from "../styles/modal.module.scss";
import dateToISO from "../utils/dateToISO";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrashCan} from "@fortawesome/free-regular-svg-icons";
import Preloader from "../components/Preloader";
import {setIsPlaying, setRecordingDetail} from "../redux/slices/recordingDetail";
import selectTimeRange, {TimeRange} from "../utils/selectTimeRange";

const Player = dynamic(
    () => import('../components/Player'),
    {ssr: false}
)

const Index = () => {

    const [isFetching, setIsFetching] = useState(false)

    const [error, setError] = useState(null)
    const [popupResetFilter, setPopupResetFilter] = useState(false)

    const possibleDateOptions: Array<{ value: TimeRange, label: string }> = [
        {value: "custom", label: "Пользовательская дата"},
        {value: "currentDay", label: "Текущий день"},
        {value: "prevDay", label: "Предыдущий день"},
        {value: "currentWeek", label: "Текущая неделя"},
        {value: "prevWeek", label: "Предыдущая неделя"},
        {value: "currentMonth", label: "Текущий месяц"},
        {value: "prevMonth", label: "Предыдущий месяц"},
        {value: "currentQuarter", label: "Текущий квартал"},
        {value: "prevQuarter", label: "Предыдущий квартал"},
        {value: "currentYear", label: "Текущий год"},
        {value: "prevYear", label: "Предыдущий год"},
    ]

    const [timeRange, setTimeRange] = useState<ReturnType<typeof selectTimeRange>>({start: "", end: ""})

    useEffect(() => {
        setValue('starttime', timeRange.start)
        setValue('stoptime', timeRange.end)
    }, [timeRange])

    const initValues = {
        timeRange: 'custom',
        starttime: '',
        stoptime: '',
        minDuration: '',
        maxDuration: '',
        mediatype: '',
        'metadataQuery.Project': '',
        type: '',
        'metadataQuery.businessResult': '',
        'metadataQuery.serviceType': '',
        'metadataQuery.serviceName': '',
        'metadataQuery.serviceTask': '',
        'metadataQuery.caseId': '',
        externalDN: '',
        localDN: '',
        username: '',
        'metadataQuery.CustomerType': '',
        'additionalParams.p_1.name': '',
        'additionalParams.p_1.not': '',
        'additionalParams.p_1.value': ''
    }

    const {register, handleSubmit, reset, control, getValues, setValue} = useForm()

    // Сохранение полей формы поиска
    const formValues = getValues()

    useEffect(() => {
        const values = JSON.parse(localStorage.getItem('formValues'))
        reset(values)
        values?.additionalParams && setAdditionalParams(Object.keys(values.additionalParams || {}).map((param) => {
            return {
                id: param.split('_').reverse()[0],
                ...values.additionalParams[param]
            }
        }))
    }, [])

    useEffect(() => {
        localStorage.setItem('formValues', JSON.stringify(formValues))
    }, [formValues])

    // Очистка формы
    const resetFilter = () => {
        localStorage.removeItem('formValues')
        setAdditionalParams(initialAdditionalParams)
        reset(initValues)
        setSelectedAdditionalParams({})
        setPopupResetFilter(false)
    }

    const userData = useAppSelector(selectAuthUserData)

    // Стилизация селектов
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

    const selectDateOptions = {
        control: () => ({
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            height: 20,
            width: 210
        })
    }


    const [inputDateFromColor, setInputDateFromColor] = useState("#C8C8C8")
    const [inputDateToColor, setInputDateToColor] = useState("#C8C8C8")

    const dispatch = useAppDispatch()
    const router = useRouter()

    // Формирование и отправка поискового запроса
    const onSubmit = async (dto) => {
        setIsFetching(true)
        try {
            // Обнуление пагинации
            localStorage.setItem('currentPage', '1')

            // Формирование метадаты
            const {metadataQuery} = dto
            let metaData = Object.keys(metadataQuery).map(key => {
                if (metadataQuery[key]) {
                    return {
                        not: false,
                        name: key,
                        value: metadataQuery[key]
                    }
                }
            })

            // Добавление в метадату дополнительных параметров
            const {additionalParams} = dto
            for (const param in additionalParams) {
                if (!additionalParams[param].not) {
                    additionalParams[param].not = 'false'
                }
                if (additionalParams[param].name) {
                    metaData.push(additionalParams[param])
                }
            }
            delete dto.additionalParams
            metaData = metaData.filter(item => item)

            // Обработка даты
            let {starttime, stoptime} = dto
            starttime = dateToISO(starttime)
            stoptime = dateToISO(stoptime)

            // Формирование окончательного запроса (удаление пустых полей)
            const preData = {...dto, metadataQuery: metaData, starttime, stoptime}
            let dataQuery: dataQuery = {}

            Object.keys(preData).map(key => {
                if (preData[key]) {
                    dataQuery[key] = preData[key]
                }
            })

            if (!dataQuery.metadataQuery.length) {
                delete dataQuery.metadataQuery
            }

            // Отправка запроса
            const data = await Api().recordings.search(dataQuery)
            dispatch(setRecordings(data))

            // Обнуление выбранной записи
            dispatch(setRecordingDetail(null))
            dispatch(setIsPlaying({recordid: null, isPlaying: false}))
            setError(null)

            await router.push('/list')
            setIsFetching(false)
        } catch (e) {
            console.log(e)
            setIsFetching(false)
            setError('Записи не найдены')
        }
    }

    // Функция задания опции селекта по умолчанию
    const setDefaultOption = (value: string) => ([{value: "", label: value}])

    let mediaTypeOptions = setDefaultOption('Все медиаканалы')
    let projectsOptions = setDefaultOption('Все проекты')
    let serviceNamesOptions = setDefaultOption('Все названия')
    let serviceTypesOptions = setDefaultOption('Все типы')
    let typesOptions = setDefaultOption('Все направления')

    // Функция привидения опций к нужному виду
    const parseMetadataValues = (values: { name: string, displayName: string }[]) => (
        values.map(v => ({value: v.name, label: v.displayName}))
    )

    // Формирование опций селектов
    userData?.Enums.map(item => {
        if (item.name === 'mediatype') {
            const mediaTypeValues = parseMetadataValues(item.values)
            mediaTypeOptions = [...mediaTypeOptions, ...mediaTypeValues]
        }
        if (item.name === 'Project') {
            const projectValues = parseMetadataValues(item.values)
            projectsOptions = [...projectsOptions, ...projectValues]
        }
        if (item.name === 'serviceName') {
            const serviceNameValues = parseMetadataValues(item.values)
            serviceNamesOptions = [...serviceNamesOptions, ...serviceNameValues]
        }
        if (item.name === 'serviceType') {
            const serviceTypeValues = parseMetadataValues(item.values)
            serviceTypesOptions = [...serviceTypesOptions, ...serviceTypeValues]
        }
        if (item.name === 'type') {
            const typesValues = parseMetadataValues(item.values)
            typesOptions = [...typesOptions, ...typesValues]
        }
    })

    // Дополнительные поля для поиска
    const initialAdditionalParams = [{
        id: 1,
        name: "",
        value: "",
        not: "false"
    }]

    const [additionalParams, setAdditionalParams] = useState(initialAdditionalParams)

    const addAdditionalParam = () => {
        setAdditionalParams([
            ...additionalParams,
            {
                id: new Date().getTime(),
                name: "",
                value: "",
                not: "false"
            }
        ])
    }

    const deleteAdditionalParam = (id) => {
        const {additionalParams: params, ...formValues} = getValues()
        delete params[`p_${id}`]

        reset({
            ...formValues,
            additionalParams: params
        })

        delete selectedAdditionalParams[`p_${id}`]

        setAdditionalParams(() => (
            additionalParams.filter(param => param.id !== id)
        ))
    }
    //

    // Селекты доп параметров поиска
    const additionalParamsOptions = setDefaultOption('Не выбрано')
    userData?.AdditionalSearchMetadata.map(i => {
        additionalParamsOptions.push({value: i, label: userData?.BusinessAttributes[0][i]})
    })

    const notOptions = [
        {value: 'false', label: 'Равно'},
        {value: 'true', label: 'Не равно'}
    ]

    // Фильтрация выбора доп параметра только единажды
    const [selectedAdditionalParams, setSelectedAdditionalParams] = useState({})
    const [visibleAddParamsOptions, setVisibleAddParamsOptions] = useState([])

    const {additionalParams: params} = getValues()

    useEffect(() => {
        Object.keys(params || {}).map(p => {
            setSelectedAdditionalParams({
                ...selectedAdditionalParams,
                [p]: params[p].name
            })
        })
    }, [params])

    useEffect(() => {
        const selectedAddValues = Object.keys(selectedAdditionalParams).map(key => selectedAdditionalParams[key])

        let visibleAddParamsOptions = additionalParamsOptions.map(item => {
            if (item.value === '') {
                return item
            }
            if (selectedAddValues.indexOf(item.value) === -1) {
                return item
            }
        })
        setVisibleAddParamsOptions(visibleAddParamsOptions.filter(param => param !== undefined))

    }, [selectedAdditionalParams])

    const canStandartForm = userData?.Capabilities[0].CanStandartForm === 'true'

    if (isFetching) {
        return <Preloader/>
    }

    return (
        <>
            <Header isSearchAction={true} setPopupResetFilter={setPopupResetFilter}/>
            <div className={styles.container}>
                <Player/>
                <>
                    <TitlePage title="Поиск записей" isSearch={true} getFormValues={getValues}/>
                    <form onSubmit={handleSubmit(onSubmit)} className={styles.main} id="main-form">
                        <div className={`${styles.main__item} ${styles.main__item_50p}`}>
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                whiteSpace: "nowrap",
                            }}>
                                <h3>Временной диапазон</h3>
                                <Controller name='timeRange'
                                            control={control}
                                            render={({field: {onChange, value}}) => (
                                                <Select
                                                    options={possibleDateOptions}
                                                    instanceId="timeRange"
                                                    defaultValue={possibleDateOptions[0]}
                                                    styles={selectDateOptions}
                                                    components={selectComponents}
                                                    value={possibleDateOptions.find(c => c.value === value)}
                                                    onChange={e => {
                                                        setTimeRange(selectTimeRange(e.value))
                                                        onChange(e.value)
                                                    }}
                                                />)}
                                />
                            </div>
                            <div>
                                <input type="datetime-local"
                                       {...register('starttime')}
                                       style={{color: inputDateFromColor}}
                                       onChange={(e) => (
                                           setInputDateFromColor(e.target.value ? "#000" : "#C8C8C8")
                                       )}/>
                                <input type="datetime-local"
                                       {...register('stoptime')}
                                       style={{color: inputDateToColor}}
                                       onChange={(e) => (
                                           setInputDateToColor(e.target.value ? "#000" : "#C8C8C8")
                                       )}/>
                            </div>
                        </div>
                        <div className={`${styles.main__item} ${styles.main__item_50p}`}>
                            <h3>Ограничения по длительности</h3>
                            <div>
                                <input type="text" placeholder='От' {...register('minDuration')}/>
                                <input type="text" placeholder='До' {...register('maxDuration')}/>
                            </div>
                        </div>
                        <div className={`${styles.main__item} ${styles.main__item_50p}`}>
                            <h3>Информация по взаимодействию </h3>
                            <div>
                                <Controller name='mediatype'
                                            control={control}
                                            render={({field: {onChange, value}}) => (
                                                <Select
                                                    options={mediaTypeOptions}
                                                    instanceId="mediatype"
                                                    placeholder='Медиаканал'
                                                    styles={selectStyles}
                                                    components={selectComponents}
                                                    theme={selectTheme}
                                                    value={mediaTypeOptions.find(c => c.value === value)}
                                                    onChange={val => onChange(val.value)}
                                                />
                                            )}
                                />
                                <Controller name='metadataQuery.Project'
                                            control={control}
                                            render={({field: {onChange, value}}) => (
                                                <Select
                                                    options={projectsOptions}
                                                    instanceId="Project"
                                                    placeholder='Проект'
                                                    styles={selectStyles}
                                                    components={selectComponents}
                                                    theme={selectTheme}
                                                    value={projectsOptions.find(c => c.value === value)}
                                                    onChange={val => onChange(val.value)}
                                                />
                                            )}
                                />
                                <Controller name='type'
                                            control={control}
                                            render={({field: {onChange, value}}) => (
                                                <Select
                                                    options={typesOptions}
                                                    instanceId="direction"
                                                    placeholder='Направление'
                                                    styles={selectStyles}
                                                    components={selectComponents}
                                                    theme={selectTheme}
                                                    value={typesOptions.find(c => c.value === value)}
                                                    onChange={val => onChange(val.value)}
                                                />
                                            )}
                                />
                                <input type="text" {...register('metadataQuery.businessResult')}
                                       placeholder='Введите результат'/>
                            </div>
                        </div>
                        {canStandartForm &&
                            <div className={`${styles.main__item} ${styles.main__item_50p}`}>
                                <h3>Информация по услуге</h3>
                                <div>
                                    <Controller name='metadataQuery.serviceType'
                                                control={control}
                                                render={({field: {onChange, value}}) => (
                                                    <Select
                                                        options={serviceTypesOptions}
                                                        instanceId="serviceType"
                                                        placeholder='Введите тип услуги'
                                                        styles={selectStyles}
                                                        components={selectComponents}
                                                        theme={selectTheme}
                                                        value={serviceTypesOptions.find(c => c.value === value)}
                                                        onChange={val => onChange(val.value)}
                                                    />
                                                )}
                                    />
                                    <Controller name='metadataQuery.serviceName'
                                                control={control}
                                                render={({field: {onChange, value}}) => (
                                                    <Select
                                                        options={serviceNamesOptions}
                                                        instanceId="serviceName"
                                                        placeholder='Название услуги'
                                                        styles={selectStyles}
                                                        components={selectComponents}
                                                        theme={selectTheme}
                                                        value={serviceNamesOptions.find(c => c.value === value)}
                                                        onChange={val => onChange(val.value)}
                                                    />
                                                )}
                                    />
                                    <input type="text" {...register('metadataQuery.serviceTask')}
                                           placeholder='Название задачи'/>
                                    <input type="text" {...register('metadataQuery.caseId')}
                                           placeholder='Номер задачи'/>
                                </div>
                            </div>}
                        <div
                            className={`${styles.main__item} ${canStandartForm ? styles.main__item_50p : styles.main__item_25p}`}>
                            <h3>Номера телефонов</h3>
                            <div style={canStandartForm ? {} : {gridTemplateColumns: '1fr'}}>
                                <input type="text" {...register('externalDN')} placeholder='Номер клиента'/>
                                <input type="text" {...register('localDN')} placeholder='Номер агента'/>
                            </div>
                        </div>
                        <div className={`${styles.main__item} ${styles.main__item_25p}`}>
                            <h3>Агенты</h3>
                            <input type="text" {...register('username')} placeholder='Введите имя агента'/>
                        </div>
                        {canStandartForm &&
                            <div className={`${styles.main__item} ${styles.main__item_25p}`}>
                                <h3>Информация по клиенту</h3>
                                <input type="text" {...register('metadataQuery.CustomerType')}
                                       placeholder='Введите тип клиента'/>
                            </div>}
                        {canStandartForm &&
                            <div className={`${styles.main__item}`}>
                                <h3>Дополнительные данные для поиска</h3>
                                {additionalParams.map((param, index) => {
                                    return (
                                        <div key={param.id} className={styles.additionalParam}>
                                            <Controller name={`additionalParams.p_${param.id}.name`}
                                                        control={control}
                                                        render={({field: {onChange, value}}) => (
                                                            <Select
                                                                className={styles.additionalParam__name}
                                                                options={visibleAddParamsOptions}
                                                                instanceId={`param` + param.id}
                                                                placeholder='Введите параметр'
                                                                styles={selectStyles}
                                                                components={selectComponents}
                                                                theme={selectTheme}
                                                                value={visibleAddParamsOptions.find(c => c.value === value)
                                                                    ? visibleAddParamsOptions.find(c => c.value === value)
                                                                    : additionalParamsOptions.find(c => c.value === value)
                                                                }
                                                                onChange={val => {
                                                                    onChange(val.value)
                                                                    setSelectedAdditionalParams({
                                                                        ...selectedAdditionalParams,
                                                                        [`p_${param.id}`]: val.value
                                                                    })
                                                                }}
                                                            />
                                                        )}
                                            />
                                            <Controller name={`additionalParams.p_${param.id}.not`}
                                                        control={control}
                                                        render={({field: {onChange, value}}) => (
                                                            <Select
                                                                className={styles.additionalParam__not}
                                                                options={notOptions}
                                                                value={notOptions.find(c => c.value === value)}
                                                                defaultValue={notOptions[0]}
                                                                instanceId={`param` + param.id}
                                                                styles={selectStyles}
                                                                components={selectComponents}
                                                                theme={selectTheme}
                                                                onChange={val => {
                                                                    onChange(val.value)
                                                                }}
                                                            />
                                                        )}
                                            />
                                            <input type="text" {...register(`additionalParams.p_${param.id}.value`)}
                                                   placeholder='Введите значение'
                                                   className={styles.additionalParam__value}
                                            />
                                            {param.id > 1 &&
                                                <FontAwesomeIcon icon={faTrashCan}
                                                                 className={styles.additionalParam__delete}
                                                                 onClick={() => deleteAdditionalParam(param.id)}/>}
                                        </div>
                                    )
                                })}
                                <div style={{cursor: 'pointer'}} onClick={addAdditionalParam}
                                     className={styles.addAdditionalParam}>+ Добавить
                                </div>
                            </div>
                        }
                    </form>
                </>
            </div>
            <Modal active={popupResetFilter} setActive={setPopupResetFilter} title='Сбросить фильтр?'
                   text='Вы хотите сбросить текущий фильтр.'>
                <div className={modalStyles.modal__content__action}>
                    <button onClick={() => setPopupResetFilter(false)}>Отменить</button>
                    <button className={modalStyles.negative} onClick={() => resetFilter()}>Сбросить</button>
                </div>
            </Modal>
            <Modal active={error} setActive={setError} title={error}>
                <div className={`${modalStyles.modal__content__action} ${modalStyles.modal__content_blue}`}
                     style={{justifyContent: 'center'}}>
                    <button className={modalStyles.positive} onClick={() => setError(null)}>Ок</button>
                </div>
            </Modal>
        </>
    )

    type dataQuery = {
        starttime?: string,
        stoptime?: string,
        maxDuration?: string,
        minDuration?: string,
        username?: string,
        localDn?: string,
        externalDn?: string,
        type?: string,
        mediatype?: string,
        metadataQuery?: metadataQuery,
        additionalParams?: any
    }

    type metadataQuery = { not: boolean, name: string, value: string }[]
};

export default Index;