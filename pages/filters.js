import styles from '../styles/filters.module.scss'
import Header from "../components/Header";
import {useState} from "react";

const Filters = () => {
    const filters = [
        {
            id: 1,
            datetime: "2022-09-12 15:35:05",
            name: "Фильтр №1",
            type: "Личный",
            agent: "Красилова Елизавета",
            mediaChanel: "Взаимодействие",
            callFromNumber: "+79509439439",
            callToNumber: "—",
            source: "Черномырдин",
            direction: "Inbound",
            duration: "01:19"
        },
        {
            id: 2,
            datetime: "2022-09-12 15:35:05",
            name: "Фильтр №2",
            type: "Личный",
            agent: "Красилова Елизавета",
            mediaChanel: "—",
            callFromNumber: "+79509439439",
            callToNumber: "+79509439439",
            source: "Черномырдин",
            direction: "Inbound",
            duration: "01:19"
        },
        {
            id: 3,
            datetime: "2022-09-12 15:35:05",
            name: "Фильтр №3",
            type: "Личный",
            agent: "—",
            mediaChanel: "Взаимодействие",
            callFromNumber: "+79509439439",
            callToNumber: "+79509439439",
            source: "Черномырдин",
            direction: "Inbound",
            duration: "01:19"
        },
        {
            id: 4,
            datetime: "2022-09-12 15:35:05",
            name: "Фильтр №4",
            type: "Личный",
            agent: "Красилова Елизавета",
            mediaChanel: "Взаимодействие",
            callFromNumber: "—",
            callToNumber: "—",
            source: "Черномырдин",
            direction: "Inbound",
            duration: "01:19"
        },
        {
            id: 5,
            datetime: "2022-09-12 15:35:05",
            name: "Фильтр №5",
            type: "Личный",
            agent: "—",
            mediaChanel: "—",
            callFromNumber: "+79509439439",
            callToNumber: "+79509439439",
            source: "Черномырдин",
            direction: "Inbound",
            duration: "01:19"
        },
        {
            id: 6,
            datetime: "2022-09-12 15:35:05",
            name: "Фильтр №6",
            type: "Общий",
            agent: "Красилова Елизавета",
            mediaChanel: "—",
            callFromNumber: "+79509439439",
            callToNumber: "+79509439439",
            source: "Черномырдин",
            direction: "—",
            duration: "01:19"
        },
        {
            id: 7,
            datetime: "2022-09-12 15:35:05",
            name: "Фильтр №7",
            type: "Общий",
            agent: "Красилова Елизавета",
            mediaChanel: "Взаимодействие",
            callFromNumber: "+79509439439",
            callToNumber: "+79509439439",
            source: "—",
            direction: "Inbound",
            duration: "01:19"
        },
        {
            id: 8,
            datetime: "2022-09-12 15:35:05",
            name: "Фильтр №8",
            type: "Общий",
            agent: "Красилова Елизавета",
            mediaChanel: "—",
            callFromNumber: "+79509439439",
            callToNumber: "+79509439439",
            source: "Черномырдин",
            direction: "Inbound",
            duration: "01:19"
        },
        {
            id: 9,
            datetime: "2022-09-12 15:35:05",
            name: "Фильтр №9",
            type: "Общий",
            agent: "Красилова Елизавета",
            mediaChanel: "Взаимодействие",
            callFromNumber: "+79509439439",
            callToNumber: "—",
            source: "Черномырдин",
            direction: "Inbound",
            duration: "01:19"
        },
        {
            id: 10,
            datetime: "2022-09-12 15:35:05",
            name: "Фильтр №10",
            type: "Общий",
            agent: "Красилова Елизавета",
            mediaChanel: "Взаимодействие",
            callFromNumber: "—",
            callToNumber: "+79509439439",
            source: "Черномырдин",
            direction: "Inbound",
            duration: "01:19"
        },
    ]

    return (
        <>
            <Header isAuth={true} isFiltersPage={true}/>
            <div className={`${styles.filtersPage} ${styles.container}`}>
                <h2>Сохраненные фильтры</h2>
                <table className={styles.filters}>
                    <tbody>
                    <tr className={styles.filters__title}>
                        <td></td>
                        <td>
                            <button className={styles.sorted}>№</button>
                        </td>
                        <td>
                            <button>Дата и время</button>
                        </td>
                        <td>
                            <button>Название фильтра</button>
                        </td>
                        <td>
                            <button>Тип</button>
                        </td>
                        <td>
                            <button>Агент</button>
                        </td>
                        <td>
                            <button>Медиаканал</button>
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
                    </tr>
                    {filters.map(f => {
                        return (
                            <tr key={f.id}>
                                <td>
                                    <input type="radio" name="filter" id={f.id}/>
                                    <label htmlFor={f.id} />
                                </td>
                                <td>{f.id}</td>
                                <td>{f.datetime  || "—"}</td>
                                <td>{f.name  || "—"}</td>
                                <td>{f.type  || "—"}</td>
                                <td>{f.agent  || "—"}</td>
                                <td>{f.mediaChanel  || "—"}</td>
                                <td>{f.callFromNumber  || "—"}</td>
                                <td>{f.callToNumber  || "—"}</td>
                                <td>{f.source  || "—"}</td>
                                <td>{f.direction  || "—"}</td>
                                <td>{f.duration  || "—"}</td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Filters;