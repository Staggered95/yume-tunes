import { usePlayback } from '../context/PlaybackContext';

export default function ProgressBar() {
  const { currentTime, duration, handleSeek } = usePlayback();

  // Utility to format seconds into MM:SS
  const formatTime = (time) => {
    if (!time) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const progress = (currentTime / duration) * 100 || 0;

  return (
    <div className="flex items-center gap-2 w-full max-w-md">
      <span className="text-xs text-zinc-400">{formatTime(currentTime)}</span>
      
      <div className="relative w-full h-1 group cursor-pointer">
        {/* The Actual Input (Invisible but handles logic) */}
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={(e) => handleSeek(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
        />
        {/* The Track (Visual) */}
        <div className="absolute inset-0 bg-zinc-600 rounded-full"></div>
        {/* The Progress (Visual) */}
        <div 
          className="absolute inset-0 bg-white rounded-full transition-all"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <span className="text-xs text-zinc-400">{formatTime(duration)}</span>
    </div>
  );
}