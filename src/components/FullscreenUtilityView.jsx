import React, { useState, useEffect } from 'react';
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

const FullscreenUtilityView = ({ isOpen, onClose, onToggle, song }) => {
  const { isPlaying } = usePlayback();
  const { queue, currentIndex, playQueue, reorderQueue,isShuffle, toggleShuffle } = useSongs(); 
  
  const [activeTab, setActiveTab] = useState('queue'); 
  const [lyricLang, setLyricLang] = useState('EN');
  const [lyrics, setLyrics] = useState([]);
  
  const [isRepeat, setIsRepeat] = useState(false);

  // === RESPONSIVE STATE ===
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [leftWidth, setLeftWidth] = useState(40); 
  const [isDraggingPane, setIsDraggingPane] = useState(false);
  
  // === MOBILE BOTTOM SHEET STATE ===
  const [isSheetExpanded, setIsSheetExpanded] = useState(false);
  const [touchStartY, setTouchStartY] = useState(null);
  
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);

  useEffect(() => {
      const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (song?.lyrics) setLyrics(parseLRC(song.lyrics));
    else setLyrics([]); 
  }, [song]);

  // === DESKTOP RESIZER LOGIC ===
  useEffect(() => {
    if (!isDesktop) return; 
    const handleMouseMove = (e) => {
        if (!isDraggingPane) return;
        const newWidth = (e.clientX / window.innerWidth) * 100;
        if (newWidth > 30 && newWidth < 60) setLeftWidth(newWidth);
    };
    const handleMouseUp = () => setIsDraggingPane(false);

    if (isDraggingPane) {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = 'none'; 
    } else {
        document.body.style.userSelect = 'auto';
    }

    return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingPane, isDesktop]);

  // === MOBILE SWIPE LOGIC ===
  const handleTouchStart = (e) => setTouchStartY(e.targetTouches[0].clientY);
  const handleTouchEnd = (e) => {
      if (!touchStartY) return;
      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY - touchEndY;
      
      if (diff > 50) setIsSheetExpanded(true);
      else if (diff < -50) setIsSheetExpanded(false);
      
      setTouchStartY(null);
  };

  const handleTabClick = (tab) => {
      setActiveTab(tab);
      if (!isDesktop && !isSheetExpanded) setIsSheetExpanded(true);
  };

  // === DRAG & DROP LOGIC ===
  const handleDragStart = (e, index) => {
      setDraggedIdx(index);
      e.dataTransfer.effectAllowed = "move";
  };
  const handleDragEnter = (e, index) => setDragOverIdx(index);
  const handleDragEnd = () => {
      setDraggedIdx(null);
      setDragOverIdx(null);
  };
  const handleDrop = (e, dropIndex) => {
      e.preventDefault();
      if (draggedIdx === null || draggedIdx === dropIndex) {
          handleDragEnd();
          return;
      }
      reorderQueue(draggedIdx, dropIndex);
      handleDragEnd();
  };

  const handleLangToggle = () => {
      setLyricLang(prev => prev === 'EN' ? 'RO' : prev === 'RO' ? 'JP' : 'EN');
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-[100] bg-background-primary text-text-primary flex flex-col h-screen overflow-hidden transition-all duration-500 ${isDraggingPane ? 'cursor-col-resize' : ''}`}>
      
      {/* TOP NAV BAR */}
      <div className="flex justify-between items-center px-4 lg:px-6 py-3 lg:py-4 border-b border-border shrink-0 bg-background-primary z-40 shadow-md">
        
        {/* ========================================== */}
        {/* MOBILE ONLY: Minimize Button (Closes Player) */}
        {/* ========================================== */}
        <button 
            onClick={onClose} 
            className="md:hidden flex items-center gap-1.5 text-text-secondary hover:text-text-primary transition-colors text-xs font-bold uppercase tracking-widest p-2 -ml-2"
        >
           {/* Chevron pointing DOWN to imply pushing the player back to the bottom */}
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
           </svg>
           <span>Minimize</span>
        </button>

        {/* ========================================== */}
        {/* DESKTOP ONLY: Minimal View & Close Buttons */}
        {/* ========================================== */}
        <button 
            onClick={onToggle} 
            className="hidden md:flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors text-sm font-bold uppercase tracking-widest"
        >
           {/* Chevron pointing UP/LEFT for back */}
           <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
           </svg>
           <span>Minimal View</span>
        </button>

        <button 
            onClick={onClose} 
            className="hidden md:block p-2 text-text-secondary hover:text-text-primary transition-colors rounded-full hover:bg-background-hover" 
            title="Close"
        >
           {/* The 'X' Icon */}
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
           </svg>
        </button>
        
      </div>

      <div className="flex-1 flex flex-col lg:flex-row w-full h-full min-h-0 relative overflow-hidden">
        
        {/* === LEFT COLUMN: PLAYER CONTROLS === */}
        <div 
            // FIX 2: Tap anywhere in this main container to close the sheet!
            onClick={() => { if (!isDesktop && isSheetExpanded) setIsSheetExpanded(false); }}
            style={isDesktop ? { width: `${leftWidth}%` } : {}} 
            className={`w-full flex-1 lg:flex-none flex flex-col justify-center px-6 lg:px-12 py-4 pb-20 lg:pb-8 bg-background-primary z-10 transition-none lg:border-r border-border overflow-y-auto scrollbar-none ${!isDesktop && isSheetExpanded ? 'cursor-pointer' : ''}`}
        >
          <div className="w-full max-w-md mx-auto flex flex-col pointer-events-auto">
            
            <div className="hidden sm:flex flex-wrap items-center gap-2 mb-4 lg:mb-6">
                <span className="px-2 py-1 bg-background-secondary text-text-secondary text-[10px] font-bold tracking-widest rounded-sm border border-border">HIGH-RES</span>
                {song?.song_type && <span className="px-2 py-1 bg-accent-primary/20 text-accent-primary text-[10px] font-bold tracking-widest rounded-sm border border-accent-primary/30">{song.song_type}</span>}
            </div>

            <div className="w-full aspect-square rounded-2xl shadow-2xl overflow-hidden ring-1 ring-border mb-6 shrink-0 lg:mb-8 mx-auto">
              <img src={getMediaUrl(song?.cover_path)} className="w-full h-full object-cover" alt={song?.title} />
            </div>

            <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex-1 min-w-0 text-left">
                    <h1 className="text-2xl lg:text-3xl font-black truncate text-text-primary">{song?.title}</h1>
                    <p className="text-text-secondary text-base mt-1 truncate">{song?.artist}</p>
                </div>
                <div className="flex lg:hidden items-center shrink-0">
                    <OptionsMenu song={song} className="p-2 bg-background-secondary rounded-full" />
                </div>
            </div>

            <div className="mb-6 lg:mb-8 shrink-0">
                <ProgressBar variant="fullscreen" />
            </div>

            {/* --- UPGRADED PLAYBACK CONTROLS (Responsive Row) --- */}
            <div className="flex items-center justify-between w-full max-w-[90%] sm:max-w-sm mx-auto gap-2">
                
                {/* 1. MOBILE ONLY: Like Button */}
                <div className="flex lg:hidden shrink-0">
                    <LikeButton songId={song?.id} />
                </div>

                {/* 2. CORE MEDIA CONTROLLERS */}
                <div className="flex-1 flex justify-center shrink-0">
                    <MediaControllers variant="fullscreen" />
                </div>

                {/* 3. MOBILE ONLY: Global Shuffle Toggle */}
                <div className="flex lg:hidden shrink-0">
                    <button 
                        onClick={toggleShuffle} 
                        className={`p-2 transition-colors duration-300 active:scale-95 ${isShuffle ? 'text-accent-primary drop-shadow-[0_0_8px_rgba(157,92,250,0.5)]' : 'text-text-secondary hover:text-text-primary'}`}
                        title="Toggle Shuffle"
                    >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
                        </svg>
                    </button>
                </div>
            </div>

            {/* --- DESKTOP ONLY: UTILITY ACTION ROW --- */}
            <div className="hidden lg:flex items-center justify-center gap-4 mt-auto pt-8 shrink-0">
                  <LikeButton songId={song?.id} className="p-3 bg-background-secondary hover:bg-background-hover rounded-full transition-colors" />
                  
                  {/* Added Shuffle to the Desktop row so it isn't lost! */}
                  <button 
                      onClick={toggleShuffle} 
                      className={`p-3 rounded-full transition-colors duration-300 ${isShuffle ? 'bg-accent-primary/20 text-accent-primary' : 'bg-background-secondary text-text-secondary hover:bg-background-hover hover:text-text-primary'}`}
                      title="Toggle Shuffle"
                  >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
                      </svg>
                  </button>

                  <AddToPlaylistButton songId={song?.id} variant="bottom" className="p-3 bg-background-secondary hover:bg-background-hover rounded-full transition-colors" />
                  <OptionsMenu song={song} className="p-3 bg-background-secondary hover:bg-background-hover rounded-full transition-colors" />
            </div>

            <div className="hidden lg:flex items-center justify-center gap-4 mt-auto pt-8 shrink-0">
                  <LikeButton songId={song?.id} className="p-3 bg-background-secondary hover:bg-background-hover rounded-full transition-colors" />
                  <AddToPlaylistButton songId={song?.id} variant="bottom" className="p-3 bg-background-secondary hover:bg-background-hover rounded-full transition-colors" />
                  <OptionsMenu song={song} className="p-3 bg-background-secondary hover:bg-background-hover rounded-full transition-colors" />
            </div>
          </div>
        </div>

        {/* === THE DRAG RESIZER BAR (Desktop Only) === */}
        <div 
            onMouseDown={() => setIsDraggingPane(true)}
            className="hidden lg:flex w-2 bg-transparent hover:bg-accent-primary/50 cursor-col-resize z-50 transition-colors shrink-0 items-center justify-center group"
        >
            <div className="h-12 w-1 rounded-full bg-border group-hover:bg-text-secondary transition-colors"></div>
        </div>

        {/* === RIGHT / BOTTOM COLUMN: UTILITY SHEET === */}
        <div 
            className={`
                absolute lg:relative w-full lg:flex-1 h-[85vh] lg:h-full flex flex-col z-50 
                bg-background-secondary/95 lg:bg-background-secondary backdrop-blur-3xl lg:backdrop-blur-none
                rounded-t-3xl lg:rounded-none shadow-[0_-10px_40px_rgba(0,0,0,0.5)] lg:shadow-none
                border-t border-border lg:border-none transition-transform duration-500 ease-out
                ${isDesktop ? 'translate-y-0' : isSheetExpanded ? 'translate-y-[15vh]' : 'translate-y-[calc(85vh-40px)]'}
            `}
        >
            
            {/* Sheet Handle (Mobile Only) */}
            <div 
                className="w-full flex lg:hidden justify-center py-3 cursor-grab active:cursor-grabbing touch-none"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onClick={() => setIsSheetExpanded(!isSheetExpanded)}
            >
                <div className="w-12 h-1.5 rounded-full bg-border hover:bg-text-muted transition-colors" />
            </div>

            {/* Tab Header */}
            <div className="flex justify-between px-4 lg:px-8 pb-3 lg:pb-4 lg:pt-8 border-b border-border shrink-0 z-20">
                <div className="flex gap-6 lg:gap-8 w-full justify-center lg:justify-start relative">
                    <button 
                        onClick={() => handleTabClick('queue')} 
                        className={`text-xs lg:text-sm font-bold tracking-widest uppercase transition-all pb-1 border-b-2 px-2 ${activeTab === 'queue' ? 'text-text-primary border-accent-primary' : 'text-text-muted border-transparent hover:text-text-primary'}`}
                    >
                        Play Queue
                    </button>
                    <button 
                        onClick={() => handleTabClick('lyrics')} 
                        className={`text-xs lg:text-sm font-bold tracking-widest uppercase transition-all pb-1 border-b-2 px-2 ${activeTab === 'lyrics' ? 'text-text-primary border-accent-primary' : 'text-text-muted border-transparent hover:text-text-primary'}`}
                    >
                        Lyrics
                    </button>

                    {activeTab === 'lyrics' && lyrics.length > 0 && (
                        <div className="absolute right-0 top-0 bottom-0 flex items-center pr-2">
                            <button onClick={handleLangToggle} className="px-3 py-1 bg-background-primary border border-border rounded-full hover:bg-background-hover transition-all text-[10px] font-bold tracking-widest text-text-primary shadow-sm">
                                {lyricLang}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Scrollable Content Area */}
            <div className={`flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent ${!isDesktop && !isSheetExpanded ? 'pointer-events-none opacity-0' : 'pointer-events-auto opacity-100'} transition-opacity duration-300`}>
                
                <div className="px-2 md:px-4 lg:px-8 py-4 lg:py-6 pb-32 lg:pb-24">
                    
                    {activeTab === 'queue' && (
                        <div className="flex flex-col gap-1">
                            {queue.map((track, index) => {
                                const isCurrent = index === currentIndex;
                                const hasPlayed = index < currentIndex;
                                
                                return (
                                    <div 
                                        key={`${track.id}-${index}`} 
                                        draggable={isDesktop} 
                                        onDragStart={(e) => handleDragStart(e, index)}
                                        onDragEnter={(e) => handleDragEnter(e, index)}
                                        onDragEnd={handleDragEnd}
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={(e) => handleDrop(e, index)}
                                        onClick={() => playQueue(queue, index)} 
                                        className={`flex items-center gap-3 lg:gap-4 p-2 lg:p-3 rounded-lg group transition-all duration-300 ${isDesktop ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'} ${
                                            dragOverIdx === index ? 'border border-accent-primary bg-background-hover' : 
                                            isCurrent ? 'bg-background-active border border-transparent shadow-md' : 'bg-transparent border border-transparent hover:bg-background-hover'
                                        } ${hasPlayed ? 'opacity-50 hover:opacity-100' : ''}`}
                                    >
                                        <div className="w-6 flex justify-center text-[10px] lg:text-xs font-bold text-text-muted shrink-0">
                                            {isCurrent && isPlaying ? (
                                                <svg className="w-4 h-4 text-accent-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M13 5h3v14h-3V5zM6 9h3v10H6V9zm14-2h-3v12h3V7z"/></svg>
                                            ) : index + 1}
                                        </div>
                                        
                                        <img src={getMediaUrl(track?.cover_path)} className="w-10 h-10 lg:w-12 lg:h-12 rounded-md object-cover shadow-sm pointer-events-none shrink-0" alt="" />
                                        
                                        <div className="flex-1 min-w-0 pr-2">
                                            <h4 className={`text-xs lg:text-sm font-bold truncate transition-colors ${isCurrent ? 'text-accent-primary' : 'text-text-primary'}`}>{track?.title}</h4>
                                            <p className="text-[10px] lg:text-xs text-text-secondary truncate mt-0.5">{track?.artist}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {activeTab === 'lyrics' && (
                        <div className="w-full">
                            {lyrics.length > 0 ? (
                                /* FIX 1: Only render LiveLyrics when the sheet is completely expanded! 
                                   This absolutely destroys the ghost scrolling bug. */
                                (isDesktop || isSheetExpanded) ? (
                                    <LiveLyrics lyrics={lyrics} language={lyricLang} />
                                ) : null
                            ) : (
                                <div className="flex h-[300px] items-center justify-center text-text-muted text-xs lg:text-sm font-bold tracking-widest uppercase text-center px-4">
                                    No Lyrics Available
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default FullscreenUtilityView;