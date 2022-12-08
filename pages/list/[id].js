import Header from "../../components/Header";
import styles from '../../styles/common.module.scss'
import dynamic from 'next/dynamic'
import Information from "../../components/Information";

const Player = dynamic(
    () => import('../../components/Player'),
    {ssr: false}
)

const Id = () => {
    return (
        <>
            <Header isInteraction={true}/>
            <div className={styles.container}>
                <Player/>
                <Information />
            </div>
        </>
    );
};

export default Id;