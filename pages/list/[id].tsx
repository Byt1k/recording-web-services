import Header from "../../components/Header";
import styles from '../../styles/common.module.scss'
import dynamic from 'next/dynamic'
import Information from "../../components/Information";
import {Api} from "../../api";
import {GetServerSidePropsContext, NextPage} from "next";
import {RecordingItem} from "../../api/types";

const Player = dynamic(
    () => import('../../components/Player'),
    {ssr: false}
)

interface InformationProps {
    recordingDetail: RecordingItem | null
}

const RecordingDetailPage: NextPage<InformationProps> = ({recordingDetail}) => {
    // const recordingDetail = useAppSelector(selectRecordingDetail)
    console.log(recordingDetail)
    return (
        <>
            <Header isInteraction={true}/>
            <div className={styles.container}>
                <Player/>
                <Information recordingDetail={recordingDetail}/>
            </div>
        </>
    );
};

export const getServerSideProps  = async (ctx: GetServerSidePropsContext) => {
    try {
        const recordingId = ctx.query.id as string
        const recordingDetail = await Api(ctx).recordings.getRecordingDetail(recordingId)

        // todo: may be remove reducer recordingDetail
        // store.dispatch(setRecordingDetail(recordingDetail))

        return {props: {recordingDetail: recordingDetail.items[0]}}
    } catch (e) {
        console.log(e)
    }
    return {props: {recordingDetail: null}}
}

export default RecordingDetailPage;