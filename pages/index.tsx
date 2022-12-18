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

const Player = dynamic(
    () => import('../components/Player'),
    {ssr: false}
)


const Index = () => {

    const [error, setError] = useState(null)


    // Очистка поиска
    const [popupResetFilter, setPopupResetFilter] = useState(false)

    const defaultValues = {
        'mediatype': '',
        'metadataQuery.Project': '',
        'type': '',
        'metadataQuery.serviceType': '',
        'metadataQuery.serviceName': '',
        'additionalParams.p_1.name': ''
    }

    const resetFilter = () => {
        reset(defaultValues)
        setAdditionalParams(initialAdditionalParams)
        setPopupResetFilter(false)
    }

    //обнуление пагинации в списке записей
    useEffect(() => {
        window.localStorage.setItem('currentPage', '1')
    })

    const userData = useAppSelector(selectAuthUserData)

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


    const initialAdditionalParams = [
        {
            id: 1,
            name: "",
            value: "",
            not: false
        }
    ]
    const [additionalParams, setAdditionalParams] = useState(initialAdditionalParams)

    const AddAdditionalParam = () => {
        setAdditionalParams([
            ...additionalParams,
            {
                id: additionalParams.length + 1,
                name: "",
                value: "",
                not: false
            }
        ])
    }

    const [inputDateFromColor, setInputDateFromColor] = useState("#C8C8C8")
    const [inputDateToColor, setInputDateToColor] = useState("#C8C8C8")

    const {register, handleSubmit, formState, reset, control} = useForm()

    const dispatch = useAppDispatch()
    const router = useRouter()

    const onSubmit = async (dto) => {
        try {
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
                if (additionalParams[param].name) {
                    metaData.push(additionalParams[param])
                }
            }
            delete dto.additionalParams
            metaData = metaData.filter(item => item)

            // Формирование окончательного запроса (удаление пустых полей)
            const preData = {...dto, metadataQuery: metaData}
            let dataQuery: dataQuery = {}

            Object.keys(preData).map(key => {
                if (preData[key]) {
                    dataQuery[key] = preData[key]
                }
            })

            if (!dataQuery.metadataQuery.length) {
                delete dataQuery.metadataQuery
            }

            // console.log(dataQuery)

            // Отправка запроса
            const data = await Api().recordings.search(dataQuery)
            dispatch(setRecordings(data))
            setError(null)
            router.push('/list')
        } catch (e) {
            if (e.response.status === 404) {
                setError('Записи не найдены')
            }
        }
    }

    const setDefaultOption = (value: string) => ([{value: "", label: value}])

    let mediaTypeOptions = setDefaultOption('Все медиаканалы')
    let projectsOptions = setDefaultOption('Все проекты')
    let serviceNamesOptions = setDefaultOption('Все названия')
    let serviceTypesOptions = setDefaultOption('Все типы')
    let typesOptions = setDefaultOption('Все направления')

    const parseMetadataValues = (values: {name: string, displayName: string}[]) => (
        values.map(v => ({value: v.name, label: v.displayName}))
    )

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

    const additionalParamsOptions = setDefaultOption('Не выбрано')
    userData?.AdditionalSearchMetadata.map(i => {
        additionalParamsOptions.push({value: i, label: i})
    })

    return (
        <>
            <Header isSearchAction={true} setPopupResetFilter={setPopupResetFilter}/>
            <div className={styles.container}>
                <Player />
                <>
                    <TitlePage title="Поиск записей" isSearch={true}/>
                    <form onSubmit={handleSubmit(onSubmit)} className={styles.main} id="main-form">
                        <div className={`${styles.main__item} ${styles.main__item_50p}`}>
                            <h3>Временной диапазон</h3>
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
                                <input type="text" {...register('metadataQuery.serviceTask')} placeholder='Название задачи'/>
                                <input type="text" {...register('metadataQuery.caseId')} placeholder='Номер задачи'/>
                            </div>
                        </div>
                        <div className={`${styles.main__item} ${styles.main__item_50p}`}>
                            <h3>Номера телефонов</h3>
                            <div>
                                <input type="text" {...register('externalDN')} placeholder='Номер клиента'/>
                                <input type="text" {...register('localDN')} placeholder='Номер агента'/>
                            </div>
                        </div>
                        <div className={`${styles.main__item} ${styles.main__item_25p}`}>
                            <h3>Агенты</h3>
                            <input type="text" {...register('username')} placeholder='Введите имя агента'/>
                        </div>
                        <div className={`${styles.main__item} ${styles.main__item_25p}`}>
                            <h3>Информация по клиенту</h3>
                            <input type="text" {...register('metadataQuery.CustomerType')} placeholder='Введите тип клиента'/>
                        </div>
                        <div className={`${styles.main__item}`}>
                            <h3>Дополнительные данные для поиска</h3>
                            {additionalParams.map((param, index) => {
                                return (
                                    <div key={param.id} className={styles.additionalParam}>
                                        <Controller name={`additionalParams.p_${index + 1}.name`}
                                                    control={control}
                                                    render={({field: {onChange, value}}) => (
                                                        <Select
                                                            className={styles.additionalParam__name}
                                                            options={additionalParamsOptions}
                                                            instanceId={`param` + index}
                                                            placeholder='Введите параметр'
                                                            styles={selectStyles}
                                                            components={selectComponents}
                                                            theme={selectTheme}
                                                            value={additionalParamsOptions.find(c => c.value === value)}
                                                            onChange={val => onChange(val.value)}
                                                        />
                                                    )}
                                        />
                                        <input type="text"
                                               {...register(`additionalParams.p_${index + 1}.value`)}
                                               placeholder='Введите значение'
                                               className={styles.additionalParam__value}
                                               defaultValue={param.value}
                                            // onChange={e => onChangeAddParam(param.id, 'value', e.target.value)}
                                        />
                                        <label className={styles.additionalParam__checkbox}>
                                            <input type="checkbox"
                                                   {...register(`additionalParams.p_${index + 1}.not`)}
                                                // defaultChecked={!!param.isOn}
                                                // onChange={e => onChangeAddParam(param.id, 'isOn', e.target.checked)}
                                            />
                                            {param.not ? "Включено" : "Отключено"}
                                        </label>
                                    </div>
                                )
                            })}
                            <div style={{cursor: 'pointer'}} onClick={AddAdditionalParam} className={styles.addAdditionalParam}>+ Добавить</div>
                        </div>
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
        starttime?:string,
        stoptime?:string,
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

    type metadataQuery = {not: boolean, name: string, value: string}[]
};

export default Index;