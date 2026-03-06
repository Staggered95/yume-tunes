import React, { useState, useEffect } from 'react';
import MinimalView from './FullscreenMinimalView';
import UtilityView from './FullscreenUtilityView';

const FullscreenPlayer = ({ isOpen, onClose, song }) => {
  // NEW: Helper function to determine the right view based on device screen size
  // If screen width is less than 768px (mobile), default to 'utility'. Otherwise, 'minimal'.
  const getDefaultView = () => typeof window !== 'undefined' && window.innerWidth < 768 ? 'utility' : 'minimal';

  // Set the initial state using our smart helper
  const [viewMode, setViewMode] = useState(getDefaultView());

  // Logic: Body Scroll Lock
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  // Logic: Reset view on close
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        // CHANGED: Instead of always resetting to 'minimal', we ask our helper 
        // what the default should be right now in case they rotated their device!
        setViewMode(getDefaultView());
      }, 500); // Matches the duration of your child exit animations
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <div 
        className={`fixed inset-0 z-[100] bg-background-primary overflow-hidden transition-all duration-500 ${
            isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none delay-200'
        }`}
    >
      {viewMode === 'minimal' ? (
        <MinimalView 
          song={song} 
          isOpen={isOpen}
          onClose={onClose} 
          // Toggle flips it to the opposite of what is currently showing
          onToggle={() => setViewMode('utility')} 
        />
      ) : (
        <UtilityView 
          song={song} 
          isOpen={isOpen}
          onClose={onClose} 
          onToggle={() => setViewMode('minimal')} 
        />
      )}
    </div>
  );
};

export default FullscreenPlayer;