import React, { useState, useEffect } from 'react';
import MinimalView from './FullscreenMinimalView';
import UtilityView from './FullscreenUtilityView';

const FullscreenPlayer = ({ isOpen, onClose, song }) => {
  const [viewMode, setViewMode] = useState('minimal');

  // Logic: Body Scroll Lock
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  // Logic: Reset view on close (with a delay so it doesn't snap mid-animation!)
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setViewMode('minimal');
      }, 500); // Matches the duration of your child exit animations
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Notice we removed `if (!isOpen) return null;` so the child components 
  // actually get a chance to run their exit CSS transitions!

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