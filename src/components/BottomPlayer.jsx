import { useState, useEffect, useRef} from 'react';
import MediaControllers from '../minicomps/MediaControllerIcons';
import VolumeIcon from '../minicomps/VolumeIcons';
import f2Image from '../assets/f2.png';
import { useSongs } from '../context/SongContext';
import { usePlayback } from '../context/PlaybackContext';
import { audio } from 'framer-motion/client';
import ProgressBar from '../minicomps/ProgressBar';

export default function BottomPlayer({onExpand})
{
    const {currentSong} = useSongs();
    const { isPlaying, duration, currentTime, volume, handleVolumeChange, handleSeek } = usePlayback();
    
    const progressPercent = (currentTime/duration)*100 || 0;
    const volumePercent = volume*100;

    const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time/60);
        const seconds = Math.floor(time%60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    
    

    

    if (!currentSong) return null;

    return (
        <div className='group fixed w-full bottom-4 rounded-lg bg-black/80 z-20'>
        <div className="flex gap-4 items-center justify-between m-2  p-1 backdrop-blur-sm">
            <div className='flex gap-4 items-center'>
                <img onClick={onExpand} src={currentSong.cover_path} alt={currentSong.title} className="w-14 h-14 object-cover rounded-md"/>
                <div>
                    <div className="text-text-primary font-bold">{currentSong.title}</div>
                    <div className='text-text-secondary font-light'>{currentSong.artist}</div>
                </div>
            </div>

            <div>
                <MediaControllers/>
            </div>

            <div className='hidden md:flex items-center'>
                <VolumeIcon/>
                {/*volume*/}
                <div className='relative bg-background-active h-2 w-36 rounded-full'>
                    <input 
                        type="range"
                        min="0" max="1" step="0.01"
                        onChange={(e) => handleVolumeChange(Number(e.target.value))}
                        className="absolute inset-0 w-full h-full z-20 opacity-0 cursor-pointer"
                    />
                    <div className="bg-accent-active h-full rounded-full transition-all duration-100" style={{ width: `${volumePercent}%` }}></div>
                </div>
            </div>
        </div>
        {/*progress bar*/}
        <div className="relative flex items-center h-1 bg-background-secondary mx-3 rounded-full">
            <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={(e) => handleSeek(Number(e.target.value))}
                className='absolute h-full w-full inset-0 z-20 opacity-0 cursor-pointer'
            />
            <div className='h-1 bg-accent-secondary group-hover:bg-accent-hover transition-colors duration-200 ease-in-out w-1/3 rounded-full' style={{ width: `${progressPercent}%` }}></div>
            <div className='absolute w-3 h-3 bg-text-secondary hover:bg-text-primary opacity-0 group-hover:opacity-100 rounded-full' style={{ left: `${progressPercent}%` }}></div>
        </div>
        <div className='flex justify-between mx-3 pt-1 text-sm text-text-secondary'>
            <div>{formatTime(currentTime)}</div>
            <div className='opacity-0 group-hover:opacity-80 text-text-muted'>▽</div>
            <div>{formatTime(duration)}</div>
        </div>
        
        </div>
    );
}