import Link from "next/link";
import styles from "../styles/header.module.scss"
import {useEffect, useRef, useState} from "react"
import Modal from "./Modal";
import {useAppDispatch, useAppSelector} from "../redux/hooks";
import {selectAuthUserData, setAuthUserData} from "../redux/slices/auth";
import {destroyCookie} from 'nookies'
import {useRouter} from "next/router";
import {Api} from "../api";
import modalStyles from '../styles/modal.module.scss'
import {setIsPlaying, setRecordingDetail} from "../redux/slices/recordingDetail";
import {selectSearchedRecordings, setRecordings} from "../redux/slices/recordings";

type HeaderProps = {
    isFiltersPage?: boolean,
    isSearchAction?: boolean,
    isInteraction?: boolean,
    setPopupResetFilter?: (value: boolean) => void,
    selectFilter?: () => void
}

const Header: React.FC<HeaderProps> = ({
                                           isFiltersPage = false, isSearchAction = false,
                                           isInteraction = false, setPopupResetFilter, selectFilter
                                       }) => {
    const [exitIsActive, setExitIsActive] = useState(false)

    const userData = useAppSelector(selectAuthUserData)

    const [popupExit, setPopupExit] = useState(false)
    const [popupDelete, setPopupDelete] = useState(false)

    const exitModalRef = useRef(null)
    const exitModalBtnRef = useRef(null)

    // Закрытие окна выхода по клику вне окна
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
    const router = useRouter()

    // Логаут
    const exit = async () => {
        try {
            await Api().auth.logout()
            destroyCookie(null, "rwsAuthToken")
            dispatch(setAuthUserData(null))
            localStorage.clear()
            await router.push('/login')
            setPopupExit(false)
        } catch (e) {
            console.log('Logout error: ', e)
        }
    }

    const [recordingDeletedPopup, setRecordingDeletedPopup] = useState(false)

    // Удаление записи
    const {items} = useAppSelector(selectSearchedRecordings)
    const deleteRecording = async (recordingId) => {
        try {
            await Api().recordings.deleteRecording(recordingId)
            setPopupDelete(false)
            setRecordingDeletedPopup(true)
            dispatch(setIsPlaying({recordid: null, isPlaying: false}))
            dispatch(setRecordingDetail(null))
            // Обновление списка записей
            dispatch(setRecordings({items : items.filter(r => r.recordid !== recordingId)}))
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <>
            <header className={styles.header}>
                <div className={styles.container}>
                    <Link href={userData ? '/' : '/login'}>
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
                                    onClick={() => setPopupResetFilter(true)}
                            >
                                <img src="/reset.svg" alt="reset"/>
                                Сбросить
                            </button>
                            <button className={styles.header__action__find} form="main-form" type="submit">
                                <img src="/find.svg" alt="find"/>
                                Найти
                            </button>
                        </>}
                        {isFiltersPage && <button className={styles.header__action__find}
                                                  onClick={selectFilter}>Выбрать фильтр</button>}
                        {isInteraction && userData?.Capabilities[0].CanDelete === "true" &&
                            <button className={styles.header__action__reset}
                                    onClick={() => setPopupDelete(true)}>
                                <img src="/reset.svg" alt="reset"/>
                                Удалить запись
                            </button>}
                    </div>
                </div>
            </header>
            <Modal active={popupExit} setActive={setPopupExit} title='Выйти?' text='Вы действительно хотите выйти?'>
                <div className={modalStyles.modal__content__action}>
                    <button onClick={() => setPopupExit(false)}>Остаться</button>
                    <button className={modalStyles.negative} onClick={exit}>Выйти</button>
                </div>
            </Modal>
            <Modal active={popupDelete} setActive={setPopupDelete} title='Удалить запись?'
                   text='Вы хотите удалить текущую запись.'>
                <div className={modalStyles.modal__content__action}>
                    <button onClick={() => setPopupDelete(false)}>Отменить</button>
                    <button className={modalStyles.negative} onClick={() => deleteRecording(router.query.id)}>
                        Удалить
                    </button>
                </div>
            </Modal>
            <Modal active={recordingDeletedPopup} setActive={setRecordingDeletedPopup} title='Запись удалена'>
                <div className={`${modalStyles.modal__content__action} ${modalStyles.modal__content_blue}`}
                     style={{justifyContent: 'center'}}>
                    <button className={modalStyles.positive} onClick={() => {
                        setRecordingDeletedPopup(false)
                        router.push('/list')
                    }}>Ок
                    </button>
                </div>
            </Modal>
        </>
    );
};

export default Header;