import React, { useState, useEffect } from 'react';
import { usePlayback } from '../context/PlaybackContext';

const UtilityView = ({ song, onToggle, onClose, lyricsMode, setLyricsMode }) => {
  const { 
    isPlaying, 
    togglePlay, 
    volume, 
    handleVolumeChange,
    // Note: Assuming you add these to your context eventually
    // For now, we'll use local state to demonstrate functionality
  } = usePlayback();

  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // off, all, one
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // Function to cycle repeat modes
  const cycleRepeat = () => {
    const modes = ['off', 'all', 'one'];
    const nextIndex = (modes.indexOf(repeatMode) + 1) % modes.length;
    setRepeatMode(modes[nextIndex]);
  };

  return (
    <div className="w-full h-full bg-[#080808] flex flex-col p-4 md:p-10 text-white overflow-hidden animate-in fade-in duration-300">
      
      {/* --- HEADER --- */}
      <div className="flex justify-between items-center mb-8 shrink-0">
        <div className="flex items-center gap-6">
          <button 
            onClick={onToggle}
            className="group flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all"
          >
            <span className="text-white/40 group-hover:text-white transition-colors">←</span>
            <span className="text-xs font-bold uppercase tracking-widest">Back to Zen</span>
          </button>
          
          <div className="hidden md:flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-tighter">
              Engine Status: {isPlaying ? 'Streaming' : 'Idle'}
            </span>
          </div>
        </div>
        
        <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-full transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* --- MAIN GRID --- */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 overflow-hidden">
        
        {/* LEFT: Metadata & Static Buttons (3 Cols) */}
        <div className="lg:col-span-3 space-y-6 overflow-y-auto pr-2">
          <img 
            src={`http://localhost:5000${song?.cover_path}`} 
            className="w-full aspect-square object-cover rounded-2xl shadow-2xl border border-white/5" 
            alt="Cover" 
          />
          
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tighter truncate">{song?.title}</h1>
            <p className="text-lg text-white/50 font-medium truncate">{song?.artist}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="flex flex-col items-center justify-center gap-2 p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all opacity-50 cursor-not-allowed group">
              <span className="text-xl group-hover:scale-110 transition-transform">❤</span>
              <span className="text-[10px] font-bold uppercase">Favorite</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-2 p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all opacity-50 cursor-not-allowed group">
              <span className="text-xl group-hover:scale-110 transition-transform">+</span>
              <span className="text-[10px] font-bold uppercase">Playlist</span>
            </button>
          </div>
        </div>

        {/* CENTER: Queue Visualization (6 Cols) */}
        <div className="lg:col-span-6 flex flex-col bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white/30">Up Next</h2>
            <span className="text-[10px] font-mono text-accent-primary underline cursor-pointer">Edit Queue</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-none">
            {/* Functional-ish Queue Items */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-xl group transition-all cursor-pointer">
                <span className="text-xs font-mono text-white/20">{i}</span>
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center text-xs text-white/20 font-bold">LRC</div>
                <div className="flex-1">
                  <p className="text-sm font-bold">Upcoming Track Name</p>
                  <p className="text-[10px] text-white/40 uppercase">Queue Artist</p>
                </div>
                <button className="opacity-0 group-hover:opacity-100 p-2 bg-white text-black rounded-full transition-all">▶</button>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Toggles (3 Cols) */}
        <div className="lg:col-span-3 space-y-8 overflow-y-auto">
          
          {/* Lyrics Selector */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 px-2">Lyrics Mode</h3>
            <div className="grid grid-cols-1 gap-2 p-2 bg-white/5 rounded-2xl border border-white/5">
              {['Japanese', 'Romaji', 'English', 'Off'].map((mode) => (
                <button 
                  key={mode} 
                  onClick={() => setLyricsMode(mode)}
                  className={`px-4 py-3 text-left text-xs font-bold rounded-xl transition-all ${
                    lyricsMode === mode ? 'bg-white text-black' : 'hover:bg-white/10 text-white/40'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </section>

          {/* Config: Speed, Shuffle, Repeat */}
          <section className="space-y-6 px-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Playback Config</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-bold text-white/60 uppercase">Speed</span>
                <span className="text-sm font-mono text-accent-primary">${playbackSpeed}x</span>
              </div>
              <input 
                type="range" min="0.5" max="2" step="0.25"
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                className="w-full accent-white" 
              />
            </div>

            <div className="flex gap-4">
               <button 
                onClick={() => setIsShuffle(!isShuffle)}
                className={`flex-1 py-4 rounded-2xl border transition-all text-xl ${isShuffle ? 'bg-accent-primary border-accent-primary text-black' : 'bg-white/5 border-white/10 text-white/40'}`}
               >
                 🔀
               </button>
               <button 
                onClick={cycleRepeat}
                className={`flex-1 py-4 rounded-2xl border transition-all relative flex flex-col items-center justify-center ${repeatMode !== 'off' ? 'bg-white border-white text-black' : 'bg-white/5 border-white/10 text-white/40'}`}
               >
                 <span className="text-xl">🔁</span>
                 {repeatMode === 'one' && <span className="absolute text-[8px] font-bold top-2 right-4">1</span>}
               </button>
            </div>
          </section>

          {/* Volume Redundancy */}
          <section className="space-y-4 px-2">
            <div className="flex justify-between text-[10px] font-bold text-white/30 uppercase">
              <span>Output Volume</span>
              <span>{Math.round(volume * 100)}%</span>
            </div>
            <input 
              type="range" min="0" max="1" step="0.01"
              value={volume}
              onChange={(e) => handleVolumeChange(e.target.value)}
              className="w-full accent-accent-primary"
            />
          </section>

        </div>
      </div>
    </div>
  );
};

export default UtilityView;