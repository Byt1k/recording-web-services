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

    const userData = useAppSelector(selectAuthUserData)

    // Получение записей и сохранение в LS
    const [recordings, setRecordings] = useState([])
    let {items} = useAppSelector(selectSearchedRecordings)

    useEffect(() => {
        if (!items.length) {
            setRecordings(JSON.parse(localStorage.getItem('recordings')))
        } else {
            setRecordings(items)
        }
    }, [items])

    useEffect(() => {
        if (recordings?.length) {
            localStorage.setItem('recordings', JSON.stringify(recordings));
        }
    }, [recordings?.length])

    // Добавление к записям зависмостей, нумерации и преобразование даты
    const newRecordings = recordings?.map((recording, recordingIndex) => ({
        ...recording,
        number: recordingIndex + 1,
        starttime: dateToString(recording.starttime),
        stoptime: dateToString(recording.stoptime),
        duration: timeTransformer(recording.duration),
        dependencies: recording.dependencies?.map((d, dIndex) => (
            {
                ...d,
                number: `${recordingIndex + 1}.${dIndex + 1}`,
                starttime: dateToString(d.starttime),
                stoptime: dateToString(d.stoptime),
                duration: timeTransformer(d.duration),
            }))
    }))

    // Пэйджинг
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const totalCount = newRecordings?.length

    const lastIndex = currentPage * pageSize
    const firstIndex = lastIndex - pageSize
    const visibleRecordings = newRecordings?.slice(firstIndex, lastIndex)

    useEffect(() => {
        setCurrentPage(+localStorage.getItem('currentPage'))

        const pageSizeFromLS = +localStorage.getItem('pageSize')
        pageSizeFromLS && setPageSize(pageSizeFromLS)
    }, [])

    useEffect(() => {
        localStorage.setItem('currentPage', currentPage.toString())
    }, [currentPage])

    // Раскрытие зависимых записей
    const [visibleDependenciesId, setVisibleDependenciesId] = useState([""])
    const changeVisibleDependencies = item => {
        visibleDependenciesId.map(id => (id == item.recordid
                ? setVisibleDependenciesId(visibleDependenciesId.filter(id => id != item.recordid))
                : setVisibleDependenciesId([...visibleDependenciesId, item.recordid])
        ))
    };

    // Выбор акивного трэка
    const loadedTrack = useAppSelector(selectRecordingIsPlaying)
    const [selectedTrackId, setSelectedTrackId] = useState(loadedTrack.recordid)

    const trackIsActive = (track, className) => {
        return selectedTrackId !== track.recordid
            ? `${className}`
            : `${className} ${styles.active}`
    }

    const dispatch = useAppDispatch()

    useEffect(() => {
        const getActiveTrack = async (recordingId) => {
            try {
                const data = await Api().recordings.getRecordingDetail(recordingId)
                dispatch(setRecordingDetail(data.items[0]))
            } catch (e) {
                console.log(e)
            }
        }
        if (selectedTrackId) {
            getActiveTrack(selectedTrackId)
        }
    }, [selectedTrackId])

    // Сортировака выбора столбцов по алфавиту
    const businessAttributes = userData?.BusinessAttributes[0]

    const sortableBusinessAttributes = [];
    for (const key in businessAttributes) {
        sortableBusinessAttributes.push([businessAttributes[key], key]);
    }
    sortableBusinessAttributes.sort();

    // Выбор столбцов
    const {register, handleSubmit, formState, reset, control} = useForm()

    const [popupSelectColumns, setPopupSelectColumns] = useState(false)

    const [selectedColumns, setSelectedColumns] = useState(["username", "starttime", "stoptime", "duration", "callId", "mediatype", "type"])

    useEffect(() => {
        const columnsFromLS = JSON.parse(localStorage.getItem('selectedColumns'))

        if (columnsFromLS) {
            setSelectedColumns(columnsFromLS)
        }
    }, [])

    useEffect(() => reset(), [selectedColumns])

    const saveSelectColumn = (columns) => {
        const preSelectedColumns = []
        for (const key in columns) {
            if (columns[key]) {
                preSelectedColumns.push(key)
            }
        }
        localStorage.setItem('selectedColumns', JSON.stringify(preSelectedColumns))
        setSelectedColumns(preSelectedColumns)
        setPopupSelectColumns(false)
    }

    const businessAttributesKeys = Object.keys(businessAttributes || {})

    // Сортировка столбцов в таблице
    type SortConfig = { key: string, direction: 'ascending' | 'descending' }
    const [sortConfig, setSortConfig] = useState<SortConfig>({key: 'number', direction: 'ascending'})
    let sortedVisibleRecordings = [];

    // парсинг метадаты в основных записях для возможности сортировки
    sortedVisibleRecordings = visibleRecordings?.map(r => {
        r.metadata?.map(item => (
            r[item.name] = item.value
        ))
        delete r.metadata

        return r
    })

    sortedVisibleRecordings?.sort((a, b) => {
        if (isNaN(+a[sortConfig.key])) {
            if (!a[sortConfig.key]) a[sortConfig.key] = '-'
            if (!b[sortConfig.key]) b[sortConfig.key] = '-'

            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
        } else {
            if (a[sortConfig.key] - b[sortConfig.key] < 0) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (a[sortConfig.key] - b[sortConfig.key] > 0) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
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

    // Смена иконки playPause в строке записи
    const {isPlaying, recordid: playingRecordId} = useAppSelector(selectRecordingIsPlaying)
    const showPlayPauseImg = (recordId) => {
        if (isPlaying && playingRecordId === recordId) {
            return "/records-pause.svg"
        } else {
            return "/records-play.svg"
        }
    }

    // Отображение стрелки сортировки в заголовке таблице
    const sortedArrowClassName = (sortConfig, key) => {
        if (sortConfig.key === key) {
            if (sortConfig.direction === 'descending') {
                return 'sorted rotate'
            }
            return 'sorted'
        }
        return ''
    }

    return (
        <>
            <TitlePage isListRecordsPage={true} title="Список записей" selectedTrackId={selectedTrackId}
                       setPageSize={setPageSize} pageSize={pageSize} setCurrentPage={setCurrentPage}
                       setPopupSelectColumns={setPopupSelectColumns}
            />
            <div className={styles.listContainer} id="listContainer">
                <table className={styles.list}>
                    <thead>
                    <tr>
                        <td width={20}/>
                        <td width={40}>
                            <button onClick={() => requestSort('number')}
                                    className={sortedArrowClassName(sortConfig, 'number')}>
                                <span style={{marginRight: '5px'}}>№</span>
                            </button>
                        </td>
                        {businessAttributesKeys.map(key => {
                            if (selectedColumns?.some(c => c === key)) {
                                return (
                                    <td key={key}>
                                        <button onClick={() => requestSort(key)}
                                                className={sortedArrowClassName(sortConfig, key)}>
                                            {businessAttributes[key]}
                                        </button>
                                    </td>
                                )
                            }
                        })}
                    </tr>
                    </thead>
                    <tbody>
                    {sortedVisibleRecordings?.map(r => {
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
                                    <button onClick={() => dispatch(setIsPlaying({
                                        recordid: r.recordid,
                                        isPlaying: !isPlaying
                                    }))}
                                            disabled={r.recordid !== selectedTrackId}>
                                        <img src={showPlayPauseImg(r.recordid)}
                                             alt="playPause"/>
                                    </button>
                                </td>
                                <td width={40}>{r.number}</td>
                                {businessAttributesKeys.map(key => {
                                    if (selectedColumns?.some(c => c === key)) {
                                        return (
                                            <td key={key}>{r[key] || '-'}</td>
                                        )
                                    }
                                })}
                            </tr>
                            {visibleDependenciesId.some(id => id == r.recordid) && r.dependencies.map(d => {

                                // парсинг метадаты
                                d.metadata?.map(item => (
                                    d[item.name] = item.value
                                ))

                                return (
                                    <tr key={d.recordid}
                                        className={trackIsActive(d, styles.list__record_opened)}
                                        onClick={() => setSelectedTrackId(d.recordid)}
                                    >
                                        <td>
                                            <button onClick={() => dispatch(setIsPlaying({
                                                recordid: d.recordid,
                                                isPlaying: !isPlaying
                                            }))}
                                                    disabled={d.recordid !== selectedTrackId}>
                                                <img src={showPlayPauseImg(d.recordid)}
                                                     alt="playPause"/>
                                            </button>
                                        </td>
                                        <td width={40}>{d.number}</td>
                                        {businessAttributesKeys.map(key => {
                                            if (selectedColumns.some(c => c === key)) {
                                                return (
                                                    <td key={key}>{d[key] || '-'}</td>
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
                    Показано <b>{visibleRecordings?.length || 0}</b> из <b>{newRecordings?.length || 0}</b> результатов
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
                                               {...register(sortableBusinessAttributes[key][1])}
                                               defaultChecked={selectedColumns?.some(c => c === sortableBusinessAttributes[key][1])}
                                        />
                                        {sortableBusinessAttributes[key][0]}
                                    </label>
                                )
                            })}
                        </div>
                    </div>
                    <div className={modalActionStyles.modal__content__action}>
                        <button onClick={() => setPopupSelectColumns(false)} type="reset">Отменить</button>
                        <button className={modalActionStyles.positive} type="submit">Выбрать</button>
                    </div>
                </form>
            </Modal>
        </>
    )
}

export default ListRecords