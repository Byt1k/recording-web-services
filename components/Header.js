import Link from "next/link";
import styles from "../styles/header.module.scss"
import {useEffect, useRef, useState} from "react"
import Modal from "./Modal";

const Header = ({isAuth, isFiltersPage = false}) => {
    const [exitIsActive, setExitIsActive] = useState(false)

    const [popupExit, setPopupExit] = useState(false)
    const [popupResetFilter, setPopupResetFilter] = useState(false)

    const exitModalRef = useRef(null)
    const exitModalBtnRef = useRef(null)

    useEffect(() => {
        if (!exitIsActive) return

        const handleClickOutside = (e) => {
            // if (e.target != exitModalRef.current) {
            if (!exitModalBtnRef.current.contains(e.target)) {
                setExitIsActive(false)
            }
            // }
        }

        document.addEventListener('click', handleClickOutside)

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [exitIsActive, setExitIsActive])

    return (
        <>
            <header className={styles.header}>
                <div className={styles.container}>
                    <Link href='/'>
                        <img src='/logo.svg' alt="Logo"/>
                    </Link>
                    {isAuth && <>
                        <div className={styles.header__user}>
                            <div ref={exitModalBtnRef} className={styles.header__user__current}
                                 onClick={() => setExitIsActive(v => !v)}>
                                Носова Алина
                                <img src="/header-arrow.svg" alt="arrow"
                                     className={exitIsActive ? styles.rotate : null}/>
                            </div>
                            {exitIsActive && <div ref={exitModalRef} className={styles.header__user__exit}
                                                  onClick={() => setPopupExit(true)}>
                                <img src="/exit.svg" alt="exit"/>
                                Выйти
                            </div>}
                        </div>
                        <nav className={styles.header__menu}>
                            <Link href='/'>Поиск записей</Link>
                            <Link href='/list'>Список записей</Link>
                            <Link href='/ref'>Справка</Link>
                        </nav>
                        <div className={styles.header__action}>
                            {!isFiltersPage
                                ? <>
                                    <button className={styles.header__action__reset}
                                            onClick={() => setPopupResetFilter(true)}>
                                        <img src="/reset.svg" alt="reset"/>
                                        Сбросить
                                    </button>
                                    <button className={styles.header__action__find}>
                                        <img src="/find.svg" alt="find"/>
                                        Найти
                                    </button>
                                </>
                                : <button className={styles.header__action__find}>Выбрать фильтр</button>}

                        </div>
                    </>}
                </div>
            </header>
            <Modal active={popupExit}
                   setActive={setPopupExit}
                   title='Выйти?' text='Вы действительно хотите выйти?' cancelText='Остаться'
                   confirmText='Выйти' cancel={() => setPopupExit(false)}
                   confirm={() => {}}
                    isNegative={true}
            >
            </Modal>
            <Modal active={popupResetFilter}
                   setActive={setPopupResetFilter}
                   title='Сбросить фильтр?' text='Вы хотите сбросить текущий фильтр.' cancelText='Отменить'
                   confirmText='Сбросить' cancel={() => setPopupResetFilter(false)}
                   confirm={() => {}}
                    isNegative={true}
            >
            </Modal>
        </>
    );
};

export default Header;