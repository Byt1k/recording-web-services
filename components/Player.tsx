import WaveSurfer from "wavesurfer.js";
import Select from "react-select"
import {useEffect, useRef, useState} from "react";
import styles from '../styles/player.module.scss'
import timeTransformer from "../utils/timeTrasformer";
import copy from "copy-to-clipboard";
import {useAppDispatch, useAppSelector} from "../redux/hooks";
import {selectAuthUserData} from "../redux/slices/auth";
import Cookies, {parseCookies} from "nookies";
import {selectRecordingDetail, selectRecordingIsPlaying, setIsPlaying} from "../redux/slices/recordingDetail";

interface PlayerProps {
    pathFromProps?: string,
    durationFromProps?: string | number
}

const Player: React.FC<PlayerProps> = ({pathFromProps, durationFromProps}) => {
    const wavesurfer = useRef(null)
    const [track, setTrack] = useState(pathFromProps)
    const [isReady, setIsReady] = useState(false)
    // const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState("")
    const [duration, setDuration] = useState(durationFromProps)
    const [volume, setVolume] = useState(100)
    const [speed, setSpeed] = useState(1)

    const [isCopiedLink, setIsCopiedLink] = useState(false)

    const userData = useAppSelector(selectAuthUserData)

    const {isPlaying} = useAppSelector(selectRecordingIsPlaying)
    const dispatch = useAppDispatch()

    const cookies = parseCookies()
    const token = cookies.rwsAuthToken

    // Инициализация плеера
    useEffect(() => {
        wavesurfer.current = WaveSurfer.create({
            container: '#audio',
            backgroundColor: '#F0F2FE',
            waveColor: '#89B8D3',
            progressColor: '#C472B5',
            barWidth: 2,
            barHeight: 0.7,
            barGap: 2,
            cursorColor: '#4E485B',
            cursorWidth: 2,
            height: 48,
            responsive: true,
            fillParent: true,
            scrollParent: false,
            // splitChannels: true,
            xhr: {
                requestHeaders: [{
                    key: "Authorization",
                    value: `Bearer ${token}`
                }]
            }
        });
    }, [])

    const data = useAppSelector(selectRecordingDetail)

    useEffect(() => {

        setTrack(data?.path)

        // во время загрузки
        setDuration("--:--:--")

        track && wavesurfer.current.load(track)

        wavesurfer.current.on('ready', () => {
            dispatch(setIsPlaying({recordid: data.recordid, isPlaying: false}))
            setIsReady(true)
            // const duration = timeTransformer(wavesurfer.current.getDuration())
            setDuration(timeTransformer(data ? data.duration : durationFromProps))
            setIsCopiedLink(false)
        })

        wavesurfer.current.on('audioprocess', () => {
            const currentTime = timeTransformer(wavesurfer.current.getCurrentTime())
            setCurrentTime(currentTime)
        })

        wavesurfer.current.on('finish', stop)
    }, [track, data])

    // const playPause = async () => {
    //     await wavesurfer.current.playPause()
    //     dispatch(setIsPlaying({recordid: data.recordid, isPlaying: !isPlaying}))
    // }

    const stop = () => {
        wavesurfer.current.stop()
        dispatch(setIsPlaying({recordid: data.recordid, isPlaying: false}))
        setCurrentTime("")
    }

    useEffect(() => {
        wavesurfer.current.setVolume(volume / 100)
    }, [volume])

    useEffect(() => {
        wavesurfer.current.setPlaybackRate(speed)
    }, [speed])


    const copyLink = () => {
        copy(track)
        setIsCopiedLink(true)
    }

    useEffect(() => {
        const play = async () => {
            await wavesurfer.current.play()
        }
        const pause = async () => {
            await wavesurfer.current.pause()
        }

        !isPlaying ? pause() : play()
    }, [isPlaying])

    return (
        <div className={styles.player}>
            <div className={styles.player__audio} id="audio"></div>
            <div className={styles.player__control}>
                <div className={styles.left}>
                    <img src={!isPlaying ? "/play.svg" : "/pause.svg"} alt="playPause"
                         onClick={isReady ? () => dispatch(setIsPlaying({
                             recordid: data.recordid,
                             isPlaying: !isPlaying
                         })) : null}/>
                    <img src="/stop.svg" alt="stop" onClick={stop}/>
                    <img src="/prev.svg" alt="prev"/>
                    <img src="/next.svg" alt="next"/>
                    <input type="range" name="volume" min="0" max="100" step="1" value={volume}
                           className={styles.player__control__volume}
                           onChange={e => setVolume(+e.target.value)}/>
                    <Select options={[
                        {value: 1, label: '1x'},
                        {value: 1.5, label: '1.5x'},
                        {value: 2, label: '2x'}
                    ]}
                            instanceId="speed"
                            defaultValue={{value: 1, label: '1x'}}
                            styles={{
                                control: () => ({
                                    border: '2px solid #EEEDF0',
                                    width: 80,
                                    height: 22,
                                    display: 'flex',
                                    borderRadius: 6,
                                    alignItems: 'center'
                                })
                            }}
                            components={{
                                IndicatorSeparator: () => null
                            }}
                            onChange={({value}) => setSpeed(value)}
                    />
                    <p className={styles.player__control__time}>{currentTime || '00:00:00'}</p>
                </div>
                <div className={styles.right}>
                    <button
                        className={isCopiedLink
                            ? `${styles.player__control__copy} ${styles.player__control__copy_copied}`
                            : styles.player__control__copy}
                        onClick={copyLink}>
                        <img src={!isCopiedLink ? "/copy.svg" : "/copied-success.svg"} alt="copy"/>
                        {!isCopiedLink ? "Копировать ссылку" : "Скопировано!"}

                    </button>
                    {userData?.Capabilities[0].CanExport === 'true' &&
                        <button className={styles.player__control__download}>
                            <img src="/download.svg" alt="download"/>
                            Скачать mp3
                        </button>}
                    <p className={styles.player__control__time}>{isReady ? duration : '--:--:--'}</p>
                </div>
            </div>
        </div>
    );
};

export default Player;