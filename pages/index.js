import Header from "../components/Header";
import Select from 'react-select'
import styles from '../styles/common.module.scss'

import dynamic from 'next/dynamic'
import {parseBody} from "next/dist/server/api-utils/node";

const Player = dynamic(
    () => import('../components/Player'),
    {ssr: false}
)

const Index = () => {

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

    return (
        <>
            <Header/>
            <div className={styles.container}>
                <Player/>
                <main className={styles.main}>
                    <div className={`${styles.main__title} ${styles.main__item}`}>
                        <h2>Поиск записей</h2>
                        <button className={styles.saveFilter}>Сохранить фильтр</button>
                        <button className={styles.selectColumn}>Выбор столбцов</button>
                        <button className={styles.selectFilter}>Выбрать фильтр</button>
                    </div>
                    <div className={`${styles.main__item} ${styles.main__item_50p}`}>
                        <h3>Временной диапазон</h3>
                        <div>
                            <input type="date" placeholder='Выберите дату начала'/>
                            <input type="date" placeholder='Выберите дату конца'/>
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
                                {value: 1, label: '1'},
                                {value: 2, label: '2'},
                                {value: 3, label: '3'}
                            ]}
                                placeholder='Медиаканал'
                                styles={selectStyles}
                                components={selectComponents}
                                theme={selectTheme}
                            />
                            <input type="text" placeholder='Проект'/>
                            <Select options={[
                                {value: 1, label: '1'},
                                {value: 2, label: '2'},
                                {value: 3, label: '3'}
                            ]}
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

                <style jsx>{`
                  main {
                    padding-bottom: 10px;
                  }
                `}</style>
            </div>
        </>
    );
};

export default Index;