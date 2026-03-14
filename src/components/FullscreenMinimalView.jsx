import React, { useEffect, useState } from 'react';
import { usePlayback } from '../context/PlaybackContext';
import { useSongs } from '../context/SongContext';
import { parseLRC } from '../utils/lyricsParser';
import ProgressBar from '../minicomps/ProgressBar';
import LiveLyrics from '../minicomps/LiveLyrics';
import OptionsMenu from '../minicomps/OptionsMenu';
import LikeButton from '../minicomps/LikeButton';
import AddToPlaylistButton from '../minicomps/AddToPlaylistButton';
import MediaControllers from '../minicomps/MediaControllerIcons';
import { getMediaUrl } from '../utils/media';

const FullscreenMinimalView = ({ isOpen, onClose, onToggle, song }) => {
  const { isPlaying, togglePlay } = usePlayback();
  const { nextSong, prevSong } = useSongs(); 
  const [lyrics, setLyrics] = useState([]);
  const [lyricLang, setLyricLang] = useState('EN'); 

  useEffect(() => {
    if (song?.lyrics) {
      setLyrics(parseLRC(song.lyrics));
    } else {
      setLyrics([]); 
    }
  }, [song, lyricLang]); 

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleLangToggle = () => {
      setLyricLang(prev => {
          if (prev === 'EN') return 'RO';
          if (prev === 'RO') return 'JP';
          return 'EN';
      });
  };

  return (
    <div className={`fixed inset-0 z-50 bg-background-primary text-text-primary flex flex-col p-6 md:p-10 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${
      isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
    }`}>
      
      {/* 1. AMBIENT BACKDROP */}
      {song?.cover_path && (
        <div className="absolute inset-0 opacity-25 blur-[120px] scale-150 pointer-events-none overflow-hidden">
           <img src={getMediaUrl(song.cover_path)} className="w-full h-full object-cover" alt="" />
        </div>
      )}

      {/* 2. TOP NAV (z-10, shrink-0 so it never squishes) */}
      <div className="relative z-10 shrink-0 flex justify-between items-center w-full max-w-[98vw] mx-auto">
        <button onClick={onClose} className="p-3 bg-background-secondary rounded-full hover:bg-background-hover text-text-secondary hover:text-text-primary transition-all duration-300 group shrink-0" title="Close fullscreen">
           <svg className="w-6 h-6 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
           </svg>
        </button>

        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center text-center w-1/3">
            <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-text-secondary uppercase truncate w-full">
                {song?.anime || "Single"}
            </span>
        </div>
        
        <div className="flex items-center gap-3 shrink-0">
            {lyrics.length > 0 && (
                <button 
                    onClick={handleLangToggle}
                    title="Change Lyrics Script"
                    className="hidden md:flex items-center justify-center w-10 h-10 bg-background-secondary border border-border rounded-full hover:bg-background-hover hover:border-border-hover transition-all duration-300 hover:scale-105"
                >
                    <span className="text-xs font-black tracking-widest text-text-primary">
                        {lyricLang}
                    </span>
                </button>
            )}

            <AddToPlaylistButton songId={song?.id} variant='full' className="hidden md:flex p-2 bg-background-secondary rounded-full hover:bg-background-hover transition-colors duration-300" />
            <OptionsMenu song={song} className="p-1 bg-background-secondary rounded-full hover:bg-background-hover transition-colors duration-300" />
            
            <button 
                onClick={onToggle}
                className="hidden md:block px-5 py-2.5 ml-2 bg-background-secondary border border-border rounded-full text-[10px] text-text-primary font-bold uppercase tracking-widest hover:bg-background-hover hover:border-border-hover transition-all duration-300 hover:scale-105"
            >
                Queue & Settings →
            </button>
        </div>
      </div>

      {/* 3. THE STAGE (z-20 so it pops OVER the navs, overflow-visible, py-8 for vertical breathing room) */}
      <div className="relative z-20 flex-1 min-h-0 w-full max-w-[95vw] 2xl:max-w-screen-2xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16 lg:gap-24 overflow-visible py-8 md:py-12 mt-4 md:mt-0 px-2 lg:px-8">
        
        {/* ARTWORK WRAPPER */}
        <div className="w-56 md:w-full md:max-w-md lg:max-w-[28rem] xl:max-w-[32rem] shrink-0 flex flex-col items-center md:items-start relative z-30">
          
          <div className="relative group w-full aspect-square rounded-2xl shadow-2xl overflow-hidden transition-transform duration-700 hover:scale-[1.05] border border-border">
            <img 
              src={getMediaUrl(song?.cover_path)} 
              className="w-full h-full object-cover" 
              alt={song?.title} 
            />
            
            <div className="absolute inset-0 bg-background-primary/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center transition-all duration-300">
                <LikeButton songId={song?.id} variant='massive' className="w-full h-full" />
            </div>
          </div>

          {/* TEXT BOX (shrink-0 prevents vertical squishing) */}
          <div className="mt-6 md:mt-8 text-center md:text-left w-full flex flex-col items-center md:items-start shrink-0">
            <div className="flex items-center justify-center md:justify-start gap-4 w-full">
                <h1 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black tracking-tighter truncate max-w-[85%] text-text-primary">
                    {song?.title}
                </h1>
                <div className="md:hidden mt-1">
                    <LikeButton variant='massive' songId={song?.id} />
                </div>
            </div>
            {/* Added line-clamp-2 just in case an artist name is paragraph-length! */}
            <p className="text-sm md:text-xl lg:text-2xl text-text-secondary font-medium mt-1 md:mt-3 w-full break-words whitespace-normal line-clamp-2 md:pr-4">
                {song?.artist}
            </p>
          </div>
        </div>

        {/* Focused Lyrics */}
        <div className="flex-1 w-full max-w-2xl lg:max-w-4xl xl:max-w-5xl h-48 md:h-full flex items-center">
            {lyrics.length > 0 ? (
                <LiveLyrics lyrics={lyrics} language={lyricLang} />
            ) : (
                <div className="w-full text-center md:text-left text-text-muted text-xl md:text-2xl font-bold tracking-widest uppercase">
                    No Lyrics Available
                </div>
            )}
        </div>
      </div>

      {/* 4. ZEN CONTROLS (z-10, shrink-0) */}
      <div className="relative z-10 shrink-0 flex flex-col items-center gap-6 md:gap-8 lg:gap-2 pb-2 md:pb-4">
        <MediaControllers variant="fullscreen" />
        <ProgressBar variant="fullscreen" />
      </div>
      
    </div>
  );
};

export default FullscreenMinimalView;