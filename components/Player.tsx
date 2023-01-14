import WaveSurfer from "wavesurfer.js";
import Select from "react-select"
import {useEffect, useRef, useState} from "react";
import styles from '../styles/player.module.scss'
import timeTransformer from "../utils/timeTrasformer";
import copy from "copy-to-clipboard";
import {useAppDispatch, useAppSelector} from "../redux/hooks";
import {selectAuthUserData} from "../redux/slices/auth";
import {parseCookies} from "nookies";
import {selectRecordingDetail, selectRecordingIsPlaying, setIsPlaying} from "../redux/slices/recordingDetail";
import {Api} from "../api";
import {CircularProgressbar} from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';

const Player = () => {
    const wavesurfer = useRef(null)
    const [track, setTrack] = useState('')
    const [isReady, setIsReady] = useState(false)
    const [currentTime, setCurrentTime] = useState("")
    const [duration, setDuration] = useState<string | number>(0)
    const [volume, setVolume] = useState(100)
    const [speed, setSpeed] = useState(1)
    const [loadingProgress, setLoadingProgress] = useState(0)

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
            barWidth: 4,
            barHeight: 1,
            barGap: 2,
            cursorColor: '#4E485B',
            cursorWidth: 2,
            height: 70,
            responsive: true,
            fillParent: true,
            scrollParent: false,
            splitChannels: true,
            splitChannelsOptions: {
                overlay: true,
            },
            normalize: true,
            skipLength: 0,
            xhr: {
                requestHeaders: [{
                    key: "Authorization",
                    value: `Bearer ${token}`
                }]
            }
        });

        // change channel 0 progress color
        wavesurfer.current.setProgressColor('red', 0);
        // change channel 1 wave color
        wavesurfer.current.setWaveColor('blue', 1);
        // get channel 0 progress color
        wavesurfer.current.getProgressColor(0);

        wavesurfer.current.drawer.drawBars = function (peaks, channelIndex, start, end) {
            return customDrawBars(wavesurfer, peaks, channelIndex, start, end);
        };

        function customDrawBars(wavesurfer, peaks, channelIndex, start, end) {

            return wavesurfer.current.drawer.prepareDraw(peaks, channelIndex, start, end, function (_ref) {
                const absmax = _ref.absmax,
                    hasMinVals = _ref.hasMinVals,
                    height = _ref.height,
                    offsetY = _ref.offsetY,
                    halfH = _ref.halfH,
                    peaks = _ref.peaks,
                    chInd = _ref.channelIndex;

                // if drawBars was called within ws.empty we don't pass a start and
                // don't want anything to happen
                if (start === undefined) {
                    return;
                } // Skip every other value if there are negatives.

                const peakIndexScale = hasMinVals ? 2 : 1;
                const length = peaks.length / peakIndexScale;
                const bar = wavesurfer.current.params.barWidth * wavesurfer.current.params.pixelRatio;
                const gap = wavesurfer.current.params.barGap === null ? Math.max(wavesurfer.current.params.pixelRatio, ~~(bar / 2)) : Math.max(wavesurfer.current.params.pixelRatio, wavesurfer.current.params.barGap * wavesurfer.current.params.pixelRatio);
                const step = bar + gap;
                const scale = length / wavesurfer.current.drawer.width;
                const first = start;
                const last = end;

                const topRatio = 0.5;
                const bottomRatio = 0.5;
                const topBottomGap = 1;

                for (let i = first; i < last; i += step) {
                    const peak = peaks[Math.floor(i * scale * peakIndexScale)] || 0;
                    const h = Math.abs(Math.round(peak / absmax * height));

                    // Upper bars
                    let fx = i + wavesurfer.current.drawer.halfPixel;
                    let fy = (height * topRatio) + offsetY - (h * topRatio);
                    let fwidth = bar + wavesurfer.current.drawer.halfPixel;
                    let fheight = h * topRatio;

                    //ЕСЛИ КАНАЛ 0, ТО РИСУЕМ ВЕРХНИЕ ПАЛОЧКИ
                    if (chInd == 0) {
                        wavesurfer.current.params.waveColor = '#F088C1'
                        wavesurfer.current.params.progressColor = '#C472B5'
                        wavesurfer.current.drawer.fillRect(fx, fy, fwidth, fheight);

                    }

                    // Recalculate for lower bar
                    fy = (height * topRatio) + offsetY + topBottomGap;
                    fheight = h * bottomRatio;

                    //ЕСЛИ КАНАЛ 1 ТО РИСУЕМ НИЖНИЕ ПАЛОЧКИ
                    if (chInd == 1) {
                        wavesurfer.current.params.waveColor = '#97C5DD'
                        wavesurfer.current.params.progressColor = '#C472B5'
                        wavesurfer.current.drawer.fillRect(fx, fy, fwidth, fheight);
                    }
                }
            });
        }

    }, [])

    // Получение информации о выбранном трэке
    const data = useAppSelector(selectRecordingDetail)

    // Загрузка трэка
    useEffect(() => {
        dispatch(setIsPlaying({recordid: data?.recordid, isPlaying: false}))
        setTrack(data?.path)
        setDuration(timeTransformer(data?.duration || 0))
        setIsCopiedLink(false)

        track && wavesurfer.current.load(track)

        wavesurfer.current.on('audioprocess', () => {
            const currentTime = timeTransformer(wavesurfer.current.getCurrentTime())
            setCurrentTime(currentTime)
        })

        wavesurfer.current.on('finish', stop)
    }, [track, data])

    // Подписка на процесс загрузки и готовность трэка
    useEffect(() => {
        wavesurfer.current.on('loading', (progress) => {
            setLoadingProgress(progress)
        })

        wavesurfer.current.on('ready', () => {
            setIsReady(true)
        })
    }, [])

    // Остановка трэка (не пауза)
    const stop = () => {
        wavesurfer.current.stop()
        dispatch(setIsPlaying({recordid: data?.recordid, isPlaying: false}))
        setCurrentTime("")
    }

    // Изменение громкости
    useEffect(() => {
        wavesurfer.current.setVolume(volume / 100)
    }, [volume])

    // Изменение скорости
    useEffect(() => {
        wavesurfer.current.setPlaybackRate(speed)
    }, [speed])

    // Копирование ссылки для скачивания
    const [baseURL, setBaseURL] = useState('')
    useEffect(() => {
        const url = window.location.href.split('/').slice(0, 3).join('/')
        setBaseURL(url)
    }, [])

    const copyLink = () => {
        const fileName = track?.split('/').reverse()[0]
        copy(`${baseURL}/export?fileName=${fileName}`)
        setIsCopiedLink(true)
    }

    // Плэй (пауза)
    useEffect(() => {
        const play = async () => {
            await wavesurfer.current.play()
        }
        const pause = async () => {
            await wavesurfer.current.pause()
        }

        isPlaying ? play() : pause()
    }, [isPlaying])

    // Скачивание файла
    const download = async () => {
        try {
            const fileName = track.split('/').reverse()[0]
            await Api().recordings.downloadRecording(fileName)
        } catch (e) {
            console.log('Download error:', e)
        }
    }

    // Перемотка записи
    const skip = (direction: 'forward' | 'back') => {
        const offset = Math.ceil(data?.duration / 60) * 10
        wavesurfer.current.skip(direction === 'forward' ? offset : -offset)
    }

    // Остановка записи при смене url
    useEffect(() => () => stop(), [])

    return (
        <div className={styles.player}>
            <div className={styles.player__audio} id="audio">
                {loadingProgress === 0 && !isReady && <div>Запись не выбрана</div>}
                {loadingProgress > 0 && loadingProgress < 100 && <div>
                    <CircularProgressbar value={loadingProgress} text={`${loadingProgress} %`} />
                </div>}
            </div>

            <div className={styles.player__control}>
                <div className={styles.left}>
                    <img src={!isPlaying ? "/play.svg" : "/pause.svg"} alt="playPause"
                         onClick={() => (
                             isReady
                                 ? dispatch(setIsPlaying({recordid: data.recordid, isPlaying: !isPlaying}))
                                 : null
                         )}/>
                    <img src="/stop.svg" alt="stop" onClick={stop}/>
                    <img src="/prev.svg" alt="back" onClick={() => skip('back')}/>
                    <img src="/next.svg" alt="forward" onClick={() => skip('forward')}/>
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
                                    width: 84,
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
                    {userData?.Capabilities[0].CanExport === 'true' &&
                        <>
                            <button className={isCopiedLink
                                ? `${styles.player__control__copy} ${styles.player__control__copy_copied}`
                                : styles.player__control__copy}
                                    onClick={isReady ? copyLink : null}>
                                <img src={!isCopiedLink ? "/copy.svg" : "/copied-success.svg"} alt="copy"/>
                                {!isCopiedLink ? "Копировать ссылку" : "Скопировано!"}
                            </button>
                            <button onClick={isReady ? download : null} className={styles.player__control__download}>
                                <img src="/download.svg" alt="download"/>
                                Скачать mp3
                            </button>
                        </>
                    }
                    <p className={styles.player__control__time}>{duration}</p>
                </div>
            </div>
        </div>
    );
};

export default Player;