import Link from "next/link";
import styles from "../styles/header.module.scss"

const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link href='/'>
                    <img src='/logo.svg' alt="Logo" />
                </Link>
                <div className={styles.header__user}>
                    Носова Алина
                    <img src="/header-arrow.svg" alt="arrow"/>
                </div>
                <nav className={styles.header__menu}>
                    <Link href='/search'>Поиск записей</Link>
                    <Link href='/list'>Список записей</Link>
                    <Link href='/ref'>Справка</Link>
                </nav>
                <div className={styles.header__action}>
                    <button className={styles.header__action__reset}>
                        <img src="/reset.svg" alt="reset"/>
                        Сбросить
                    </button>
                    <button className={styles.header__action__find}>
                        <img src="/find.svg" alt="find"/>
                        Найти
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;