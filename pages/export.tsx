import React, {useEffect} from 'react';
import {useRouter} from "next/router";
import {Api} from "../api";
import {useAppSelector} from "../redux/hooks";
import {selectAuthUserData} from "../redux/slices/auth";
import styles from '../styles/common.module.scss'

const Export = () => {

    const userData = useAppSelector(selectAuthUserData)

    if (userData?.Capabilities[0].CanExport === 'false') {
        return <div className={styles.messagePage}>У Вас нет прав на скачивание записи</div>
    }

    const {query} = useRouter()
    const fileName = query.fileName as string

    useEffect(() => {
        const download = async () => {
            await Api().recordings.downloadRecording(fileName)
        }
        fileName ? download() : null
    })
    return <div className={styles.messagePage}>Файл записи был загружен</div>
};

export default Export;