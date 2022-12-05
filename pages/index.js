import Header from "../components/Header";
import styles from '../styles/common.module.scss'
import dynamic from 'next/dynamic'
import Search from "../components/Search";
import {useSelector} from "react-redux";
import Login from "../components/Login";

const Player = dynamic(
    () => import('../components/Player'),
    {ssr: false}
)

const Index = () => {

    const {isAuth} = useSelector(state => state.auth)

    console.log(isAuth)

    return (
        !isAuth
            ? <Login />
            : <>
                <Header isAuth={isAuth} isSearchAction={true}/>
                <div className={styles.container}>
                    <Player/>
                    <Search/>
                </div>
            </>
    );
};

export default Index;