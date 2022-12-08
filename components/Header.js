import Link from "next/link";
import styles from "../styles/header.module.scss"
import {useEffect, useRef, useState} from "react"
import Modal from "./Modal";
import {useAppDispatch, useAppSelector} from "../redux/hooks";
import {selectAuthUserData, setAuthUserData} from "../redux/slices/auth";
import {destroyCookie} from 'nookies'
import Router from "next/router";

const Header = ({
                    isFiltersPage = false,
                    isSearchAction = false,
                    isInteraction = false
                }) => {
    const [exitIsActive, setExitIsActive] = useState(false)

    const userData = useAppSelector(selectAuthUserData)

    const [popupExit, setPopupExit] = useState(false)
    const [popupResetFilter, setPopupResetFilter] = useState(false)
    const [popupDelete, setPopupDelete] = useState(false)

    const exitModalRef = useRef(null)
    const exitModalBtnRef = useRef(null)

    useEffect(() => {
        if (!exitIsActive) return

        const handleClickOutside = (e) => {
            if (!exitModalBtnRef.current.contains(e.target)) {
                setExitIsActive(false)
            }
        }

        document.addEventListener('click', handleClickOutside)

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [exitIsActive, setExitIsActive])

    const dispatch = useAppDispatch()

    const exit = async () => {
        destroyCookie(null, "rwsAuthToken")
        dispatch(setAuthUserData(""))
        Router.replace('/login')
    }

    return (
        <>
            <header className={styles.header}>
                <div className={styles.container}>
                    <Link href='/'>
                        <img src='/logo.svg' alt="Logo"/>
                    </Link>
                    {userData && <>
                        <div className={styles.header__user}>
                            <div ref={exitModalBtnRef} className={styles.header__user__current}
                                 onClick={() => setExitIsActive(v => !v)}>
                                {`${userData.UserInfo[0].LastName} ${userData.UserInfo[0].FirstName}`}
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
                    </>}
                    <div className={styles.header__action}>
                        {isSearchAction && <>
                            <button className={styles.header__action__reset}
                                    onClick={() => setPopupResetFilter(true)}>
                                <img src="/reset.svg" alt="reset"/>
                                Сбросить
                            </button>
                            <button className={styles.header__action__find}>
                                <img src="/find.svg" alt="find"/>
                                Найти
                            </button>
                        </>}
                        {isFiltersPage && <button className={styles.header__action__find}>Выбрать фильтр</button>}
                        {isInteraction && <button className={styles.header__action__reset}
                                                  onClick={() => setPopupDelete(true)}>
                            <img src="/reset.svg" alt="reset"/>
                            Удалить запись
                        </button>}
                    </div>
                </div>
            </header>
            <Modal active={popupExit}
                   setActive={setPopupExit}
                   title='Выйти?' text='Вы действительно хотите выйти?' cancelText='Остаться'
                   confirmText='Выйти' cancel={() => setPopupExit(false)}
                   confirm={() => exit()}
                   isNegative={true}
            />
            <Modal active={popupResetFilter}
                   setActive={setPopupResetFilter}
                   title='Сбросить фильтр?' text='Вы хотите сбросить текущий фильтр.' cancelText='Отменить'
                   confirmText='Сбросить' cancel={() => setPopupResetFilter(false)}
                   confirm={() => {
                   }}
                   isNegative={true}
            />
            <Modal active={popupDelete}
                   setActive={setPopupDelete}
                   title='Удалить запись?' text='Вы хотите удалить текущую запись.' cancelText='Отменить'
                   confirmText='Удалить' cancel={() => setPopupDelete(false)}
                   confirm={() => {
                   }}
                   isNegative={true}
            />
        </>
    );
};

export default Header;