import WaveSurfer from "wavesurfer.js";
import Select from "react-select"
import {useEffect, useRef} from "react";
import styles from '../styles/player.module.scss'


const Player = () => {
    const wavesurfer = useRef(null)

    useEffect(() => {
        const track = '/Monolink-BurningSun.mp3';

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
            scrollParent: false
        })

        wavesurfer.current.load(track)
    },[])

    return (
        <div className={styles.player}>
            <div className={styles.player__audio} id="audio"></div>
            <div className={styles.player__control}>
                <div className={styles.left}>
                    <img src="/play.svg" alt="play" onClick={() => wavesurfer.current.play()}/>
                    <img src="/stop.svg" alt="stop" onClick={() => wavesurfer.current.pause()}/>
                    <img src="/prev.svg" alt="prev"/>
                    <img src="/next.svg" alt="next"/>
                    <img src="/volume.svg" alt="volume"/>
                    <Select
                        options={[
                            { value: 1, label: '1x' },
                            { value: 1.5, label: '1.5x' },
                            { value: 2, label: '2x' }
                        ]}
                        defaultValue={{value: 1, label: '1x'}}
                        styles ={{
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
                    />
                    <p className={styles.player__control__time}>00:00:00</p>
                </div>
                <div className={styles.right}>
                    <button className={styles.player__control__copy}>
                        <img src="/copy.svg" alt="copy"/>
                        Копировать ссылку
                    </button>
                    <button className={styles.player__control__download}>
                        <img src="/download.svg" alt="download"/>
                        Скачать mp3
                    </button>
                    <p className={styles.player__control__time}>00:04:47</p>
                </div>
            </div>
        </div>
    );
};

export default Player;