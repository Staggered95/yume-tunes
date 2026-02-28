import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { usePlayback } from "./PlaybackContext";

const SongContext = createContext();

export const SongProvider = ({children}) => {
    //const [songs, setSongs] = useState([]);
    //const [currentSong, setCurrentSong] = useState(null);
    const [queue, setQueue] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [loading, setLoading] = useState(true);
    const currentSong = queue[currentIndex] || null;

    const { isEnded, playSong } = usePlayback();

    const playQueue = useCallback((newQueue, startingIndex = 0) => {
        setQueue(newQueue);
        setCurrentIndex(startingIndex);
        
        const songToPlay = newQueue[startingIndex];
        if (songToPlay) {
            const fullUrl = `http://localhost:5000${songToPlay.file_path}`;
            playSong(fullUrl);
        }
    }, [playSong]);

    const nextSong = useCallback(() => {
        if (queue.length === 0) return;
        
        setCurrentIndex((prevIndex) => {
            const nextIdx = (prevIndex + 1) % queue.length; // Loops back to start
            const nextSongObj = queue[nextIdx];
            
            const fullUrl = `http://localhost:5000${nextSongObj.file_path}`;
            playSong(fullUrl);
            
            return nextIdx;
        });
    }, [queue, playSong]);

    const prevSong = useCallback(() => {
        if (queue.length === 0) return;
        
        setCurrentIndex((prevIndex) => {
            const prevIdx = (prevIndex - 1 + queue.length) % queue.length; // Loops to end
            const prevSongObj = queue[prevIdx];
            
            const fullUrl = `http://localhost:5000${prevSongObj.file_path}`;
            playSong(fullUrl);
            
            return prevIdx;
        });
    }, [queue, playSong]);

    useEffect(() => {
        if (isEnded) {
            nextSong();
        }
    }, [isEnded, nextSong]);

    const values = useMemo(() => ({
        queue, 
        currentIndex,
        currentSong,
        loading,  
        playQueue,
        nextSong, 
        prevSong
    }), [queue, currentIndex, currentSong, playQueue, nextSong, prevSong]);

    return (
        <SongContext.Provider value={values}>
            {children}
        </SongContext.Provider>
    );
};

export const useSongs = () => {
    const context = useContext(SongContext);
    if (!context) {
        throw new Error("useSongs must be within a SongProvider");
    }
    return context;
}