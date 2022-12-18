import React, {useEffect, useState} from 'react'
import styles from '../styles/listRecords.module.scss'
import TitlePage from "./TitlePage";
import {useAppDispatch, useAppSelector} from "../redux/hooks";
import {selectSearchedRecordings} from "../redux/slices/recordings";
import timeTransformer from "../utils/timeTrasformer";
import dateToString from "../utils/dateToString";
import Pagination from "./Pagination";
import {selectAuthUserData} from "../redux/slices/auth";
import Modal from "./Modal";
import modalStyles from '../styles/titlePage.module.scss'
import {useForm} from "react-hook-form";
import {Api} from "../api";
import {selectRecordingIsPlaying, setIsPlaying, setRecordingDetail} from "../redux/slices/recordingDetail";
import modalActionStyles from '../styles/modal.module.scss'


const ListRecords = () => {

    let {items: recordings} = useAppSelector(selectSearchedRecordings)

    const userData = useAppSelector(selectAuthUserData)

    if (recordings.length) {
        localStorage.setItem('recordings', JSON.stringify(recordings));
    }

    recordings = JSON.parse(localStorage.getItem('recordings'))

    recordings = recordings.map(recording => ({
        ...recording,
        starttime: dateToString(recording.starttime),
        stoptime: dateToString(recording.stoptime),
        duration: timeTransformer(recording.duration),
        dependencies: recording.dependencies?.map(d => (
            {
                ...d,
                starttime: dateToString(d.starttime),
                stoptime: dateToString(d.stoptime),
                duration: timeTransformer(d.duration),
            }))
    }))

    const currentPageDefault = +localStorage.getItem('currentPage') || 1

    const [pageSize, setPageSize] = useState(10)
    const [currentPage, setCurrentPage] = useState(currentPageDefault)
    const totalCount = recordings.length

    const lastIndex = currentPage * pageSize
    const firstIndex = lastIndex - pageSize
    const visibleRecordings = recordings.slice(firstIndex, lastIndex)

    useEffect(() => {
        localStorage.setItem('currentPage', currentPage.toString())
    }, [currentPage])

    const [visibleDependenciesId, setVisibleDependenciesId] = useState([""])

    const changeVisibleDependencies = item => {
        visibleDependenciesId.map(id => (id == item.recordid
                ? setVisibleDependenciesId(visibleDependenciesId.filter(id => id != item.recordid))
                : setVisibleDependenciesId([...visibleDependenciesId, item.recordid])
        ))
    };

    // Выбор акивного трэка
    const [selectedTrackId, setSelectedTrackId] = useState("")
    const trackIsActive = (track, className) => {
        return selectedTrackId !== track.recordid
            ? `${className}`
            : `${className} ${styles.active}`
    }

    const dispatch = useAppDispatch()

    useEffect(() => {
        const getActiveTrack = async (recordingId) => {
            const data = await Api().recordings.getRecordingDetail(recordingId)
            dispatch(setRecordingDetail(data.items[0]))
        }
        if (selectedTrackId) {
            getActiveTrack(selectedTrackId)
        }
    }, [selectedTrackId])


    // Выбор столбцов
    const {register, handleSubmit, formState, reset, control} = useForm()

    const businessAttributes = userData.BusinessAttributes[0]

    // Сортировака выбора столбцов по алфавиту
    const sortableBusinessAttributes = [];
    for (const key in businessAttributes) {
        sortableBusinessAttributes.push([businessAttributes[key], key]);
    }
    sortableBusinessAttributes.sort();

    const [popupSelectColumns, setPopupSelectColumns] = useState(false)

    const [selectedColumns, setSelectedColumns] = useState(["username", "starttime", "stoptime", "duration", "callId", "mediatype", "type"])
    const saveSelectColumn = ({columns}) => {
        const preSelectedColumns = []
        for (const key in columns) {
            if (columns[key]) {
                preSelectedColumns.push(key)
            }
        }
        setSelectedColumns(preSelectedColumns)
        setPopupSelectColumns(false)
    }

    const businessAttributesKeys = Object.keys(businessAttributes)

    // Сортировка столбцов
    type SortConfig = { key: string | null, direction: 'ascending' | 'descending' }
    const [sortConfig, setSortConfig] = useState<SortConfig>({key: null, direction: 'ascending'})
    let sortedVisibleRecordings = [...visibleRecordings];

    sortedVisibleRecordings.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
    });

    const requestSort = key => {
        let direction = 'ascending' as 'ascending' | 'descending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({key, direction});
    }

    const sortBtn = document.querySelector('.sorted')
    if (sortBtn) {
        sortConfig.direction === 'descending' ? sortBtn.className = 'sorted rotate' : sortBtn.className = 'sorted'
    }

    const {isPlaying, recordid: playingRecordId} = useAppSelector(selectRecordingIsPlaying)
    const showPlayPauseImg = (recordId) => {
        if (isPlaying && playingRecordId === recordId) {
            return "/records-pause.svg"
        } else {
            return "/records-play.svg"
        }
    }

    return (
        <>
            <TitlePage isListRecordsPage={true}
                       title="Список записей"
                       selectedTrackId={selectedTrackId}
                       setPageSize={setPageSize}
                       pageSize={pageSize}
                       setPopupSelectColumns={setPopupSelectColumns}
            />
            <div className={styles.listContainer}>
                <table className={styles.list}>
                    <thead>
                    <tr>
                        <td width={20}/>
                        {businessAttributesKeys.map(key => {
                            if (selectedColumns.some(c => c === key)) {
                                return (
                                    <td key={key}>
                                        <button
                                            onClick={() => requestSort(key)}
                                            className={sortConfig.key === key ? 'sorted' : 'asd'}
                                        >{businessAttributes[key]}</button>
                                    </td>
                                )
                            }
                        })}
                    </tr>
                    </thead>
                    <tbody>
                    {sortedVisibleRecordings.map((r, index) => {

                        // парсинг метадаты
                        const metaData: any = {}
                        r.metadata?.map(item => (
                            metaData[item.name] = item.value
                        ))

                        return <React.Fragment key={r.recordid}>
                            <tr className={trackIsActive(r, styles.list__record)}
                                onClick={() => setSelectedTrackId(r.recordid)}
                            >
                                <td>
                                    {r.record_count ? <img
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
                                    <button onClick={() => dispatch(setIsPlaying({recordid: r.recordid, isPlaying: !isPlaying}))}
                                            disabled={r.recordid !== selectedTrackId}>
                                        <img src={showPlayPauseImg(r.recordid)}
                                             alt="playPause"/>
                                    </button>
                                </td>
                                {businessAttributesKeys.map(key => {
                                    if (selectedColumns.some(c => c === key)) {
                                        return (
                                            <td key={key}>{r[key]}</td>
                                        )
                                    }
                                })}
                            </tr>
                            {visibleDependenciesId.some(id => id == r.recordid) && r.dependencies.map(d => {

                                // парсинг метадаты
                                const metaData: any = {}
                                r.metadata?.map(item => (
                                    metaData[item.name] = item.value
                                ))

                                return (
                                    <tr key={d.recordid}
                                        className={trackIsActive(d, styles.list__record_opened)}
                                        onClick={() => setSelectedTrackId(d.recordid)}
                                    >
                                        <td>
                                            <button onClick={() => dispatch(setIsPlaying({recordid: d.recordid, isPlaying: !isPlaying}))}
                                                    disabled={d.recordid !== selectedTrackId}>
                                                <img src={showPlayPauseImg(d.recordid)}
                                                     alt="playPause"/>
                                            </button>
                                        </td>
                                        {businessAttributesKeys.map(key => {
                                            if (selectedColumns.some(c => c === key)) {
                                                return (
                                                    <td key={key}>{d[key]}</td>
                                                )
                                            }
                                        })}
                                    </tr>
                                )
                            })}
                        </React.Fragment>
                    })}
                    </tbody>
                </table>
            </div>
            <div className={styles.info}>
                <div className={styles.shown}>
                     Показано <b>{visibleRecordings.length}</b> из <b>{recordings.length}</b> результатов
                </div>
                <Pagination pageSize={pageSize} totalCount={totalCount} currentPage={currentPage}
                            onChangePage={setCurrentPage}/>
            </div>

            <Modal title="Выберите столбцы" active={popupSelectColumns} setActive={setPopupSelectColumns}>
                <form onSubmit={handleSubmit(saveSelectColumn)}
                      className={modalStyles.selectColumnsForm}>
                    <div className={modalStyles.wrapper}>
                        <div className={modalStyles.selectColumnsForm__columns}>
                            {Object.keys(sortableBusinessAttributes).map(key => {
                                return (
                                    <label key={key}>
                                        <input type="checkbox"
                                               {...register(`columns.${sortableBusinessAttributes[key][1]}`)}
                                               defaultChecked={selectedColumns.some(c => c === sortableBusinessAttributes[key][1])}
                                        />
                                        {sortableBusinessAttributes[key][0]}
                                    </label>
                                )
                            })}
                        </div>
                    </div>
                    <div className={modalActionStyles.modal__content__action}>
                        <button onClick={() => setPopupSelectColumns(false)}>Отменить</button>
                        <button className={modalActionStyles.positive} type='submit'>Выбрать</button>
                    </div>
                </form>
            </Modal>
        </>
    )
}

export default ListRecords