import React from 'react';
import MediaControllers from '../minicomps/MediaControllerIcons';
import VolumeIcon from '../minicomps/VolumeIcons';
import ProgressBar from '../minicomps/ProgressBar';
import ShuffleButton from '../minicomps/ShuffleButton';
import AddToPlaylistButton from '../minicomps/AddToPlaylistButton';
import LikeButton from '../minicomps/LikeButton';
import OptionsMenu from '../minicomps/OptionsMenu';
import ScrollingText from '../minicomps/ScrollingText'; // <-- Your new component!
import { useSongs } from '../context/SongContext';
import { usePlayback } from '../context/PlaybackContext';
import { getMediaUrl } from '../utils/media';
import { useScrollDirection } from '../hooks/useScrollDirection';

export default function BottomPlayer({ onExpand }) {
    const { currentSong } = useSongs();
    const { volume, handleVolumeChange } = usePlayback();
    const scrollDirection = useScrollDirection();
    
    const volumePercent = volume * 100;

    if (!currentSong) return null;
    const coverUrl = getMediaUrl(currentSong.cover_path);

    return (
        <div 
            className={`fixed left-0 right-0 bg-background-secondary/90 backdrop-blur-xl md:border-t border-border z-50 transition-all duration-300 safe-area-pb md:bottom-0 ${
                scrollDirection === 'down' ? 'bottom-0' : 'bottom-14 md:bottom-0'
            }`}
        >            
            <div className="absolute top-0 left-0 w-full -translate-y-1/2 z-10">
                <ProgressBar variant="bottom" />
            </div>

            <div className="flex items-center justify-between px-3 md:px-6 h-16 md:h-20 gap-2 md:gap-0">
                
                {/* 1. LEFT SECTION (Cover & Scrolling Info) 
                    On mobile: Takes up all available space (flex-1)
                    On desktop: Locks to 1/3 width (md:w-1/3) 
                */}
                <div className="flex items-center gap-3 flex-1 md:flex-none md:w-1/3 min-w-0 pr-2 cursor-pointer group/cover" onClick={onExpand}>
                    <div className="relative w-10 h-10 md:w-14 md:h-14 shrink-0 rounded-md overflow-hidden shadow-md bg-background-primary">
                        <img 
                            src={coverUrl} 
                            alt={currentSong.title} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover/cover:scale-110"
                        />
                    </div>

                    <div className="flex flex-col min-w-0 w-full justify-center">
                        {/* THE NEW SCROLLING TEXT! */}
                        <ScrollingText 
                            text={currentSong.title} 
                            className="text-text-primary font-bold text-sm md:text-base hover:underline"
                        />
                        <div className="text-text-secondary text-xs md:text-sm truncate">
                            {currentSong.artist}
                        </div>
                    </div>
                </div>

                {/* 2. CENTER SECTION (Playback Controls) 
                    On mobile: Pushed to extreme right
                    On desktop: Centered (md:w-1/3 md:justify-center)
                */}
                <div className="flex items-center justify-end md:justify-center shrink-0 md:w-1/3">
                    <div className="flex items-center gap-3 md:gap-6">
                        <div className="hidden sm:block">
                            <ShuffleButton />
                        </div>
                        <MediaControllers />
                    </div>
                </div>

                {/* 3. RIGHT SECTION (Volume & Extras) 
                    On mobile: Completely hidden
                    On desktop: 1/3 width, aligned right
                */}
                <div className="hidden md:flex items-center justify-end gap-4 w-1/3 min-w-0">
                    <div className="flex items-center gap-1 text-text-muted">
                        <LikeButton songId={currentSong.id} initialIsLiked={false} />
                        <AddToPlaylistButton songId={currentSong.id} variant="bottom" />
                    </div>

                    <OptionsMenu song={currentSong} />

                    <div className="flex items-center gap-2 w-28 lg:w-32 group/volume ml-2">
                        <VolumeIcon volume={volume} />
                        <div className="relative h-1.5 w-full bg-background-primary rounded-full overflow-hidden flex items-center cursor-pointer">
                            <input 
                                type="range"
                                min="0" max="1" step="0.01"
                                value={volume}
                                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                                className="absolute inset-0 w-full h-full z-20 opacity-0 cursor-pointer"
                            />
                            <div 
                                className="h-full bg-text-secondary group-hover/volume:bg-accent-primary transition-colors duration-300 rounded-full" 
                                style={{ width: `${volumePercent}%` }}
                            />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}