import Header from "../../components/Header";
import styles from '../../styles/common.module.scss'
import dynamic from 'next/dynamic'
import Information from "../../components/Information";
import {Api} from "../../api";
import {NextPage} from "next";

const Player = dynamic(
    () => import('../../components/Player'),
    {ssr: false}
)

interface InformationProps {
    recordingDetail: any[]
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

export const getServerSideProps = async (ctx) => {
    try {
        const recordingDetail = await Api().recordings.getRecordingDetail('9')
        // store.dispatch(setRecordingDetail(recordingDetail))
        return {
            props: {
                recordingDetail
            }
        }
    } catch (e) {
        console.log(e)
        return {
            props: {
                recordingDetail: 'ghbdtn'
            },
        }
    }

}

export default RecordingDetailPage;