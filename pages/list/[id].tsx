import Header from "../../components/Header";
import styles from '../../styles/common.module.scss'
import dynamic from 'next/dynamic'
import Information from "../../components/Information";
import {Api} from "../../api";
import {useEffect} from "react";
import {useRouter} from "next/router";
import {useAppDispatch, useAppSelector} from "../../redux/hooks";
import {selectRecordingDetail, setRecordingDetail} from "../../redux/slices/recordingDetail";
import {selectAuthUserData} from "../../redux/slices/auth";

const Player = dynamic(
    () => import('../../components/Player'),
    {ssr: false}
)

const RecordingDetailPage = () => {

    const dispatch = useAppDispatch()
    const router = useRouter()

    const recordingId = router.query.id as string

    useEffect(() => {
        const fetchData = async (recordingId) => {
            const recordingDetail = await Api().recordings.getRecordingDetail(recordingId)
            dispatch(setRecordingDetail(recordingDetail.items[0]))
        }
        recordingId ? fetchData(recordingId) : null
    }, [recordingId])

    const recordingDetail = useAppSelector(selectRecordingDetail)

    const userData = useAppSelector(selectAuthUserData)

    if (userData?.Capabilities[0].CanDetailView === 'false') {
        return (
            <>
                <div>У Вас нет прав на просмотр страницы взаимодействия</div>
                <style jsx>{`
                  div {
                    height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  }
                `}</style>
            </>
        )
    }

    return (
        <>
            <Header isInteraction={true}/>
            <div className={styles.container}>
                <Player pathFromProps={recordingDetail?.path} durationFromProps={recordingDetail?.duration}/>
                <Information recordingDetail={recordingDetail}/>
            </div>
        </>
    );
};

// export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
//     try {
//         const recordingId = ctx.query.id as string
//         const recordingDetail = await Api(ctx).recordings.getRecordingDetail(recordingId)

//         // todo: may be remove reducer recordingDetail
//         // store.dispatch(setRecordingDetail(recordingDetail))

//         return {props: {recordingDetail: recordingDetail.items[0]}}
//     } catch (e) {
//         console.log(e)
//     }
//     return {props: {recordingDetail: null}}
// }

export default RecordingDetailPage;