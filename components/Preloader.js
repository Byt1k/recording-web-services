import styles from '../styles/preloader.module.scss'
const Preloader = () => {
    return (
        <div className={styles.preloader} role={'preloader'}>
            <img src='/preloader.svg' alt="preloader"/>
        </div>
    )
}

export default Preloader