import { useState, useEffect, useRef} from 'react';
import MediaControllers from '../minicomps/MediaControllerIcons';
import VolumeIcon from '../minicomps/VolumeIcons';
import f2Image from '../assets/f2.png';
import { useSongs } from '../context/SongContext';
import { usePlayback } from '../context/PlaybackContext';
import { audio } from 'framer-motion/client';
import ProgressBar from '../minicomps/ProgressBar';
import ShuffleButton from '../minicomps/ShuffleButton';
import AddToPlaylistButton from '../minicomps/AddToPlaylistButton';
import LikeButton from '../minicomps/LikeButton';
import OptionsMenu from '../minicomps/OptionsMenu';



export default function BottomPlayer({onExpand})
{
    const { currentSong } = useSongs();
    const { volume, handleVolumeChange } = usePlayback();
    
    
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
        <div className="flex gap-4 items-center m-2  p-1 backdrop-blur-sm">
            <div className='flex flex-1 gap-4 items-center min-w-0'>
                <img onClick={onExpand} src={currentSong.cover_path} alt={currentSong.title} className="w-14 h-14 object-cover rounded-md"/>
                <div>
                    <div className="text-text-primary font-bold">{currentSong.title}</div>
                    <div className='text-text-secondary font-light'>{currentSong.artist}</div>
                </div>
                <div>
                    <AddToPlaylistButton songId={currentSong.id} variant='bottom'/>
                </div>
                <div><ShuffleButton/></div>
                <div><LikeButton songId={currentSong.id} initialIsLiked={false} /></div>
                <div><OptionsMenu /></div>
            </div>

            <div className='flex-none'>
                <MediaControllers/>
            </div>

            <div className='hidden md:flex flex-1 justify-end items-center'>
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
        <ProgressBar variant='bottom' />
        
        </div>
    );
}