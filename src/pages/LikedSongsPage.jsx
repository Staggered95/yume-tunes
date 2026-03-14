import React, { useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import { useSongs } from '../context/SongContext';
import ShuffleButton from '../minicomps/ShuffleButton';
import SkeletonCard from '../components/loading/SkeletonCard'; // Our master skeleton!
import { getMediaUrl } from '../utils/media';
import { usePagination } from '../hooks/usePagination'; // The custom hook
import OptionsMenu from '../minicomps/OptionsMenu';

const LikedSongsPage = () => {
    const { isLoggedIn } = useAuth();
    const { userProfile } = useUser();
    const { playQueue, playShuffledQueue } = useSongs();
    
    // 1. Swap out manual state for the pagination hook
    const { 
        data: songs, 
        loading, 
        hasMore, 
        loadNextPage 
    } = usePagination('/user/likedsongs', {}, isLoggedIn); // Re-run if auth changes

    // 2. The Intersection Observer (Trigger 9 items early!)
    const observer = useRef();
    const lastSongElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                loadNextPage();
            }
        });
        
        if (node) observer.current.observe(node);
    }, [loading, hasMore, loadNextPage]);

    const formatTime = (seconds) => {
        if (!seconds) return '--:--';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // 3. Initial Full-Page Loading State
    if (loading && songs.length === 0) {
        return (
            <div className="min-h-screen bg-background-primary flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-accent-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-text-secondary font-black text-xs uppercase tracking-widest">Waking up your favorites...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-primary text-text-primary pb-32">
            {/* 1. THE HERO HEADER */}
            <div className="relative min-h-[40vh] md:h-[50vh] flex items-end overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-accent-primary/30 to-background-primary z-0" />
                
                <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-10 flex flex-col md:flex-row gap-8 items-center md:items-end">
                    <div className="w-48 h-48 md:w-64 md:h-64 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-3xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center shrink-0 animate-in zoom-in duration-700">
                        <svg className="w-24 h-24 md:w-32 md:h-32 text-background-primary drop-shadow-2xl" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                    </div>

                    <div className="flex flex-col gap-2 text-center md:text-left animate-in slide-in-from-left-8 duration-700">
                        <span className="text-[10px] md:text-xs font-black tracking-[0.3em] uppercase text-accent-primary">Personal Collection</span>
                        <h1 className="text-5xl md:text-8xl font-black tracking-tighter italic uppercase leading-none">
                            Liked <br className="hidden md:block" /> Songs
                        </h1>
                        <div className="flex items-center justify-center md:justify-start gap-3 mt-4 text-sm font-bold">
                            <span className="text-text-primary">{userProfile?.username || 'You'}</span>
                            <span className="w-1 h-1 bg-text-muted rounded-full" />
                            <span className="text-text-secondary">{songs.length} Tracks</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. ACTION BAR */}
            <div className="sticky top-16 z-30 bg-background-primary/80 backdrop-blur-md border-b border-border/50">
                <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center gap-6">
                    <button 
                        onClick={() => playQueue(songs, 0)}
                        className="w-14 h-14 bg-accent-primary text-background-primary rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl shadow-accent-primary/20 group"
                    >
                        <svg viewBox="0 0 24 24" className="w-8 h-8 ml-1 transition-transform group-hover:scale-110" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                    </button>
                    <ShuffleButton 
                        variant="action" 
                        onClick={() => { if (songs.length > 0) playShuffledQueue(songs);}}
                    />
                </div>
            </div>

            {/* 3. THE TRACK LIST */}
            <div className="max-w-7xl mx-auto md:px-12 pt-8">
                
                {/* DYNAMIC HEADER GRID: 3 cols on mobile, 4 cols on md */}
                <div className="grid grid-cols-[40px_1fr_40px] md:grid-cols-[40px_1fr_80px_60px] gap-2 md:gap-4 px-2 md:px-4 py-3 text-text-muted text-[10px] font-black uppercase tracking-widest border-b border-border mb-4">
                    <div className="text-center">#</div>
                    <div>Title</div>
                    <div className="hidden md:block text-right">Time</div>
                    <div className="text-right hidden md:block">Action</div>
                </div>

                <div className="flex flex-col gap-1">
                    {songs.map((song, index) => {
                        const isTriggerElement = index === songs.length - 9;

                        return (
                            <div 
                                key={`liked-${song.id}-${index}`} 
                                ref={isTriggerElement ? lastSongElementRef : null}
                                onClick={() => playQueue(songs, index)}
                                /* DYNAMIC ROW GRID: Matches the header exactly */
                                className="group grid grid-cols-[40px_1fr_40px] md:grid-cols-[40px_1fr_80px_60px] gap-2 md:gap-4 px-2 md:px-4 py-2 md:py-3 items-center rounded-2xl hover:bg-background-secondary transition-all duration-300 cursor-pointer border border-transparent hover:border-border animate-fade-in will-change-transform"
                            >
                                {/* COLUMN 1: Index / Play Icon */}
                                <div className="text-text-muted text-xs font-bold text-center relative flex items-center justify-center">
                                    <span className="group-hover:opacity-0 transition-opacity">{index + 1}</span>
                                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-accent-primary absolute opacity-0 group-hover:opacity-100 transition-all transform scale-50 group-hover:scale-100" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                                </div>
                                
                                {/* COLUMN 2: Image & Title (min-w-0 forces truncation inside a grid) */}
                                <div className="flex items-center gap-3 md:gap-4 overflow-hidden min-w-0">
                                    <img 
                                        src={getMediaUrl(song.cover_path)} 
                                        alt="" 
                                        loading="lazy"
                                        decoding="async"
                                        className="w-10 h-10 md:w-12 md:h-12 rounded-lg shadow-md object-cover shrink-0 bg-border/20" 
                                    />
                                    <div className="flex flex-col min-w-0 overflow-hidden">
                                        <span className="text-text-primary font-bold text-sm md:text-base truncate group-hover:text-accent-primary transition-colors">
                                            {song.title}
                                        </span>
                                        <span className="text-text-secondary text-xs md:text-sm truncate">
                                            {song.artist}
                                        </span>
                                    </div>
                                </div>

                                {/* COLUMN 3: Time (Hidden entirely on mobile) */}
                                <div className="hidden md:block text-text-muted text-xs md:text-sm font-mono text-right">
                                    {formatTime(song.duration_seconds)}
                                </div>

                                {/* COLUMN 4: Options Menu (Takes minimal space on mobile, flex-end aligns it right) */}
                                <div className="flex items-center justify-end opacity-100 md:opacity-0 group-hover:opacity-100 transition-all">
                                    <OptionsMenu song={song} />
                                </div>
                                
                            </div>
                        );
                    })}

                    {loading && songs.length > 0 && (
                        <div className="mt-4 flex flex-col gap-2">
                            {[...Array(5)].map((_, i) => (
                                <SkeletonCard key={`append-${i}`} shape="list" />
                            ))}
                        </div>
                    )}
                </div>

                {!hasMore && songs.length > 0 && (
                    <div className="text-center text-text-muted mt-12 italic text-sm">
                        That's everything in your collection.
                    </div>
                )}
            </div>
        </div>
    );
};

export default LikedSongsPage;