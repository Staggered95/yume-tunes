import React, { useState, useEffect } from 'react';
import { usePlayback } from '../context/PlaybackContext';
import { useSongs } from '../context/SongContext';
import { parseLRC } from '../utils/lyricsParser';
import ProgressBar from '../minicomps/ProgressBar';
import LiveLyrics from '../minicomps/LiveLyrics';
import OptionsMenu from '../minicomps/OptionsMenu';
import LikeButton from '../minicomps/LikeButton';
import AddToPlaylistButton from '../minicomps/AddToPlaylistButton';

const FullscreenUtilityView = ({ isOpen, onClose, onToggle, song }) => {
  const { isPlaying, togglePlay } = usePlayback();
  const { nextSong, prevSong, queue, currentIndex, playQueue, reorderQueue } = useSongs(); 
  
  const [activeTab, setActiveTab] = useState('queue'); 
  const [lyricLang, setLyricLang] = useState('EN');
  const [lyrics, setLyrics] = useState([]);
  const [volume, setVolume] = useState(80); 

  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  // === RESPONSIVE STATE ===
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  // === RESIZABLE PANE STATE ===
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
    <div className={`fixed inset-0 z-[100] bg-[#0a0a0a] text-white flex flex-col h-screen overflow-hidden transition-all duration-500 ${isDraggingPane ? 'cursor-col-resize' : ''}`}>
      
      {/* TOP NAV BAR */}
      <div className="flex justify-between items-center px-4 lg:px-6 py-3 lg:py-4 border-b border-white/5 shrink-0 bg-[#0a0a0a] z-40 shadow-md">
        <button onClick={onToggle} className="flex items-center gap-1 lg:gap-2 text-white/50 hover:text-white transition-colors text-xs lg:text-sm font-bold uppercase tracking-widest">
           <svg className="w-4 h-4 lg:w-5 lg:h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
           <span className="hidden sm:inline">Minimal View</span>
           <span className="sm:hidden">Back</span>
        </button>
        <button onClick={onClose} className="p-2 text-white/50 hover:text-white transition-colors rounded-full hover:bg-white/10" title="Close">
           <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      {/* MAIN LAYOUT */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden w-full h-full">
        
        {/* === LEFT/TOP COLUMN: PLAYER CONTROLS === */}
        <div 
            style={isDesktop ? { width: `${leftWidth}%` } : {}} 
            // FIX: Changed from h-[50vh] overflow-y-auto to h-auto lg:h-full lg:overflow-y-auto
            className="w-full shrink-0 flex flex-col px-6 lg:px-12 py-6 lg:py-8 bg-[#0a0a0a] z-30 lg:overflow-y-auto scrollbar-none h-auto lg:h-full relative transition-none border-b lg:border-b-0 lg:border-r border-white/5"
        >
          
          <div className="flex flex-wrap items-center gap-2 mb-4 lg:mb-6">
              <span className="hidden sm:inline px-2 py-1 bg-white/10 text-white/70 text-[9px] lg:text-[10px] font-bold tracking-widest rounded-sm border border-white/10 shrink-0">
                  HIGH-RES LOSSLESS
              </span>
              {song?.song_type && (
                  <span className="px-2 py-1 bg-accent-primary/20 text-accent-primary text-[9px] lg:text-[10px] font-bold tracking-widest rounded-sm border border-accent-primary/30 shrink-0">
                      {song.song_type}
                  </span>
              )}
              {song?.genre && (
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-[9px] lg:text-[10px] font-bold tracking-widest rounded-sm border border-purple-500/30 shrink-0">
                      {song.genre}
                  </span>
              )}
              <span className="text-white/30 text-[10px] lg:text-xs font-bold tracking-widest uppercase ml-auto truncate">{song?.anime || "Single"}</span>
          </div>

          <div className="w-full max-w-[200px] sm:max-w-[250px] lg:max-w-none aspect-square mx-auto lg:mx-0 rounded-xl shadow-2xl overflow-hidden mb-6 lg:mb-8 ring-1 ring-white/10 shrink-0">
            <img src={song?.cover_path?.startsWith('http') ? song.cover_path : `http://localhost:5000${song?.cover_path}`} className="w-full h-full object-cover" alt={song?.title} />
          </div>

          <div className="flex items-start justify-between gap-4 mb-4 lg:mb-6 shrink-0">
            <div className="flex-1 min-w-0 text-center lg:text-left">
                <h1 className="text-xl lg:text-3xl font-bold truncate">{song?.title}</h1>
                <p className="text-white/50 text-sm lg:text-base mt-1 truncate">{song?.artist}</p>
            </div>
            <div className="hidden lg:flex items-center gap-2 shrink-0 mt-1 relative">
                <LikeButton songId={song?.id} className="p-2 hover:bg-white/5 rounded-full" />
                <AddToPlaylistButton songId={song?.id} variant="bottom" className="p-2 hover:bg-white/5 rounded-full" />
                <OptionsMenu song={song} className="p-2 hover:bg-white/5 rounded-full" />
            </div>
          </div>

          <div className="mb-6 lg:mb-8 shrink-0"><ProgressBar variant="fullscreen" /></div>

          <div className="flex items-center justify-between px-2 mb-6 lg:mb-8 shrink-0">
            <button onClick={() => setIsShuffle(!isShuffle)} className={`p-2 transition-colors hidden sm:block ${isShuffle ? 'text-accent-primary' : 'text-white/40 hover:text-white'}`}>
                <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/></svg>
            </button>
            <button onClick={prevSong} className="p-2 text-white/70 hover:text-white transition-all hover:scale-110 active:scale-95">
                <svg viewBox="0 0 24 24" className="w-6 h-6 lg:w-8 lg:h-8 fill-currentColor"><rect x="5" y="5" width="2" height="14" rx="1" /><path d="M19 7 Q19 6 18 6 L10 11 Q9 12 10 13 L18 18 Q19 18 19 17 Z" /></svg>
            </button>
            <button onClick={togglePlay} className="p-4 lg:p-5 bg-white text-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl">
                {isPlaying ? <svg className="w-6 h-6 lg:w-8 lg:h-8 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg> : <svg className="w-6 h-6 lg:w-8 lg:h-8 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>}
            </button>
            <button onClick={nextSong} className="p-2 text-white/70 hover:text-white transition-all hover:scale-110 active:scale-95">
                <svg viewBox="0 0 24 24" className="w-6 h-6 lg:w-8 lg:h-8 fill-currentColor"><rect x="17" y="5" width="2" height="14" rx="1" /><path d="M5 7 Q5 6 6 6 L14 11 Q15 12 14 13 L6 18 Q5 18 5 17Z" /></svg>
            </button>
            <button onClick={() => setIsRepeat(!isRepeat)} className={`p-2 transition-colors hidden sm:block ${isRepeat ? 'text-accent-primary' : 'text-white/40 hover:text-white'}`}>
                <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-4 px-4 py-4 bg-white/5 rounded-lg border border-white/5 mt-auto mb-4 shrink-0">
              <svg className="w-5 h-5 text-white/50 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>
              <input type="range" min="0" max="100" value={volume} onChange={(e) => setVolume(e.target.value)} className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white" />
          </div>
        </div>

        {/* === THE DRAG RESIZER BAR === */}
        <div 
            onMouseDown={() => setIsDraggingPane(true)}
            className="hidden lg:flex w-1 md:w-2 bg-transparent hover:bg-accent-primary/50 cursor-col-resize z-50 transition-colors shrink-0 items-center justify-center group"
        >
            <div className="h-12 w-1 rounded-full bg-white/20 group-hover:bg-white/80 transition-colors"></div>
        </div>

        {/* === RIGHT/BOTTOM COLUMN: UTILITY TABS === */}
        <div className="w-full flex-1 flex flex-col bg-[#0f0f0f] relative overflow-y-auto lg:h-full z-10 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            
            <div className="flex items-center justify-between px-4 lg:px-8 pt-4 lg:pt-8 pb-3 lg:pb-4 border-b border-white/5 sticky top-0 bg-[#0f0f0f]/95 backdrop-blur-md z-20">
                <div className="flex gap-4 lg:gap-8">
                    <button onClick={() => setActiveTab('queue')} className={`text-xs lg:text-sm font-bold tracking-widest uppercase transition-colors pb-1 border-b-2 ${activeTab === 'queue' ? 'text-white border-accent-primary' : 'text-white/40 border-transparent hover:text-white'}`}>Play Queue</button>
                    <button onClick={() => setActiveTab('lyrics')} className={`text-xs lg:text-sm font-bold tracking-widest uppercase transition-colors pb-1 border-b-2 ${activeTab === 'lyrics' ? 'text-white border-accent-primary' : 'text-white/40 border-transparent hover:text-white'}`}>Lyrics</button>
                </div>
                <div className="flex items-center gap-2 lg:gap-3">
                    {activeTab === 'lyrics' && lyrics.length > 0 && (
                        <button onClick={handleLangToggle} className="flex items-center justify-center px-2 py-1 lg:px-3 lg:py-1.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all text-[10px] lg:text-xs font-bold tracking-widest">{lyricLang}</button>
                    )}
                </div>
            </div>

            <div className="px-4 lg:px-8 py-4 lg:py-6 pb-24">
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
                                    className={`flex items-center gap-3 lg:gap-4 p-2 lg:p-3 rounded-lg group transition-all ${isDesktop ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'} border ${
                                        dragOverIdx === index ? 'border-t-2 border-t-accent-primary bg-white/5' : 
                                        isCurrent ? 'bg-white/10 border-transparent shadow-lg' : 'bg-transparent border-transparent hover:bg-white/5'
                                    } ${hasPlayed ? 'opacity-50 hover:opacity-100' : ''}`}
                                >
                                    <div className="hidden lg:flex w-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center text-white/30 hover:text-white">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm12-12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/></svg>
                                    </div>

                                    <div className="w-4 lg:w-6 flex justify-center text-[10px] lg:text-xs font-medium text-white/40 group-hover:text-white shrink-0">
                                        {isCurrent && isPlaying ? (
                                            <svg className="w-3 h-3 lg:w-4 lg:h-4 text-accent-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M13 5h3v14h-3V5zM6 9h3v10H6V9zm14-2h-3v12h3V7z"/></svg>
                                        ) : (
                                            index + 1
                                        )}
                                    </div>
                                    
                                    <img src={track?.cover_path?.startsWith('http') ? track.cover_path : `http://localhost:5000${track?.cover_path}`} className="w-10 h-10 lg:w-12 lg:h-12 rounded-md object-cover shadow-md pointer-events-none shrink-0" alt="" />
                                    
                                    <div className="flex-1 min-w-0">
                                        <h4 className={`text-xs lg:text-sm font-bold truncate ${isCurrent ? 'text-accent-primary' : 'text-white/90 group-hover:text-white'}`}>{track?.title}</h4>
                                        <p className="text-[10px] lg:text-xs text-white/50 truncate">{track?.artist}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {activeTab === 'lyrics' && (
                    <div className="w-full min-h-[500px]">
                        {lyrics.length > 0 ? (
                            <LiveLyrics lyrics={lyrics} language={lyricLang} />
                        ) : (
                            <div className="flex h-full items-center justify-center text-white/20 text-sm lg:text-lg font-bold tracking-widest uppercase mt-10 lg:mt-20 text-center px-4">No Lyrics Available</div>
                        )}
                    </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default FullscreenUtilityView;