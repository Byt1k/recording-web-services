import styles from '../styles/listRecords.module.scss'
import {useState} from "react";

const ListRecords = () => {

    const data = [
        {
            id: "00U8HVJSP090LFBR1C50K2LAES02ANMH",
            number: "1",
            datetime: "2022-09-12 15:35:05",
            mediaChanel: "Взаимодействие",
            agent: "Красилова Елизавета",
            callFromNumber: "+79509439439",
            callToNumber: "+79509439439",
            source: "Черномырдин",
            direction: "Inbound",
            duration: "01:19",
            dependencies: [
                {
                    id: "01U8HVJSP090LFBR1C50K2LAES02ANMH",
                    number: "1.1",
                    datetime: "2022-09-12 15:35:05",
                    mediaChanel: "Взаимодействие",
                    agent: "Красилова Елизавета",
                    callFromNumber: "+79509439439",
                    callToNumber: "+79509439439",
                    source: "Черномырдин",
                    direction: "Inbound",
                    duration: "01:19"
                },
                {
                    id: "02U8HVJSP090LFBR1C50K2LAES02ANMH",
                    number: "1.2",
                    datetime: "2022-09-12 15:35:05",
                    mediaChanel: "Взаимодействие",
                    agent: "Красилова Елизавета",
                    callFromNumber: "+79509439439",
                    callToNumber: "+79509439439",
                    source: "Черномырдин",
                    direction: "Inbound",
                    duration: "01:19"
                }
            ]
        },
        {
            id: "01U8HVJSP090LFBR1C50K2LAES02ANMH",
            number: "2",
            datetime: "2022-09-12 15:35:05",
            mediaChanel: "Взаимодействие",
            agent: "Красилова Елизавета",
            callFromNumber: "+79509439439",
            callToNumber: "+79509439439",
            source: "Черномырдин",
            direction: "Inbound",
            duration: "01:19",
            dependencies: []
        },
        {
            id: "02U8HVJSP090LFBR1C50K2LAES02ANMH",
            number: "3",
            datetime: "2022-09-12 15:35:05",
            mediaChanel: "Взаимодействие",
            agent: "Красилова Елизавета",
            callFromNumber: "+79509439439",
            callToNumber: "+79509439439",
            source: "Черномырдин",
            direction: "Inbound",
            duration: "01:19",
            dependencies: []
        },
        {
            id: "03U8HVJSP090LFBR1C50K2LAES02ANMH",
            number: "4",
            datetime: "2022-09-12 15:35:05",
            mediaChanel: "Взаимодействие",
            agent: "Красилова Елизавета",
            callFromNumber: "+79509439439",
            callToNumber: "+79509439439",
            source: "Черномырдин",
            direction: "Inbound",
            duration: "01:19",
            dependencies: []
        },
        {
            id: "04U8HVJSP090LFBR1C50K2LAES02ANMH",
            number: "5",
            datetime: "2022-09-12 15:35:05",
            mediaChanel: "Взаимодействие",
            agent: "Красилова Елизавета",
            callFromNumber: "+79509439439",
            callToNumber: "+79509439439",
            source: "Черномырдин",
            direction: "Inbound",
            duration: "01:19",
            dependencies: [
                {
                    id: "41U8HVJSP090LFBR1C50K2LAES02ANMH",
                    number: "5.1",
                    datetime: "2022-09-12 15:35:05",
                    mediaChanel: "Взаимодействие",
                    agent: "Красилова Елизавета",
                    callFromNumber: "+79509439439",
                    callToNumber: "+79509439439",
                    source: "Черномырдин",
                    direction: "Inbound",
                    duration: "01:19"
                }
            ]
        },
        {
            id: "05U8HVJSP090LFBR1C50K2LAES02ANMH",
            number: "6",
            datetime: "2022-09-12 15:35:05",
            mediaChanel: "Взаимодействие",
            agent: "Красилова Елизавета",
            callFromNumber: "+79509439439",
            callToNumber: "+79509439439",
            source: "Черномырдин",
            direction: "Inbound",
            duration: "01:19",
            dependencies: [
                {
                    id: "51U8HVJSP090LFBR1C50K2LAES02ANMH",
                    number: "6.1",
                    datetime: "2022-09-12 15:35:05",
                    mediaChanel: "Взаимодействие",
                    agent: "Красилова Елизавета",
                    callFromNumber: "+79509439439",
                    callToNumber: "+79509439439",
                    source: "Черномырдин",
                    direction: "Inbound",
                    duration: "01:19"
                }
            ]
        },
        {
            id: "06U8HVJSP090LFBR1C50K2LAES02ANMH",
            number: "7",
            datetime: "2022-09-12 15:35:05",
            mediaChanel: "Взаимодействие",
            agent: "Красилова Елизавета",
            callFromNumber: "+79509439439",
            callToNumber: "+79509439439",
            source: "Черномырдин",
            direction: "Inbound",
            duration: "01:19",
            dependencies: []
        },
        {
            id: "07U8HVJSP090LFBR1C50K2LAES02ANMH",
            number: "8",
            datetime: "2022-09-12 15:35:05",
            mediaChanel: "Взаимодействие",
            agent: "Красилова Елизавета",
            callFromNumber: "+79509439439",
            callToNumber: "+79509439439",
            source: "Черномырдин",
            direction: "Inbound",
            duration: "01:19",
            dependencies: []
        },
        {
            id: "08U8HVJSP090LFBR1C50K2LAES02ANMH",
            number: "9",
            datetime: "2022-09-12 15:35:05",
            mediaChanel: "Взаимодействие",
            agent: "Красилова Елизавета",
            callFromNumber: "+79509439439",
            callToNumber: "+79509439439",
            source: "Черномырдин",
            direction: "Inbound",
            duration: "01:19",
            dependencies: [
                {
                    id: "81U8HVJSP090LFBR1C50K2LAES02ANMH",
                    number: "9.1",
                    datetime: "2022-09-12 15:35:05",
                    mediaChanel: "Взаимодействие",
                    agent: "Красилова Елизавета",
                    callFromNumber: "+79509439439",
                    callToNumber: "+79509439439",
                    source: "Черномырдин",
                    direction: "Inbound",
                    duration: "01:19"
                },
                {
                    id: "82U8HVJSP090LFBR1C50K2LAES02ANMH",
                    number: "9.2",
                    datetime: "2022-09-12 15:35:05",
                    mediaChanel: "Взаимодействие",
                    agent: "Красилова Елизавета",
                    callFromNumber: "+79509439439",
                    callToNumber: "+79509439439",
                    source: "Черномырдин",
                    direction: "Inbound",
                    duration: "01:19"
                }
            ]
        },
        {
            id: "09U8HVJSP090LFBR1C50K2LAES02ANMH",
            number: "10",
            datetime: "2022-09-12 15:35:05",
            mediaChanel: "Взаимодействие",
            agent: "Красилова Елизавета",
            callFromNumber: "+79509439439",
            callToNumber: "+79509439439",
            source: "Черномырдин",
            direction: "Inbound",
            duration: "01:19",
            dependencies: []
        }
    ]
    const [visibleDependenciesId, setVisibleDependenciesId] = useState([""])

    const changeVisibleDependencies = item => {
        visibleDependenciesId.map(id => (id == item.id
                ? setVisibleDependenciesId(visibleDependenciesId.filter(id => id != item.id))
                : setVisibleDependenciesId([...visibleDependenciesId, item.id])
        ))
    };

    return (
        <>
            <div className={styles.title}>
                <h2>Список записей</h2>
                <div className={styles.count}>
                    <p>Записей на странице</p>
                    <button className={styles.active}>10</button>
                    <button>25</button>
                    <button>50</button>
                    <button>100</button>
                </div>
                <div className={styles.title__actions}>
                    <button className={styles.interaction}>Взаимодействие</button>
                    <button className={styles.selectColumn}>Выбор столбцов</button>
                    <button className={styles.selectFilter}>
                        <span className={styles.selectFilter__count}>5</span>
                        Фильтр
                    </button>
                </div>
            </div>
            <table className={styles.list}>
                <thead>
                <tr>
                    <td></td>
                    <td>
                        <button className={"sorted"}>№</button>
                    </td>
                    <td>
                        <button>Дата и время</button>
                    </td>
                    <td>
                        <button>Медиаканал</button>
                    </td>
                    <td>
                        <button>Агент</button>
                    </td>
                    <td>
                        <button>Звонок с номера</button>
                    </td>
                    <td>
                        <button>Звонок на номер</button>
                    </td>
                    <td>
                        <button>Источник</button>
                    </td>
                    <td>
                        <button>Направление</button>
                    </td>
                    <td>
                        <button>Длительность</button>
                    </td>
                    <td>
                        <button> Идентификатор звонка</button>
                    </td>
                </tr>
                </thead>
                <tbody>
                {data.map(r => {

                    return <>
                        <tr key={r.number} className={styles.list__record}>
                            <td>
                                {r.dependencies.length
                                    ? <img
                                        src="/records-arrow.svg"
                                        alt=""
                                        onClick={() => changeVisibleDependencies(r)}
                                        style={visibleDependenciesId.some(id => id == r.id)
                                            ? {transform: 'rotate(180deg)'}
                                            : null
                                        }
                                    />
                                    : null}
                                <input type="checkbox"/>
                                <img src="/records-play.svg" alt="playPause"/>
                            </td>
                            <td>{r.number}</td>
                            <td>{r.datetime}</td>
                            <td>{r.mediaChanel}</td>
                            <td>{r.agent}</td>
                            <td>{r.callFromNumber}</td>
                            <td>{r.callToNumber}</td>
                            <td>{r.source}</td>
                            <td>{r.direction}</td>
                            <td>{r.duration}</td>
                            <td>{r.id}</td>
                        </tr>
                        {visibleDependenciesId.some(id => id == r.id) && r.dependencies.map(d => {
                            return (
                                <tr key={d.number} className={styles.list__record_opened}>
                                    <td>
                                        <input type="checkbox"/>
                                        <img src="/records-play.svg" alt="playPause"/>
                                    </td>
                                    <td>{d.number}</td>
                                    <td>{d.datetime}</td>
                                    <td>{d.mediaChanel}</td>
                                    <td>{d.agent}</td>
                                    <td>{d.callFromNumber}</td>
                                    <td>{d.callToNumber}</td>
                                    <td>{d.source}</td>
                                    <td>{d.direction}</td>
                                    <td>{d.duration}</td>
                                    <td>{d.id}</td>
                                </tr>
                            )
                        })}
                    </>
                })}
                </tbody>
            </table>
            <div className={styles.info}>
                <div className={styles.shown}>Показано <b>10</b> из <b>2000</b> результатов</div>
                <div className={styles.pagination}>
                    <button><img src="/pagination-prev.svg" alt="prev"/></button>
                    <button className={styles.active}>1</button>
                    <button>2</button>
                    <button>3</button>
                    <button>4</button>
                    <button>5</button>
                    <button disabled={true}>...</button>
                    <button>200</button>
                    <button><img src="/pagination-next.svg" alt="next"/></button>
                </div>
            </div>
        </>
    )
}

export default ListRecords