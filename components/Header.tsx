import Link from "next/link";
import styles from "../styles/header.module.scss"
import {useEffect, useRef, useState} from "react"
import Modal from "./Modal";
import {useAppDispatch, useAppSelector} from "../redux/hooks";
import {selectAuthUserData, setAuthUserData} from "../redux/slices/auth";
import {destroyCookie} from 'nookies'
import Router, {useRouter} from "next/router";
import {Api} from "../api";
import modalStyles from '../styles/modal.module.scss'

type HeaderProps = {
    isFiltersPage?: boolean,
    isSearchAction?: boolean,
    isInteraction?: boolean,
    setPopupResetFilter?: (value: boolean) => void
}

const Header: React.FC<HeaderProps> = ({
                                           isFiltersPage = false,
                                           isSearchAction = false,
                                           isInteraction = false,
                                           setPopupResetFilter
                                       }) => {
    const [exitIsActive, setExitIsActive] = useState(false)

    const userData = useAppSelector(selectAuthUserData)

    const [popupExit, setPopupExit] = useState(false)
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
    const router = useRouter()

    const exit = async () => {
        try {
            await Api().auth.logout()
            destroyCookie(null, "rwsAuthToken")
            dispatch(setAuthUserData(null))
            localStorage.clear()
            await router.push('/login')
        } catch (e) {
            console.log('Logout error: ', e)
        }
    }

    const [recordingDeletedPopup, setRecordingDeletedPopup] = useState(false)

    const deleteRecording = async (recordingId) => {
        try {
            const data = await Api().recordings.deleteRecording(recordingId)
            if (data.status === 200) {
                setPopupDelete(false)
                setRecordingDeletedPopup(true)
            }
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
                                ??????????
                            </div>}
                        </div>
                        <nav className={styles.header__menu}>
                            <Link href='/'>?????????? ??????????????</Link>
                            <Link href='/list'>???????????? ??????????????</Link>
                            <Link href='/ref'>??????????????</Link>
                        </nav>
                    </>}
                    <div className={styles.header__action}>
                        {isSearchAction && <>
                            <button className={styles.header__action__reset}
                                    onClick={() => setPopupResetFilter(true)}
                            >
                                <img src="/reset.svg" alt="reset"/>
                                ????????????????
                            </button>
                            <button className={styles.header__action__find} form="main-form" type="submit">
                                <img src="/find.svg" alt="find"/>
                                ??????????
                            </button>
                        </>}
                        {isFiltersPage && <button className={styles.header__action__find}>?????????????? ????????????</button>}
                        {isInteraction && userData?.Capabilities[0].CanDelete === "true" &&
                            <button className={styles.header__action__reset}
                                    onClick={() => setPopupDelete(true)}>
                                <img src="/reset.svg" alt="reset"/>
                                ?????????????? ????????????
                            </button>}
                    </div>
                </div>
            </header>
            <Modal active={popupExit} setActive={setPopupExit} title='???????????' text='???? ?????????????????????????? ???????????? ???????????'>
                <div className={modalStyles.modal__content__action}>
                    <button onClick={() => setPopupExit(false)}>????????????????</button>
                    <button className={modalStyles.negative} onClick={() => exit()}>??????????</button>
                </div>
            </Modal>
            <Modal active={popupDelete} setActive={setPopupDelete} title='?????????????? ?????????????'
                   text='???? ???????????? ?????????????? ?????????????? ????????????.'>
                <div className={modalStyles.modal__content__action}>
                    <button onClick={() => setPopupDelete(false)}>????????????????</button>
                    <button className={modalStyles.negative} onClick={() => deleteRecording(router.query.id)}>
                        ??????????????
                    </button>
                </div>
            </Modal>
            <Modal active={recordingDeletedPopup} setActive={setRecordingDeletedPopup} title='???????????? ??????????????'>
                <div className={`${modalStyles.modal__content__action} ${modalStyles.modal__content_blue}`}
                     style={{justifyContent: 'center'}}>
                    <button className={modalStyles.positive} onClick={() => {
                        setRecordingDeletedPopup(false)
                        router.push('/list')
                    }}>????</button>
                </div>
            </Modal>
        </>
    );
};

export default Header;