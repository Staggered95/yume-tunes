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
    const { audioRef, isEnded, playSong, togglePlay } = usePlayback();

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

    const addToQueue = (song) => {
    // If nothing is playing, just start playing it!
    if (queue.length === 0) {
      playQueue([song], 0);
      return;
    }

    setQueue(prevQueue => {
      // Check if it's already in the queue to prevent duplicates (optional)
      const isDuplicate = prevQueue.some(s => s.id === song.id);
      if (isDuplicate) return prevQueue;

      return [...prevQueue, song];
    });

    setOriginalQueue(prevQueue => {
      // Check if it's already in the queue to prevent duplicates (optional)
      const isDuplicate = prevQueue.some(s => s.id === song.id);
      if (isDuplicate) return prevQueue;

      return [...prevQueue, song];
    });
  };

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

    const playNextInQueue = (song) => {
        if (queue.length === 0) {
            playQueue([song], 0);
            return;
        }

        // We use the current state directly to calculate both accurately
        let newQueue = [...queue];
        let newIndex = currentIndex;

        // 1. Find if the song is already in the queue
        const existingIndex = newQueue.findIndex(s => s.id === song.id);

        if (existingIndex !== -1) {
            // If they clicked "Play Next" on the song that is currently playing, ignore it
            if (existingIndex === currentIndex) return; 
            
            // Remove it from its old position
            newQueue.splice(existingIndex, 1);
            
            // CRITICAL FIX: If we removed a song from BEFORE the currently playing song,
            // the whole array shifted left. We must shift our index left to keep holding the right song!
            if (existingIndex < currentIndex) {
                newIndex--;
            }
        }

        // 2. Insert the song exactly one slot after the (potentially updated) playing index
        newQueue.splice(newIndex + 1, 0, song);

        // 3. Update both states at the exact same time
        setQueue(newQueue);
        if (newIndex !== currentIndex) {
            setCurrentIndex(newIndex); // Make sure you have access to setCurrentIndex here!
        }
    };
    

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
        addToQueue,
        playNextInQueue
    }), [queue, currentIndex, currentSong, playQueue, nextSong, prevSong]);

    // Add this inside your context or player component
  useEffect(() => {
    // 1. Check if the browser actually supports the Media Session API
    if ('mediaSession' in navigator && currentSong) {
      
      // 2. Tell the OS what song is playing (Updates the Lock Screen / Media Hub)
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentSong.title,
        artist: currentSong.artist,
        album: currentSong.anime || 'YumeTunes',
        artwork: [
          // Make sure this path resolves correctly to your backend image!
          { src: `http://localhost:5000${currentSong.cover_path}`, sizes: '512x512', type: 'image/jpeg' }
        ]
      });

      // 3. Wire up the OS buttons to your React functions!
      navigator.mediaSession.setActionHandler('play', () => {
        // Call whatever function you use to resume playback
        togglePlay(); 
      });
      
      navigator.mediaSession.setActionHandler('pause', () => {
        // Call whatever function you use to pause playback
        togglePlay(); 
      });
      
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        prevSong(); // Your existing function
      });
      
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        nextSong(); // Your existing function
      });
    }

    // Cleanup function when the song stops or unmounts
    return () => {
      if ('mediaSession' in navigator) {
        navigator.mediaSession.setActionHandler('play', null);
        navigator.mediaSession.setActionHandler('pause', null);
        navigator.mediaSession.setActionHandler('previoustrack', null);
        navigator.mediaSession.setActionHandler('nexttrack', null);
      }
    };
  }, [currentSong]); // Re-run this whenever the song changes!

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