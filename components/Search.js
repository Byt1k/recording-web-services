import Select from "react-select"
import styles from '../styles/search.module.scss'
import TitlePage from "./TitlePage";
import {useState} from "react";


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
        console.log(id)
        setAdditionalParams(
            additionalParams.map(item => (
                item.id === id ? {...item, [param]: payload } : item
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


    // console.log(additionalParams)

    return (
        <>
            <TitlePage title="Поиск записей" isSearch={true}/>
            <main className={styles.main}>
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
                    {additionalParams.map(param => {
                        return (
                            <div key={param.id} className={styles.additionalParam}>
                                <input type="text"
                                       name={"name" + param.id}
                                       placeholder='Введите параметр'
                                       className={styles.name}
                                       defaultValue={param.name}
                                       onChange={e => onChangeAddParam(param.id, 'name', e.target.value)}
                                />
                                <input type="text"
                                       name={"value" + param.id}
                                       placeholder='Введите значение'
                                       className={styles.value}
                                       defaultValue={param.value}
                                       onChange={e => onChangeAddParam(param.id, 'value', e.target.value)}
                                />
                                <label className={styles.additionalParam__checkbox}>
                                    <input type="checkbox"
                                           name={"isOn" + param.id}
                                           defaultChecked={!!param.isOn}
                                           onChange={e => onChangeAddParam(param.id, 'isOn', e.target.checked)}
                                    />
                                    {param.isOn ? "Включено": "Отключено"}
                                </label>
                            </div>
                        )
                    })}
                    <button onClick={()=>AddAdditionalParam()} className={styles.addAdditionalParam}>+ Добавить</button>
                </div>
            </main>
        </>
    )
};

export default Search;