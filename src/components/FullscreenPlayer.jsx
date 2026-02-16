import React, { useState, useEffect } from 'react';
import MinimalView from './FullscreenMinimalView';
import UtilityView from './FullscreenUtilityView'; // Ensure this path is 100% correct

const FullscreenPlayer = ({ isOpen, onClose, song }) => {
  const [viewMode, setViewMode] = useState('minimal');

  // Logic: Body Scroll Lock
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  // Logic: Reset view on close
  useEffect(() => {
    if (!isOpen) setViewMode('minimal');
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#050505] overflow-hidden">
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
          onClose={onClose} 
          onToggle={() => setViewMode('minimal')} 
        />
      )}
    </div>
  );
};

export default FullscreenPlayer;