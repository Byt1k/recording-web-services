import dynamic from 'next/dynamic'
import styles from '../styles/common.module.scss'
import Header from "../components/Header";
import Search from "../components/Search"

const Player = dynamic(
    () => import('../components/Player'),
    {ssr: false}
)

const Index = () => {

    return (
        <>
            <Header isSearchAction={true}/>
            <div className={styles.container}>
                <Player/>
                <Search/>
            </div>
        </>
    )
};

export default Index;