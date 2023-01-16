import styles from '../styles/filters.module.scss'
import Header from "../components/Header";
import {useAppSelector} from "../redux/hooks";
import {selectAuthUserData} from "../redux/slices/auth";
import dateToString from "../utils/dateToString";
import {useState} from "react";
import {useRouter} from "next/router";

const Filters = () => {

    const fields = {
        filterName: "Название фильтра",
        starttime: "Дата начала",
        stoptime: "Дата окончания",
        minDuration: "Мин. длительность",
        maxDuration: "Макс. длительность",
        mediatype: "Медиаканал",
        Project: "Проект",
        type: "Направление взаимодействия",
        businessResult: "Результат завершения",
        serviceType: "Тип услуги",
        serviceName: "Название услуги",
        serviceTask: "Название задачи",
        caseId: "Номер задачи",
        externalDN: "Номер клиента",
        localDN: "Номер агента",
        username: "Агент",
        CustomerType: "Тип клиента"
    }

    const response = [
        {
            id: 1,
            filterName: "Фильр №1",
            starttime: "2022-12-14T14:07",
            stoptime: "2022-12-17T14:07",
            minDuration: '5',
            maxDuration: '20',
            mediatype: 'voice',
            type: 'Inbound',
            externalDN: '9999',
            localDN: '1007',
            username: 'Agent007',
            // Метадата
            Project: 'Project2022',
            businessResult: 'Sucess',
            serviceType: 'Marketing',
            serviceName: 'BigSales',
            serviceTask: 'SalesForThisYear',
            caseId: '54545',
            CustomerType: 'Gold'
        },
        {
            id: 2,
            filterName: "Фильр №2",
            starttime: "2022-12-01T03:00",
            username: 'Agent007',
        },
        {
            id: 3,
            filterName: "Для поиска зависимых записей",
            starttime: "2022-12-28T12:10",
            stoptime: '2022-12-28T12:17',
        }
    ]

    const filters = response.map(item => (
        {
            ...item,
            starttime: dateToString(item.starttime),
            stoptime: dateToString(item.stoptime)
        }
    ))

    const router = useRouter()
    const userData = useAppSelector(selectAuthUserData)
    const metadataKeys = userData?.StandardSearchMetadata

    const [selectedFilterId, setSelectedFilterId] = useState(null)

    const selectFilter = () => {
        if (selectedFilterId) {
            let filter = response.filter(f => f.id === selectedFilterId)[0]
            Object.keys(filter).map(key => {
                if (metadataKeys?.some(item => item === key)) {
                    filter = {
                        ...filter,
                        ['metadataQuery.' + key]: filter[key]
                    }
                    delete filter[key]
                }
            })

            localStorage.setItem('formValues', JSON.stringify(filter))
            router.push('/')
        }
    }

    return (
        <>
            <Header isFiltersPage={true} selectFilter={selectFilter}/>
            <div className={`${styles.filtersPage} ${styles.container}`}>
                <h2>Сохраненные фильтры</h2>
                <div className={styles.tableContainer}>
                    <table className={styles.filters}>
                        <thead>
                        <tr>
                            <td/>
                            {Object.keys(fields || {}).map(key => (
                                <td key={key}>
                                    <button>{fields[key]}</button>
                                </td>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {filters.map(f => {
                            return (
                                <tr key={f.id} onClick={() => setSelectedFilterId(f.id)}>
                                    <td>
                                        <input type="radio" name="filter"
                                               checked={f.id === selectedFilterId}
                                               onChange={() => setSelectedFilterId(f.id)}
                                        />
                                    </td>
                                    {Object.keys(fields || {}).map(key => (
                                        <td key={key}>{f[key]}</td>
                                    ))}
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default Filters;