// src/components/MorphingPlayPause.jsx

import { motion } from 'framer-motion';

const MorphingPlayPause = ({ isPlaying, onToggle }) => {
  // NEW: Compatible SVG path data
  const playPath = "M 7 5 L 7 19 L 19 12 Z M 7 5 L 7 19 L 19 12 Z";
  const pausePath = "M 6 5 L 10 5 L 10 19 L 6 19 Z M 14 5 L 18 5 L 18 19 L 14 19 Z";

  return (
    <button 
      onClick={onToggle} 
      className="h-9 w-9 md:h-10 md:w-10 text-text hover:text-accent transition-colors flex justify-center items-center"
      aria-label='Play/Pause'
    >
      <svg width="24" height="24" viewBox="0 0 24 24">
        <motion.path
          fill="currentColor"
          // This animate logic remains the same
          animate={{ d: isPlaying ? pausePath : playPath }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        />
      </svg>
    </button>
  );
};

export default MorphingPlayPause;