import Header from "../components/Header";
import Select from 'react-select'

const Index = () => {

    return (
        <>
            <Header />
            <div className="container">
                <div className="player">
                    <div className="player__audio"></div>
                    <div className="player__control">
                        <div className="left">
                            <img src="/play.svg" alt="play"/>
                            <img src="/stop.svg" alt="stop"/>
                            <img src="/prev.svg" alt="prev"/>
                            <img src="/next.svg" alt="next"/>
                            <img src="/volume.svg" alt="volume"/>
                            <Select
                                options={[
                                    { value: 1, label: '1x' },
                                    { value: 1.5, label: '1.5x' },
                                    { value: 2, label: '2x' }
                                ]}
                                defaultValue={{value: 1, label: '1x'}}
                                styles ={{
                                    control: () => ({
                                        border: '2px solid #EEEDF0',
                                        width: 90,
                                        height: 31,
                                        display: 'flex',
                                        borderRadius: 9
                                    })
                                }}
                                components={{
                                    IndicatorSeparator: () => null
                                }}
                            />
                            <p className="current-time">00:00:00</p>
                        </div>
                        <div className="right">
                            <button className="copy">
                                <img src="/copy.svg" alt="copy"/>
                                Копировать ссылку
                            </button>
                            <button className="download">
                                <img src="/download.svg" alt="download"/>
                                Скачать mp3
                            </button>
                            <p className="duration">00:04:47</p>
                        </div>
                    </div>
                </div>
                <main className='main'>
                    <div className="main__title main__item">
                        <h2>Поиск записей</h2>
                        <button className="select-column">Выбор столбцов</button>
                        <button className='filter-btn'>
                            Фильтр
                            <img src="/filter.svg" alt="filter"/>
                        </button>
                    </div>
                    <div className="main__item main__item_50p">
                        <h2>Временной диапазон</h2>
                        <div>
                            <p className="main__item__title">Дата и время начала</p>
                            <input type="date" placeholder='Выберите дату начала'/>
                        </div>
                        <div>
                            <p className="main__item__title">Дата и время конца</p>
                            <input type="date" placeholder='Выберите дату конца'/>
                        </div>
                    </div>
                    <div className="main__item main__item_50p">
                        <h2>Ограничения по длительности</h2>
                        <div>
                            <p className="main__item__title">Минимальная длительность</p>
                            <input type="text" placeholder='Введите минимальную длительность'/>
                        </div>
                        <div>
                            <p className="main__item__title">Максимальная длительность</p>
                            <input type="text" placeholder='Введите максимальную длительность'/>
                        </div>
                    </div>
                    <div className="main__item main__item_50p">
                        <h2>Информация по взаимодействию </h2>
                        <div className="left">
                            <p className="main__item__title">Тип</p>
                            <Select
                                options={[
                                    { value: 1, label: '1' },
                                    { value: 2, label: '2' },
                                    { value: 3, label: '3' }
                                ]}
                                placeholder='Тип взаимодействия'
                                styles ={{
                                    control: () => ({
                                        border: '2px solid #EEEDF0',
                                        width: '100%',
                                        height: 51,
                                        display: 'flex',
                                        alignItems: 'center',
                                        borderRadius: 9,
                                        fontSize: 16
                                    })
                                }}
                                components={{
                                    IndicatorSeparator: () => null
                                }}
                                theme={theme => ({
                                    ...theme,
                                    borderRadius: 0,
                                    colors: {
                                        ...theme.colors,
                                        neutral50: '#C8C8C8',  // Placeholder color
                                    }
                                })}
                            />
                        </div>
                        <div>
                            <p className="main__item__title">Проект</p>
                            <input type="text" placeholder='Название проекта'/>
                        </div>
                        <div>
                            <p className="main__item__title">Источник</p>
                            <input type="text" placeholder='Введите источник'/>
                        </div>
                        <div>
                            <p className="main__item__title">Результат завершения</p>
                            <input type="text" placeholder='Введите результат'/>
                        </div>
                    </div>
                    <div className="main__item main__item_50p">
                        <h2>Информация по услуге</h2>
                        <div>
                            <p className="main__item__title">Тип услуги</p>
                            <input type="text" placeholder='Введите тип услуги'/>
                        </div>
                        <div>
                            <p className="main__item__title">Название услуги</p>
                            <input type="text" placeholder='Название услуги'/>
                        </div>
                        <div>
                            <p className="main__item__title">Название задачи</p>
                            <input type="text" placeholder='Введите название'/>
                        </div>
                        <div>
                            <p className="main__item__title">Номер задачи</p>
                            <input type="text" placeholder='Введите номер'/>
                        </div>
                    </div>
                    <div className="main__item main__item_50p">
                        <h2>Номера телефонов</h2>
                        <div>
                            <p className="main__item__title">Дата и время начала</p>
                            <input type="text" placeholder='Введите номер телефона'/>
                        </div>
                        <div>
                            <p className="main__item__title">Дата и время конца</p>
                            <input type="text" placeholder='Введите номер телефона'/>
                        </div>
                    </div>
                    <div className="main__item main__item_25p">
                        <h2>Агенты</h2>
                        <div>
                            <p className="main__item__title">Агент</p>
                            <input type="text" placeholder='Введите имя агента'/>
                        </div>
                    </div>
                    <div className="main__item main__item_25p">
                        <h2>Информация по клиенту</h2>
                        <div>
                            <p className="main__item__title">Тип клиента</p>
                            <input type="text" placeholder='Введите тип клиента'/>
                        </div>
                    </div>
                    <div className="main__item">
                        <h2>Дополнительные данные для поиска</h2>
                        <div className="additional-param">
                            <div className="additional-param__name">
                                <p className="main__item__title">Параметр №1</p>
                                <input type="text" placeholder='Введите параметр'/>
                            </div>
                            <div className="additional-param__value">
                                <p className="main__item__title">Значение параметра</p>
                                <input type="text" placeholder='Введите значение'/>
                            </div>
                            <label className="additional-param__checkbox">
                                <input type="checkbox" />
                                Отключено
                            </label>
                        </div>
                        <div className="additional-param">
                            <div className="additional-param__name">
                                <p className="main__item__title">Параметр №2</p>
                                <input type="text" placeholder='Введите параметр'/>
                            </div>
                            <div className="additional-param__value">
                                <p className="main__item__title">Значение параметра</p>
                                <input type="text" placeholder='Введите значение'/>
                            </div>
                            <label className="additional-param__checkbox">
                                <input type="checkbox" />
                                Отключено
                            </label>
                        </div>
                        <button className="add-additional-param-btn">+ Добавить</button>
                    </div>
                </main>
            </div>
            <div className="search-control">
                <div className="container">
                    <button className="search-control__reset">
                        <img src="/reset.svg" alt="reset"/>
                        Сбросить
                    </button>
                    <button className="search-control__find">
                        <img src="/find.svg" alt="find"/>
                        Найти
                    </button>
                </div>
            </div>
        </>
    );
};

export default Index;