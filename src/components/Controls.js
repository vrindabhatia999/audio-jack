import React, { useEffect, useState, useRef } from 'react';
import VolumeUp from '../assets/volumeUp.svg';
import VolumeMute from '../assets/volumeMute.svg';
import Play from '../assets/play-button.svg';
import Pause from '../assets/pause-button.svg';

const Controls = ({
  audioRef,
  fullSongPlayed,
  playedPercentage,
  songDuration,
}) => {
  const progressRef = useRef();
  const currentTime = audioRef?.current?.currentTime;
  const [volume, setVolume] = useState(50);
  const [isPlaying, setIsPlaying] = useState(false);
  const play = () => {
    audioRef?.current?.play();
    setIsPlaying(true);
  };
  const pause = () => {
    audioRef?.current?.pause();
    setIsPlaying(false);
  };

  const handleProgress = () => {
    progressRef.current.value = audioRef?.current?.currentTime;
  };

  const volumeHandler = (e) => {
    setVolume(Number(e.target.value));
  };

  //for handling volume
  useEffect(() => {
    console.log(typeof volume);

    if (audioRef) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume, audioRef]);

  return (
    <div className='min-w-[80%] flex gap-5 flex-col'>
      <div className='flex justify-between'>
        <div>
          {isPlaying ? (
            <button onClick={pause}>
              <img width={20} height={20} src={Pause} />
            </button>
          ) : (
            <button onClick={play}>
              <img width={20} height={20} src={Play} />
            </button>
          )}
        </div>

        <div className='flex'>
          <div>
            {volume === 0 ? (
              <img onClick={() => setVolume(100)} src={VolumeMute} />
            ) : (
              <img onClick={() => setVolume(60)} src={VolumeUp} />
            )}
          </div>
          <input
            name='volume'
            type='range'
            min={0}
            max={100}
            onChange={volumeHandler}
            value={volume}
          />
        </div>
      </div>
      <div className='flex'>
        <span>{Math.floor(currentTime)}:00</span>
        <div
          style={{
            width: playedPercentage,
            background: `${playedPercentage ? '#4CBB17' : 'transparent'}`,
            height: '20px',
          }}></div>
        <input
          name='progress-bar'
          type='range'
          defaultValue={0}
          onChange={handleProgress}
          ref={progressRef}
        />
        <span>{Math.floor(songDuration)}:00</span>
      </div>
    </div>
  );
};

export default Controls;
