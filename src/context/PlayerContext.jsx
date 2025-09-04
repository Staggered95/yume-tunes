import { useState, createContext, useContext } from 'react';

const PlayerContext = createContext();

export const PlayerProvider = ({children}) => {
    const [isPlaying, setIsPlaying] = useState();
    
    const togglePlay = () => {
        setIsPlaying(!isPlaying);
        console.log(`Music is ${isPlaying ? 'Playing' : 'Paused'}`);
    }

    const value = { isPlaying, togglePlay };

    return (
        <PlayerContext.Provider value = {value}>
            {children}
        </PlayerContext.Provider>
    )
}

export const usePlayer = () => {
    return useContext(PlayerContext);
}