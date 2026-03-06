import React, { useState, useEffect } from 'react';
import { usePlayback } from '../context/PlaybackContext';
import { useSongs } from '../context/SongContext';
import { parseLRC } from '../utils/lyricsParser';
import ProgressBar from '../minicomps/ProgressBar';
import LiveLyrics from '../minicomps/LiveLyrics';
import OptionsMenu from '../minicomps/OptionsMenu';
import LikeButton from '../minicomps/LikeButton';
import AddToPlaylistButton from '../minicomps/AddToPlaylistButton';
import { getMediaUrl } from '../utils/media';

const FullscreenUtilityView = ({ isOpen, onClose, onToggle, song }) => {
  const { isPlaying, togglePlay } = usePlayback();
  const { nextSong, prevSong, queue, currentIndex, playQueue, reorderQueue } = useSongs(); 
  
  const [activeTab, setActiveTab] = useState('queue'); 
  const [lyricLang, setLyricLang] = useState('EN');
  const [lyrics, setLyrics] = useState([]);
  
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  // === RESPONSIVE STATE ===
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [leftWidth, setLeftWidth] = useState(40); 
  const [isDraggingPane, setIsDraggingPane] = useState(false);
  
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

  // === RESIZER LOGIC (Desktop Only) ===
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
    // ROOT WRAPPER: Fixed to screen, prevents entire page from scrolling
    <div className={`fixed inset-0 z-[100] bg-background-primary text-text-primary flex flex-col h-screen overflow-hidden transition-all duration-500 ${isDraggingPane ? 'cursor-col-resize' : ''}`}>
      
      {/* TOP NAV BAR */}
      <div className="flex justify-between items-center px-4 lg:px-6 py-3 lg:py-4 border-b border-border shrink-0 bg-background-primary z-40 shadow-md">
        <button onClick={onToggle} className="flex items-center gap-1 lg:gap-2 text-text-secondary hover:text-text-primary transition-colors text-xs lg:text-sm font-bold uppercase tracking-widest">
           <svg className="w-4 h-4 lg:w-5 lg:h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
           <span className="hidden sm:inline">Minimal View</span>
           <span className="sm:hidden">Minimize</span>
        </button>
        <button onClick={onClose} className="p-2 text-text-secondary hover:text-text-primary transition-colors rounded-full hover:bg-background-hover" title="Close">
           <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      {/* MAIN LAYOUT: Stacks vertically on mobile (flex-col), side-by-side on desktop (lg:flex-row) */}
      <div className="flex-1 flex flex-col lg:flex-row w-full h-full min-h-0 overflow-hidden">
        
        {/* === LEFT/TOP COLUMN: PLAYER CONTROLS === */}
        <div 
            style={isDesktop ? { width: `${leftWidth}%` } : {}} 
            // MOBILE: Takes up exactly enough height for its content (shrink-0), adds subtle shadow to separate from queue
            // DESKTOP: Takes up full height (h-full), allows scrolling if needed
            className="w-full shrink-0 flex flex-col px-4 md:px-8 lg:px-12 py-4 md:py-6 lg:py-8 bg-background-primary z-30 relative transition-none border-b lg:border-b-0 lg:border-r border-border shadow-[0_10px_30px_rgba(0,0,0,0.1)] lg:shadow-none"
        >
          
          {/* BADGES (Hidden on very small screens to save space) */}
          <div className="hidden sm:flex flex-wrap items-center gap-2 mb-4 lg:mb-6">
              <span className="px-2 py-1 bg-background-secondary text-text-secondary text-[9px] lg:text-[10px] font-bold tracking-widest rounded-sm border border-border shrink-0">
                  HIGH-RES
              </span>
              {song?.song_type && (
                  <span className="px-2 py-1 bg-accent-primary/20 text-accent-primary text-[9px] lg:text-[10px] font-bold tracking-widest rounded-sm border border-accent-primary/30 shrink-0">
                      {song.song_type}
                  </span>
              )}
          </div>

          {/* ALBUM ART + TRACK INFO (Row on mobile, Stacked on desktop) */}
          <div className="flex flex-row lg:flex-col items-center gap-4 lg:gap-0 mb-4 lg:mb-8 shrink-0">
              
              {/* Art: Much smaller on mobile! */}
              <div className="w-16 h-16 sm:w-24 sm:h-24 lg:w-full lg:max-w-[320px] aspect-square rounded-xl shadow-xl overflow-hidden ring-1 ring-border shrink-0 lg:mb-8">
                <img src={getMediaUrl(song?.cover_path)} className="w-full h-full object-cover" alt={song?.title} />
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-center text-left lg:w-full">
                  <h1 className="text-lg sm:text-xl lg:text-3xl font-black truncate text-text-primary">{song?.title}</h1>
                  <p className="text-text-secondary text-xs sm:text-sm lg:text-base mt-0.5 lg:mt-1 truncate">{song?.artist}</p>
              </div>

              {/* Mobile Only: Options Menu inline with title */}
              <div className="lg:hidden flex shrink-0">
                  <OptionsMenu song={song} className="p-1" />
              </div>
          </div>

          <div className="mb-4 lg:mb-8 shrink-0">
              <ProgressBar variant="fullscreen" />
          </div>

          {/* PLAYBACK CONTROLS */}
          <div className="flex items-center justify-between px-2 lg:mb-8 shrink-0">
            <button onClick={() => setIsShuffle(!isShuffle)} className={`p-2 transition-colors hidden sm:block ${isShuffle ? 'text-accent-primary' : 'text-text-muted hover:text-text-primary'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            </button>
            
            <button onClick={prevSong} className="p-2 text-text-primary transition-all hover:scale-110 active:scale-95">
                <svg viewBox="0 0 24 24" className="w-8 h-8 fill-currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
            </button>
            
            <button onClick={togglePlay} className="p-3 lg:p-5 bg-text-primary text-background-primary rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl shadow-text-primary/10">
                {isPlaying ? <svg className="w-8 h-8 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg> : <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>}
            </button>
            
            <button onClick={nextSong} className="p-2 text-text-primary transition-all hover:scale-110 active:scale-95">
                <svg viewBox="0 0 24 24" className="w-8 h-8 fill-currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
            </button>
            
            <button onClick={() => setIsRepeat(!isRepeat)} className={`p-2 transition-colors hidden sm:block ${isRepeat ? 'text-accent-primary' : 'text-text-muted hover:text-text-primary'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            </button>
          </div>

          {/* Desktop Only: Bottom Quick Actions */}
          <div className="hidden lg:flex items-center justify-center gap-4 mt-auto pt-8 shrink-0">
                <LikeButton songId={song?.id} className="p-3 bg-background-secondary hover:bg-background-hover rounded-full transition-colors" />
                <AddToPlaylistButton songId={song?.id} variant="bottom" className="p-3 bg-background-secondary hover:bg-background-hover rounded-full transition-colors" />
                <OptionsMenu song={song} className="p-3 bg-background-secondary hover:bg-background-hover rounded-full transition-colors" />
          </div>
          
        </div>

        {/* === THE DRAG RESIZER BAR (Desktop Only) === */}
        <div 
            onMouseDown={() => setIsDraggingPane(true)}
            className="hidden lg:flex w-2 bg-transparent hover:bg-accent-primary/50 cursor-col-resize z-50 transition-colors shrink-0 items-center justify-center group"
        >
            <div className="h-12 w-1 rounded-full bg-border group-hover:bg-text-secondary transition-colors"></div>
        </div>

        {/* === RIGHT/BOTTOM COLUMN: UTILITY TABS === */}
        {/* min-h-0 is crucial here: it tells flexbox that this container CAN shrink, allowing inner scroll */}
        <div className="flex-1 w-full min-h-0 flex flex-col bg-background-secondary relative z-10">
            
            {/* Tab Header */}
            <div className="flex justify-between px-4 lg:px-8 pt-4 lg:pt-8 pb-3 lg:pb-4 border-b border-border shrink-0 bg-background-secondary/95 backdrop-blur-md z-20 shadow-sm">
                <div className="flex gap-6 lg:gap-8 w-full justify-center lg:justify-start relative">
                    <button 
                        onClick={() => setActiveTab('queue')} 
                        className={`text-xs lg:text-sm font-bold tracking-widest uppercase transition-all pb-1 border-b-2 px-2 ${activeTab === 'queue' ? 'text-text-primary border-accent-primary' : 'text-text-muted border-transparent hover:text-text-primary'}`}
                    >
                        Play Queue
                    </button>
                    <button 
                        onClick={() => setActiveTab('lyrics')} 
                        className={`text-xs lg:text-sm font-bold tracking-widest uppercase transition-all pb-1 border-b-2 px-2 ${activeTab === 'lyrics' ? 'text-text-primary border-accent-primary' : 'text-text-muted border-transparent hover:text-text-primary'}`}
                    >
                        Lyrics
                    </button>

                    {/* Lyric Lang Toggle (Absolute positioned to the right so it doesn't break centering) */}
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
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                
                <div className="px-2 md:px-4 lg:px-8 py-4 lg:py-6 pb-24">
                    {/* QUEUE TAB */}
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

                    {/* LYRICS TAB */}
                    {activeTab === 'lyrics' && (
                        <div className="w-full">
                            {lyrics.length > 0 ? (
                                <LiveLyrics lyrics={lyrics} language={lyricLang} />
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