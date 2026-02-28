import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { usePlayback } from "./PlaybackContext";
import { useAuth } from "./AuthContext";

const SongContext = createContext();

export const SongProvider = ({children}) => {
    //const [songs, setSongs] = useState([]);
    //const [currentSong, setCurrentSong] = useState(null);
    const [queue, setQueue] = useState([]);
    const [originalQueue, setOriginalQueue] = useState([]); // Keeps the un-shuffled backup
    const [isShuffle, setIsShuffle] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [loading, setLoading] = useState(true);
    const currentSong = queue[currentIndex] || null;

    const { authFetch } = useAuth();
    const { audioRef, isEnded, playSong } = usePlayback();

    const logTelemetry = useCallback(async (song, listenedSecs, totalSecs, skipped) => {
        if (!song || listenedSecs < 5) return; 

        try {
            // Fire and forget!
            authFetch('/user/telemetry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    songID: song.id,
                    listenedSeconds: Math.floor(listenedSecs),
                    durationSeconds: Math.floor(totalSecs),
                    wasSkipped: skipped
                })
            });
        } catch (err) {
            console.error("Telemetry failed", err);
        }
    }, [authFetch]);

    const addToQueue = useCallback((song) => {
        // Simply append the new song to both the active queue and the backup queue
        setQueue(prev => [...prev, song]);
        setOriginalQueue(prev => [...prev, song]);
        // Optional: Add a little toast notification here later!
    }, []);

    const toggleShuffle = useCallback(() => {
        setIsShuffle(prev => {
            const newShuffleState = !prev;
        
            if (newShuffleState) {
                // Turning Shuffle ON
                // Keep the current song at the top, shuffle the rest!
                const currentSongObj = queue[currentIndex];
                const remainingSongs = queue.filter((_, idx) => idx !== currentIndex);
            
                // Fisher-Yates Shuffle
                for (let i = remainingSongs.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [remainingSongs[i], remainingSongs[j]] = [remainingSongs[j], remainingSongs[i]];
                }
            
                setQueue([currentSongObj, ...remainingSongs]);
                setCurrentIndex(0); // We moved the current song to index 0
            } else {
                // Turning Shuffle OFF
                // Restore the original queue, but we need to find where our current song went!
                const currentSongObj = queue[currentIndex];
                const originalIndex = originalQueue.findIndex(s => s.id === currentSongObj?.id);
            
                if (originalQueue.length > 0) {
                    setQueue(originalQueue);
                    setCurrentIndex(originalIndex !== -1 ? originalIndex : 0);
                }
            }
        
            return newShuffleState;
        });
    }, [queue, originalQueue, currentIndex]);

    const playQueue = useCallback((newQueue, startingIndex = 0) => {
        setQueue(newQueue);
        setOriginalQueue(newQueue);
        setCurrentIndex(startingIndex);
        
        const songToPlay = newQueue[startingIndex];
        if (songToPlay) {
            const fullUrl = `http://localhost:5000${songToPlay.file_path}`;
            playSong(fullUrl);
        }
    }, [playSong]);

    const nextSong = useCallback((isManualSkip = true) => {
        if (queue.length === 0) return;
        const audioNode = audioRef.current;
        if (isManualSkip && currentSong && audioNode) {
            logTelemetry(currentSong, audioNode.currentTime, audioNode.duration, true); // true = wasSkipped
        }

        setCurrentIndex((prevIndex) => {
            const nextIdx = (prevIndex + 1) % queue.length; // Loops back to start
            const nextSongObj = queue[nextIdx];
            
            const fullUrl = `http://localhost:5000${nextSongObj.file_path}`;
            playSong(fullUrl);
            
            return nextIdx;
        });
    }, [queue, currentSong, logTelemetry, playSong]);

    const prevSong = useCallback((isManualSkip = true) => {
        if (queue.length === 0) return;
        const audioNode = audioRef.current;
        if (isManualSkip && currentSong && audioNode) {
            logTelemetry(currentSong, audioNode.currentTime, audioNode.duration, true); // true = wasSkipped
        }
        
        setCurrentIndex((prevIndex) => {
            const prevIdx = (prevIndex - 1 + queue.length) % queue.length; // Loops to end
            const prevSongObj = queue[prevIdx];
            
            const fullUrl = `http://localhost:5000${prevSongObj.file_path}`;
            playSong(fullUrl);
            
            return prevIdx;
        });
    }, [queue, currentSong, logTelemetry, playSong]);

    useEffect(() => {
        const audioNode = audioRef.current;
        if (isEnded && currentSong && audioNode) {
            // Song ended naturally. listened = duration, skipped = false
            logTelemetry(currentSong, audioNode.duration, audioNode.duration, false);
            nextSong(false);
        }
    }, [isEnded]);

    const values = useMemo(() => ({
        queue, 
        currentIndex,
        currentSong,
        isShuffle,
        loading,  
        playQueue,
        nextSong, 
        prevSong,
        toggleShuffle,
        addToQueue
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