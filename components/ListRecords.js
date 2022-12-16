import React, {useEffect, useState} from 'react'
import styles from '../styles/listRecords.module.scss'
import TitlePage from "./TitlePage";
import {useAppSelector} from "../redux/hooks";
import {selectSearchedRecordings} from "../redux/slices/recordings";
import timeTransformer from "../utils/timeTrasformer";
import dateToString from "../utils/dateToString";
import Pagination from "./Pagination";

const ListRecords = () => {

    let {items: recordings} = useAppSelector(selectSearchedRecordings)

    if (recordings.length) {
        window.localStorage.setItem('recordings', JSON.stringify(recordings));
    }

    recordings = JSON.parse(window.localStorage.getItem('recordings'))

    const currentPageDefault = +window.localStorage.getItem('currentPage') || 1

    const [pageSize, setPageSize] = useState(10)
    const [currentPage, setCurrentPage] = useState(currentPageDefault)
    const totalCount = recordings.length

    const lastIndex = currentPage * pageSize
    const firstIndex = lastIndex - pageSize
    const visibleRecordings = recordings.slice(firstIndex, lastIndex)

    useEffect(() => {
        window.localStorage.setItem('currentPage', currentPage.toString())
    }, [currentPage])

    const [visibleDependenciesId, setVisibleDependenciesId] = useState([""])

    const changeVisibleDependencies = item => {
        visibleDependenciesId.map(id => (id == item.recordid
                ? setVisibleDependenciesId(visibleDependenciesId.filter(id => id != item.recordid))
                : setVisibleDependenciesId([...visibleDependenciesId, item.recordid])
        ))
    };

    const [selectedTrackId, setSelectedTrackId] = useState("")

    const trackIsActive = (track, className) => selectedTrackId !== track.recordid
        ? `${className}`
        : `${className} ${styles.active}`

    const selectColumn = async (values) => {
        await new Promise((r) => setTimeout(r, 500));
        alert(JSON.stringify(values, null, 2));
    }

    return (
        <>
            <TitlePage isListRecordsPage={true}
                       title="Список записей"
                       selectedTrackId={selectedTrackId}
                       selectColumn={selectColumn}
                       setPageSize={setPageSize}
                       pageSize={pageSize}
            />
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
                {visibleRecordings.map((r, index) => {

                    // парсинг метадаты
                    const metaData = {}
                    r.metadata?.map(item => (
                        metaData[item.name] = item.value
                    ))

                    return <React.Fragment key={r.recordid}>
                        <tr className={trackIsActive(r, styles.list__record)}
                            onClick={() => setSelectedTrackId(r.recordid)}
                        >
                            <td>
                                {r.record_count > 1 ? <img
                                        src="/records-arrow.svg"
                                        alt=""
                                        onClick={async (e) => {
                                            e.stopPropagation()
                                            changeVisibleDependencies(r)
                                        }}
                                        style={visibleDependenciesId.some(id => id === r.recordid)
                                            ? {transform: 'rotate(180deg)'}
                                            : null
                                        }
                                    />
                                    : null}
                                <img src="/records-play.svg" alt="playPause"/>
                            </td>
                            <td>{r.recordid}</td>
                            <td>{dateToString(r.starttime)}</td>
                            <td>{r.mediatype}</td>
                            <td>{r.username}</td>
                            <td>{r.externalDN}</td>
                            <td>{r.localDN}</td>
                            <td>{metaData.globalInterationOrigin}</td>
                            <td>{r.type}</td>
                            <td>{timeTransformer(r.duration)}</td>
                            <td>{r.callId}</td>
                        </tr>
                        {visibleDependenciesId.some(id => id == r.recordid) && r.dependencies.map(d => {

                            // парсинг метадаты
                            const metaData = {}
                            r.metadata?.map(item => (
                                metaData[item.name] = item.value
                            ))

                            return (
                                <tr key={d.recordid}
                                    className={trackIsActive(d, styles.list__record_opened)}
                                    onClick={() => setSelectedTrackId(d.recordid)}
                                >
                                    <td>
                                        <img src="/records-play.svg" alt="playPause"/>
                                    </td>
                                    <td>{d.recordid}</td>
                                    <td>{dateToString(d.starttime)}</td>
                                    <td>{dateToString(d.mediatype)}</td>
                                    <td>{d.username}</td>
                                    <td>{d.externalDN}</td>
                                    <td>{d.localDN}</td>
                                    <td>{metaData.globalInterationOrigin}</td>
                                    <td>{d.type}</td>
                                    <td>{timeTransformer(d.duration)}</td>
                                    <td>{d.callId}</td>
                                </tr>
                            )
                        })}
                    </React.Fragment>
                })}
                </tbody>
            </table>
            <div className={styles.info}>
                <div className={styles.shown}>Показано <b>{pageSize}</b> из <b>{recordings.length}</b> результатов</div>
                <Pagination pageSize={pageSize} totalCount={totalCount} currentPage={currentPage} onChangePage={setCurrentPage}/>
            </div>
        </>
    )
}

export default ListRecords