import Header from "../../components/Header";
import styles from '../../styles/common.module.scss'
import dynamic from 'next/dynamic'
import Information from "../../components/Information";
import {Api} from "../../api";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {selectRecordingDetail, setRecordingDetail} from "../../redux/slices/recordingDetail";
import {selectAuthUserData} from "../../redux/slices/auth";

const Player = dynamic(
    () => import('../../components/Player'),
    {ssr: false}
)

const RecordingDetailPage = () => {

    const [recordingNotFound, setRecordingNotFound] = useState(false)

    const dispatch = useAppDispatch()
    const router = useRouter()

    // Получение id записи из url
    const recordingId = router.query.id as string

    // Отправка запроса
    useEffect(() => {
        const fetchData = async (recordingId) => {
            try {
                setRecordingNotFound(false)
                const recordingDetail = await Api().recordings.getRecordingDetail(recordingId)
                dispatch(setRecordingDetail(recordingDetail.items[0]))
            } catch (e) {
                console.log(e)
                setRecordingNotFound(true)
            }
        }
        recordingId ? fetchData(recordingId) : null
    }, [recordingId])

    const recordingDetail = useAppSelector(selectRecordingDetail)

    const userData = useAppSelector(selectAuthUserData)

    if (userData?.Capabilities[0].CanDetailView === 'false') {
        return <div className={styles.messagePage}>У Вас нет прав на просмотр страницы взаимодействия</div>
    }

    if (recordingNotFound) {
        return <div className={styles.messagePage}>Запись не найдена</div>
    }

    return (
        <>
            <Header isInteraction={true}/>
            <div className={styles.container}>
                <Player />
                <Information recordingDetail={recordingDetail}/>
            </div>
        </>
    );
};

export default RecordingDetailPage;