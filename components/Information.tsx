import styles from '../styles/information.module.scss'
import TitlePage from "./TitlePage";
import {FC} from 'react'

const Information: FC<{recordingDetail: any[] | null}> = ({recordingDetail}) => {
    return (
        <>
            <TitlePage title="Информация по взаимодействию" isInteraction={true}/>
            <div className={styles.block}>
                <h2>Временной диапазон</h2>
                <div className={styles.block__item}>
                    <p>Дата и время начала</p>
                    <p>22.11.22 15:30:07</p>
                </div>
                <div className={styles.block__item}>
                    <p>Дата и время окончания</p>
                    <p>22.11.22 15:32:07</p>
                </div>
                <div className={styles.block__item}>
                    <p>Длительность</p>
                    <p>120</p>
                </div>
                <div className={styles.block__item}>
                    <p>Медиаканал</p>
                    <p>Inbound</p>
                </div>
                <div className={styles.block__item}>
                    <p>Агент</p>
                    <p>Mike Tyson</p>
                </div>
            </div>
            <div className={`${styles.block} ${styles.additionalData}`}>
                <h2>Дополнительные данные</h2>
                <div className={styles.block__item}>
                    <p>ComplexInteraction:</p>
                    <p>0</p>
                </div>
                <div className={styles.block__item}>
                    <p>varlang:</p>
                    <p>FR</p>
                </div>
                <div className={styles.block__item}>
                    <p>APIGetCustomer:</p>
                    <p>successful</p>
                </div>
                <div className={styles.block__item}>
                    <p>ComplexInteraction:</p>
                    <p>0</p>
                </div>
                <div className={styles.block__item}>
                    <p>varlangprompts:</p>
                    <p>fr-FR</p>
                </div>
                <div className={styles.block__item}>
                    <p>CustomerisFirma:</p>
                    <p>-1</p>
                </div>
                <div className={styles.block__item}>
                    <p>ComplexInteraction:</p>
                    <p>0</p>
                </div>
                <div className={styles.block__item}>
                    <p>ComplexInteraction:</p>
                    <p>0</p>
                </div>
                <div className={styles.block__item}>
                    <p>varlang:</p>
                    <p>FR</p>
                </div>
                <div className={styles.block__item}>
                    <p>APIGetCustomer:</p>
                    <p>successful</p>
                </div>
                <div className={styles.block__item}>
                    <p>ComplexInteraction:</p>
                    <p>0</p>
                </div>
                <div className={styles.block__item}>
                    <p>varlangprompts:</p>
                    <p>fr-FR</p>
                </div>
                <div className={styles.block__item}>
                    <p>CustomerisFirma:</p>
                    <p>-1</p>
                </div>
                <div className={styles.block__item}>
                    <p>ComplexInteraction:</p>
                    <p>0</p>
                </div>
                <div className={styles.block__item}>
                    <p>ComplexInteraction:</p>
                    <p>0</p>
                </div>
                <div className={styles.block__item}>
                    <p>varlang:</p>
                    <p>FR</p>
                </div>
                <div className={styles.block__item}>
                    <p>APIGetCustomer:</p>
                    <p>successful</p>
                </div>
                <div className={styles.block__item}>
                    <p>ComplexInteraction:</p>
                    <p>0</p>
                </div>
                <div className={styles.block__item}>
                    <p>varlangprompts:</p>
                    <p>fr-FR</p>
                </div>
                <div className={styles.block__item}>
                    <p>CustomerisFirma:</p>
                    <p>-1</p>
                </div>
                <div className={styles.block__item}>
                    <p>ComplexInteraction:</p>
                    <p>0</p>
                </div>
            </div>
        </>
    );
};

export default Information