import stylesTitle from "../styles/listRecords.module.scss";
import Link from "next/link";
import styles from '../styles/information.module.scss'


const Information = () => {
    return (
        <>
            <div className={stylesTitle.title}>
                <h2>Информация по взаимодействию</h2>
                <div className={stylesTitle.title__actions}>
                    <Link href="/interaction" className={stylesTitle.interaction}>Взаимодействие</Link>
                    <button className={stylesTitle.selectColumn}>Выбор столбцов</button>
                    <button className={stylesTitle.selectFilter}>Фильтр</button>
                </div>
            </div>
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
                <div>
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
                <div>
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
                <div>
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
            </div>
        </>
    );
};

export default Information;