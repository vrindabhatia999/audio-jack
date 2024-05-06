import React, { useEffect, useRef, useState } from 'react';
import Controls from './Controls';
import defaultimg from '../assets/defaultImg.png';

const Audio = ({ src, songImg }) => {
  const audioRef = useRef();
  const [currentTrack, setCurrentTrack] = useState();
  const [fullSongPlayed, setFullSongPlayed] = useState(false);
  const [time, setTime] = useState();
  const [songDuration, setSongDuration] = useState();
  useEffect(() => {
    setCurrentTrack(src);
    setFullSongPlayed(false);
  }, [src]);

  const timeUpdate = () => {
    setTime(audioRef?.current?.currentTime);
    const audioElement = audioRef.current;
    if (
      audioElement.currentTime === audioElement.duration &&
      audioElement.ended
    ) {
      audioElement.pause(); // Pause the audio when it ends
    }
  };
  const percentage = (time / audioRef?.current?.duration) * 100;

  useEffect(() => {
    audioRef?.current?.addEventListener('timeupdate', audioRef);

    //cleanup function
    return () => {
      audioRef?.current?.removeEventListener('timeupdate', audioRef);
    };
  }, []);

  const onLoadMetaData = () => {
    console.log('loaded');

    setSongDuration(audioRef.current.duration);
  };

  return (
    <div className='flex px-4 py-2 bg-[#3A6960] min-w-[500px] justify-between items-center '>
      <div>
        {songImg ? (
          <img src={songImg} height={70} width={70} className='' />
        ) : (
          <img src={defaultimg} height={150} width={160} />
        )}
      </div>

      <audio
        onTimeUpdate={timeUpdate}
        src={currentTrack}
        onLoadedMetadata={onLoadMetaData}
        ref={audioRef}></audio>
      <Controls
        audioRef={audioRef}
        fullSongPlayed={fullSongPlayed}
        playedPercentage={percentage}
        songDuration={songDuration}
      />
    </div>
  );
};

export default Audio;
