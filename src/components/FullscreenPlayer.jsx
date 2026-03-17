import React, { useState, useEffect } from 'react';
import MinimalView from './FullscreenMinimalView';
import UtilityView from './FullscreenUtilityView';

const FullscreenPlayer = ({ isOpen, onClose, song }) => {
  const getDefaultView = () => typeof window !== 'undefined' && window.innerWidth < 768 ? 'utility' : 'minimal';

  const [viewMode, setViewMode] = useState(getDefaultView());

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setViewMode(getDefaultView());
      }, 500); 
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