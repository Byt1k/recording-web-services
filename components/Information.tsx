import styles from '../styles/information.module.scss'
import TitlePage from "./TitlePage";
import {FC} from 'react'
import {RecordingItem} from "../api/types";
import dateToString from "../utils/dateToString";
import {useAppSelector} from "../redux/hooks";
import {selectAuthUserData} from "../redux/slices/auth";

const Information: FC<{recordingDetail: RecordingItem}> = ({recordingDetail}) => {

    const {BusinessAttributes} = useAppSelector(selectAuthUserData)
    const businessAttributes = BusinessAttributes[0]

    return (
        <>
            <TitlePage title="Информация по взаимодействию" isInteraction={true}/>
            <div className={styles.block}>
                <h2>Временной диапазон</h2>
                <div className={styles.block__item}>
                    <p>Дата и время начала</p>
                    <p>{dateToString(recordingDetail.starttime)}</p>
                </div>
                <div className={styles.block__item}>
                    <p>Дата и время окончания</p>
                    <p>{dateToString(recordingDetail.stoptime)}</p>
                </div>
                <div className={styles.block__item}>
                    <p>Длительность</p>
                    <p>{recordingDetail.duration}</p>
                </div>
                <div className={styles.block__item}>
                    <p>Медиаканал</p>
                    <p>{recordingDetail.type}</p>
                </div>
                <div className={styles.block__item}>
                    <p>Агент</p>
                    <p>{recordingDetail.username}</p>
                </div>
            </div>
            <div className={`${styles.block} ${styles.additionalData}`}>
                <h2>Дополнительные данные</h2>
                {recordingDetail.metadata.map(item => (
                    <div key={item.name} className={styles.block__item}>
                        <p>{`${businessAttributes[item.name] ? businessAttributes[item.name] : item.name}:`}</p>
                        <p>{item.value}</p>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Information