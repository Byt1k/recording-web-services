import Header from "../components/Header";
import styles from "../styles/common.module.scss";
import ListRecords from "../components/ListRecords";
import dynamic from "next/dynamic";

const Player = dynamic(
    () => import('../components/Player'),
    {ssr: false}
)

const List = () => {
    return (
        <>
            <Header isAuth={true}/>
            <div className={styles.container}>
                <Player />
                <ListRecords />
            </div>
        </>
    );
};

export default List;