import React, { useEffect, useState, useRef } from 'react';
import { usePlayback } from '../context/PlaybackContext';
import { parseLRC } from '../utils/lyricsParser';
import ProgressBar from '../minicomps/ProgressBar';
import LiveLyrics from '../minicomps/LiveLyrics';
import OptionsMenu from '../minicomps/OptionsMenu';
import BottomPlayer from './BottomPlayer';
import LikeButton from '../minicomps/LikeButton';
import AddToPlaylistButton from '../minicomps/AddToPlaylistButton';

const FullscreenMinimalView = ({ isOpen, onClose, onToggle, song }) => {
  const { isPlaying, togglePlay } = usePlayback();
  const [lyrics, setLyrics] = useState([]);
  const lyricRefs = useRef([]);

  

    console.log("Full screen player rendering");

  // 1. Sync Lyrics
  useEffect(() => {
    if (song?.lyrics) setLyrics(parseLRC(song.lyrics));
  }, [song]);

  

  // 3. Scroll & Key Hijacking
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === ' ') { e.preventDefault(); togglePlay(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, togglePlay, onClose]);

  

  return (
    <div className={`fixed inset-0 z-50 bg-[#050505] text-white flex flex-col p-6 md:p-12 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${
      isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
    }`}>
      
      {/* 1. AMBIENT BACKDROP */}
      {song?.cover_path && (
        <div className="absolute inset-0 opacity-25 blur-[120px] scale-150 pointer-events-none overflow-hidden">
           <img src={`http://localhost:5000${song.cover_path}`} className="w-full h-full object-cover" alt="" />
        </div>
      )}

      {/* 2. TOP NAV (Minimal) */}
      <div className="relative z-10 flex justify-between items-start">
        <button onClick={onClose} className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-all">
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
           </svg>
        </button>
        
        {/* Toggle to Full Controls */}
        <button 
          onClick={onToggle}
          className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
        >
          Settings & Queue →
        </button>
        <div><LikeButton songId={song.id} /></div>
        <div>
                    <AddToPlaylistButton songId={song.id} variant='bottom'/>
                </div>
        <div> <OptionsMenu /> </div>
      </div>

      {/* 3. THE STAGE (Artwork & Lyrics) */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-10 md:gap-24 overflow-hidden">
        <div className="w-32 md:w-full md:max-w-sm shrink-0">
          <img 
            src={`http://localhost:5000${song?.cover_path}`} 
            className="w-full aspect-square object-cover rounded-2xl shadow-2xl transition-transform duration-700 hover:scale-[1.02]" 
            alt="" 
          />
          <div className="mt-6 text-center md:text-left">
            <h1 className="text-2xl md:text-4xl font-black tracking-tighter">{song?.title}</h1>
            <p className="text-sm md:text-lg text-white/40 font-medium">{song?.artist}</p>
          </div>
        </div>

        {/* Focused Lyrics */}
        <LiveLyrics lyrics={lyrics} />
      </div>

      {/* 4. ZEN CONTROLS (Bottom) */}
      <div className="relative z-10 w-full max-w-4xl mx-auto pt-8">
        {/* Play/Pause is the only visible button in Zen mode */}
        <div className="flex flex-col items-center gap-6">
          <button 
            onClick={togglePlay}
            className="p-6 bg-white text-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl"
          >
            {isPlaying ? (
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            ) : (
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>

          {/* Thin minimalist progress bar */}
          <ProgressBar variant='fullscreen' />
        </div>
      </div>
    </div>
  );
};

export default FullscreenMinimalView;