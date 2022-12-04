import Header from "../components/Header";
import styles from "../styles/common.module.scss";
import Player from "../components/Player";
import ListRecords from "../components/ListRecords";

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