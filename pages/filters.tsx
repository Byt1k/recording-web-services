import styles from '../styles/filters.module.scss'
import Header from "../components/Header";
import {useAppSelector} from "../redux/hooks";
import {selectAuthUserData} from "../redux/slices/auth";
import dateToString from "../utils/dateToString";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Api} from "../api";

const Filters = () => {
    const router = useRouter()
    const userData = useAppSelector(selectAuthUserData)

    const businessAttributes = userData?.BusinessAttributes[0]

    // Основные поля
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
        CustomerType: "Тип клиента",
    }

    // Доп поля
    const additionalFields = {}
    userData?.AdditionalSearchMetadata.map(key => (
        additionalFields[key] = businessAttributes[key]
    ))

    const [response, setResponse] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                setResponse(await Api().filters.getFilters())
            } catch (e) {
                console.log(e)
            }
        }
        fetchData()
    }, [])

    const filters = response?.map(item => (
        {
            ...item,
            starttime: dateToString(item.starttime),
            stoptime: dateToString(item.stoptime)
        }
    ))

    const metadataKeys = userData?.StandardSearchMetadata

    const [selectedFilterId, setSelectedFilterId] = useState(null)

    const selectFilter = () => {
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

    const deleteFilter = async () => {
        const newFilters = response.filter(filter => filter.id !== selectedFilterId)
        try {
            await Api().filters.setFilters(newFilters)
            setResponse(await Api().filters.getFilters())
            setSelectedFilterId(null)
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <>
            <Header isFiltersPage={true} selectFilter={selectFilter}
                    deleteFilter={deleteFilter} isFilterSelected={!!selectedFilterId}/>
            <div className={`${styles.filtersPage} ${styles.container}`}>
                <h2>{response.length ? 'Сохраненные фильтры' : 'Сохраненных фильтров нет'}</h2>
                {!!response.length && <div className={styles.tableContainer}>
                    <table className={styles.filters}>
                        <thead>
                        <tr>
                            <td/>
                            {Object.keys(fields || {}).map(key => (
                                <td key={key}>
                                    <button>{fields[key]}</button>
                                </td>
                            ))}
                            {Object.keys(additionalFields || {}).map(key => (
                                <td key={key}>
                                    <button>{additionalFields[key]}</button>
                                </td>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {filters.map(f => {

                            // Преобразование объекта доп параметров
                            const additionalParams = Object.keys(f.additionalParams || {}).map(key => f.additionalParams[key])

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
                                    {Object.keys(additionalFields || {}).map(field => {
                                        const param = additionalParams.find(item => item.name === field)

                                        if (!!param) {
                                            return <td key={field}
                                                       className={param.not === 'true' ? styles.not : null}>
                                                {param.value}
                                            </td>
                                        }
                                        return <td key={field}/>
                                    })}
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </div>
                }
            </div>
        </>
    );
};

export default Filters;