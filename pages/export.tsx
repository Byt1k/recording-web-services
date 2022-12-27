import React, {useEffect} from 'react';
import {useRouter} from "next/router";
import {Api} from "../api";

const Export = () => {

    const {query} = useRouter()
    const fileName = query.fileName as string

    useEffect(() => {
        const download = async () => {
            await Api().recordings.downloadRecording(fileName)
        }
        fileName ? download() : null
    })
    return (
        <>
            <div>Файл записи был загружен</div>
            <style jsx>{`
              div {
                height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
              }
            `}</style>
        </>
    );
};



export default Export;