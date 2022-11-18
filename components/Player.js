import WaveSurfer from "wavesurfer.js";
import Select from "react-select"
import {useEffect, useRef} from "react";


const Player = () => {
    const wavesurfer = useRef(null)


    useEffect(() => {
        const track = '/Monolink-BurningSun.mp3';

        wavesurfer.current = WaveSurfer.create({
            container: '.player__audio',
            backgroundColor: '#F0F2FE',
            waveColor: '#89B8D3',
            progressColor: '#C472B5',
            barWidth: 4,
            barGap: 3,
            cursorColor: '#4E485B',
            cursorWidth: 2,
            height: 140,
            responsive: true,
            fillParent: true,
            scrollParent: false
        })

        wavesurfer.current.load(track)
    },[])

    return (
        <div className="player">
            <div className="player__audio"></div>
            <div className="player__control">
                <div className="left">
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
                                width: 90,
                                height: 31,
                                display: 'flex',
                                borderRadius: 9
                            })
                        }}
                        components={{
                            IndicatorSeparator: () => null
                        }}
                    />
                    <p className="current-time">00:00:00</p>
                </div>
                <div className="right">
                    <button className="copy">
                        <img src="/copy.svg" alt="copy"/>
                        Копировать ссылку
                    </button>
                    <button className="download">
                        <img src="/download.svg" alt="download"/>
                        Скачать mp3
                    </button>
                    <p className="duration">00:04:47</p>
                </div>
            </div>
        </div>
    );
};

export default Player;