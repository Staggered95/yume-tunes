import { useState, useRef, createContext, useContext } from 'react';

const PlayerContext = createContext();

export const PlayerProvider = ({children}) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [isMuted, setIsMuted] = useState(false); 

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
        console.log(`Music is ${isPlaying ? 'Playing' : 'Paused'}`);
    }

    const volumeBeforeMute = useRef(0.5);

    const setPlayerVolume = (value) => {
        if (value > 0) {
            setIsMuted(false);
        }else {
            setIsMuted(true);
        }
        setVolume(value);
    }

    const toggleMuted = () => {
        if (isMuted) {
            setIsMuted(false);
            setVolume(volumeBeforeMute.current);
        }else {
            volumeBeforeMute.current = volume;
            setIsMuted(true);
            setVolume(0.0);
        }
    }

    const value = { isPlaying, togglePlay, volume, setPlayerVolume, isMuted, toggleMuted };

    return (
        <PlayerContext.Provider value = {value}>
            {children}
        </PlayerContext.Provider>
    )
}

export const usePlayer = () => {
    return useContext(PlayerContext);
}