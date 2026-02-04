import React from 'react';
import { usePlayback } from '../context/PlaybackContext';

const MuteIcon = () => <svg className="text-text-muted" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4L7 9H3V15H7L12 20V4ZM16.59 12L14 9.41L15.41 8L18 10.59L20.59 8L22 9.41L19.41 12L22 14.59L20.59 16L18 13.41L15.41 16L14 14.59L16.59 12Z"/></svg>;
const LowVolumeIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9H7L12 4V20L7 15H3V9M14.5 12C14.5 10.23 13.48 8.71 12 7.93V16.07C13.48 15.29 14.5 13.77 14.5 12Z"/></svg>;
const MediumVolumeIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9H7L12 4V20L7 15H3V9M12 7.93V16.07C13.48 15.29 14.5 13.77 14.5 12C14.5 10.23 13.48 8.71 12 7.93M17 12C17 14.82 15.17 17.22 12.75 18.23V5.77C15.17 6.78 17 9.18 17 12Z"/></svg>;
const HighVolumeIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9H7L12 4V20L7 15H3V9M14.5 12C14.5 10.23 13.48 8.71 12 7.93V16.07C13.48 15.29 14.5 13.77 14.5 12M19.5 12C19.5 15.85 16.59 18.96 13 19.92V4.08C16.59 5.04 19.5 8.15 19.5 12Z"/></svg>;

const VolumeIcon = () => {
    const { volume } = usePlayback();

    // Logic for icon swapping
    if (volume === 0) return <MuteIcon />;
    if (volume < 0.33) return <LowVolumeIcon />;
    if (volume < 0.67) return <MediumVolumeIcon />;
    return <HighVolumeIcon />;
};

export default VolumeIcon;