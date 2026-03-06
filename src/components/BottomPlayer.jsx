import React from 'react';
import MediaControllers from '../minicomps/MediaControllerIcons';
import VolumeIcon from '../minicomps/VolumeIcons';
import ProgressBar from '../minicomps/ProgressBar';
import ShuffleButton from '../minicomps/ShuffleButton';
import AddToPlaylistButton from '../minicomps/AddToPlaylistButton';
import LikeButton from '../minicomps/LikeButton';
import OptionsMenu from '../minicomps/OptionsMenu';
import { useSongs } from '../context/SongContext';
import { usePlayback } from '../context/PlaybackContext';
import { getMediaUrl } from '../utils/media';

export default function BottomPlayer({ onExpand }) {
    const { currentSong } = useSongs();
    const { volume, handleVolumeChange } = usePlayback();
    
    const volumePercent = volume * 100;

    // Hide the player completely if nothing is playing
    if (!currentSong) return null;

    // Safely handle local vs absolute image URLs
    const coverUrl = getMediaUrl(currentSong.cover_path);

    return (
        <div className="fixed bottom-0 left-0 w-full bg-background-secondary/95 backdrop-blur-lg border-t border-border z-50 animate-in slide-in-from-bottom-10 duration-500 ease-out shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
            
            {/* Progress Bar - Positioned precisely on the top edge of the player */}
            <div className="absolute top-0 left-0 w-full -translate-y-1/2 z-10">
                <ProgressBar variant="bottom" />
            </div>

            <div className="flex items-center justify-between px-4 py-3 md:px-6 h-20">
                
                {/* LEFT SECTION: Cover, Info, & Quick Actions */}
                <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                    {/* Cover Art (Clickable) */}
                    <div 
                        onClick={onExpand}
                        className="relative w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-md overflow-hidden cursor-pointer group/cover shadow-md bg-background-primary"
                    >
                        <img 
                            src={coverUrl} 
                            alt={currentSong.title} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover/cover:scale-110"
                        />
                        {/* Expand Icon Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/cover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <svg className="w-6 h-6 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            </svg>
                        </div>
                    </div>

                    {/* Song Text (Clickable) */}
                    <div 
                        className="flex flex-col truncate cursor-pointer group/text" 
                        onClick={onExpand}
                    >
                        <div className="text-text-primary font-bold truncate text-sm md:text-base group-hover/text:underline">
                            {currentSong.title}
                        </div>
                        <div className="text-text-secondary text-xs md:text-sm truncate group-hover/text:text-text-primary transition-colors">
                            {currentSong.artist}
                        </div>
                    </div>

                    {/* Desktop Quick Actions (Hidden on mobile to save space) */}
                    <div className="hidden lg:flex items-center gap-1 ml-4 text-text-muted">
                        <LikeButton songId={currentSong.id} initialIsLiked={false} />
                        <AddToPlaylistButton songId={currentSong.id} variant="bottom" />
                    </div>
                </div>

                {/* CENTER SECTION: Playback Controls */}
                <div className="flex flex-col items-center justify-center shrink-0 px-4">
                    <div className="flex items-center gap-4 md:gap-6">
                        <div className="hidden sm:block">
                            <ShuffleButton />
                        </div>
                        <MediaControllers />
                        {/* If you add a Repeat button later, it goes right here! */}
                    </div>
                </div>

                {/* RIGHT SECTION: Volume & Menus */}
                <div className="flex flex-1 items-center justify-end gap-2 md:gap-4 min-w-0">
                    
                    {/* Like/Add buttons move here on medium screens, hide completely on tiny screens */}
                    <div className="hidden md:flex lg:hidden items-center gap-1 text-text-muted">
                        <LikeButton songId={currentSong.id} initialIsLiked={false} />
                    </div>

                    {/* Options Menu */}
                    <OptionsMenu />

                    {/* Desktop Volume Slider */}
                    <div className="hidden md:flex items-center gap-2 w-28 lg:w-32 group/volume ml-2">
                        <VolumeIcon volume={volume} />
                        <div className="relative h-1.5 w-full bg-background-primary rounded-full overflow-hidden flex items-center cursor-pointer">
                            <input 
                                type="range"
                                min="0" max="1" step="0.01"
                                value={volume}
                                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                                className="absolute inset-0 w-full h-full z-20 opacity-0 cursor-pointer"
                            />
                            {/* The filled volume bar turns purple when you hover the container! */}
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