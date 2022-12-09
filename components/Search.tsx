import Select from "react-select"
import styles from '../styles/search.module.scss'
import TitlePage from "./TitlePage";
import {useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {useAppDispatch} from "../redux/hooks";
import {useRouter} from "next/router";
import {Api} from "../api";
import {setRecordings} from "../redux/slices/recordings";


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

    const [additionalParams, setAdditionalParams] = useState([
        {
            id: 1,
            name: "",
            value: "",
            isOn: false
        }
    ])

    const onChangeAddParam = (id, param, payload) => {
        setAdditionalParams(
            additionalParams.map(item => (
                item.id === id ? {...item, [param]: payload} : item
            ))
        )
    }

    const AddAdditionalParam = () => {
        setAdditionalParams([
            ...additionalParams,
            {
                id: additionalParams.length + 1,
                name: "",
                value: "",
                isOn: false
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

            const data = await Api().recordings.search(dto)
            dispatch(setRecordings(data))

            router.push('/list')

        } catch (e) {
            console.warn('Register err: ', e)
        }
    }

    const projectOptions = [
        {value: 0, label: 'Все направления'},
        {value: 1, label: '1'},
        {value: 2, label: '2'},
        {value: 3, label: '3'}
    ]

    const chanelOptions = [
        {value: 0, label: 'Все медиаканалы'},
        {value: 1, label: '1'},
        {value: 2, label: '2'},
        {value: 3, label: '3'}
    ]

    return (
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
                        <Controller name='chanel'
                                    control={control}
                                    render={({ field: { onChange, value}}) => (
                                        <Select
                                            options={chanelOptions}
                                            instanceId="chanel"
                                            placeholder='Медиаканал'
                                            styles={selectStyles}
                                            components={selectComponents}
                                            theme={selectTheme}
                                            value={chanelOptions.find(c => c.value === value)}
                                            onChange={val => onChange(val.value)}
                                        />
                                    )}
                        />

                        <input type="text" placeholder='Проект'/>
                        <Controller name='project'
                                    control={control}
                                    render={({ field: { onChange, value}}) => (
                                        <Select
                                            options={projectOptions}
                                            instanceId="direction"
                                            placeholder='Направление'
                                            styles={selectStyles}
                                            components={selectComponents}
                                            theme={selectTheme}
                                            value={projectOptions.find(c => c.value === value)}
                                            onChange={val => onChange(val.value)}
                                        />
                                    )}
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
                    {additionalParams.map(param => {
                        return (
                            <div key={param.id} className={styles.additionalParam}>
                                <input type="text"
                                       placeholder='Введите параметр'
                                       className={styles.name}
                                       defaultValue={param.name}
                                       onChange={e => onChangeAddParam(param.id, 'name', e.target.value)}
                                />
                                <input type="text"
                                       placeholder='Введите значение'
                                       className={styles.value}
                                       defaultValue={param.value}
                                       onChange={e => onChangeAddParam(param.id, 'value', e.target.value)}
                                />
                                <label className={styles.additionalParam__checkbox}>
                                    <input type="checkbox"
                                           defaultChecked={!!param.isOn}
                                           onChange={e => onChangeAddParam(param.id, 'isOn', e.target.checked)}
                                    />
                                    {param.isOn ? "Включено" : "Отключено"}
                                </label>
                            </div>
                        )
                    })}
                    <button onClick={AddAdditionalParam} className={styles.addAdditionalParam}>+ Добавить</button>
                </div>
            </form>
        </>
    )
};

export default Search;