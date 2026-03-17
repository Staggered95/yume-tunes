import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { usePlayback } from "./PlaybackContext";
import api from "../api/axios";
import { getMediaUrl } from "../utils/media";

const SongContext = createContext();

export const SongProvider = ({children}) => {
    const [queue, setQueue] = useState([]);
    const [originalQueue, setOriginalQueue] = useState([]);
    const [isShuffle, setIsShuffle] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [loading, setLoading] = useState(true);
    const currentSong = queue[currentIndex] || null;

    const { audioRef, isEnded, playSong, togglePlay } = usePlayback();

    const logTelemetry = useCallback(async (song, listenedSecs, totalSecs, skipped) => {
    if (!song || listenedSecs < 5) return; 

    try {
        api.post('/user/telemetry', {
            songID: song.id,
            listenedSeconds: Math.floor(listenedSecs),
            durationSeconds: Math.floor(totalSecs),
            wasSkipped: skipped
        });
    } catch (err) {
        console.error("Telemetry failed", err);
    }
}, []);

    const addToQueue = (song) => {
    if (queue.length === 0) {
      playQueue([song], 0);
      return;
    }

    setQueue(prevQueue => {
      const isDuplicate = prevQueue.some(s => s.id === song.id);
      if (isDuplicate) return prevQueue;

      return [...prevQueue, song];
    });

    setOriginalQueue(prevQueue => {
      const isDuplicate = prevQueue.some(s => s.id === song.id);
      if (isDuplicate) return prevQueue;

      return [...prevQueue, song];
    });
  };

    const toggleShuffle = useCallback(() => {
        setIsShuffle(prev => {
            const newShuffleState = !prev;
        
            if (newShuffleState) {
                const currentSongObj = queue[currentIndex];
                const remainingSongs = queue.filter((_, idx) => idx !== currentIndex);
            
                // Fisher-Yates Shuffle
                for (let i = remainingSongs.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [remainingSongs[i], remainingSongs[j]] = [remainingSongs[j], remainingSongs[i]];
                }
            
                setQueue([currentSongObj, ...remainingSongs]);
                setCurrentIndex(0); 
            } else {
                // Restore the original queue
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


    const playShuffledQueue = useCallback((newSongs) => {
        if (!newSongs || newSongs.length === 0) return;

        setOriginalQueue(newSongs);

        // Perform a fresh Fisher-Yates Shuffle on a copy of the new songs
        const shuffled = [...newSongs];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        // Mount the new shuffled queue to the state
        setQueue(shuffled);
        setCurrentIndex(0);
        setIsShuffle(true);
        
        const songToPlay = shuffled[0];
        if (songToPlay) {
            const fullUrl = getMediaUrl(songToPlay.file_path, 'audio');
            playSong(fullUrl);
        }
    }, [playSong]); 


    const playQueue = useCallback((newQueue, startingIndex = 0) => {
        setQueue(newQueue);
        setOriginalQueue(newQueue);
        setCurrentIndex(startingIndex);
        
        const songToPlay = newQueue[startingIndex];
        if (songToPlay) {
            const fullUrl = getMediaUrl(songToPlay.file_path, 'audio');
            playSong(fullUrl);
        }
    }, [playSong]);

    const playNextInQueue = (song) => {
        if (queue.length === 0) {
            playQueue([song], 0);
            return;
        }

        let newQueue = [...queue];
        let newIndex = currentIndex;

        const existingIndex = newQueue.findIndex(s => s.id === song.id);

        if (existingIndex !== -1) {
            if (existingIndex === currentIndex) return; 
            
            newQueue.splice(existingIndex, 1);
            
            if (existingIndex < currentIndex) {
                newIndex--;
            }
        }

        newQueue.splice(newIndex + 1, 0, song);

        setQueue(newQueue);
        if (newIndex !== currentIndex) {
            setCurrentIndex(newIndex); 
        }
    };


    const reorderQueue = (startIndex, endIndex) => {
    if (startIndex === endIndex) return;

    setQueue(prevQueue => {
        const newQueue = [...prevQueue];
        const [draggedItem] = newQueue.splice(startIndex, 1);
        newQueue.splice(endIndex, 0, draggedItem);
        return newQueue;
    });

    setCurrentIndex(prevIndex => {
        let newIndex = prevIndex;
        if (startIndex === prevIndex) {
            newIndex = endIndex; 
        } else if (startIndex < prevIndex && endIndex >= prevIndex) {
            newIndex--; 
        } else if (startIndex > prevIndex && endIndex <= prevIndex) {
            newIndex++; 
        }
        return newIndex;
    });
  };
    

    const nextSong = useCallback((isManualSkip = true) => {
        if (queue.length === 0) return;
        const audioNode = audioRef.current;
        if (isManualSkip && currentSong && audioNode) {
            logTelemetry(currentSong, audioNode.currentTime, audioNode.duration, true); 
        }

        setCurrentIndex((prevIndex) => {
            const nextIdx = (prevIndex + 1) % queue.length; 
            const nextSongObj = queue[nextIdx];
            
            const fullUrl = getMediaUrl(nextSongObj.file_path, 'audio');
            playSong(fullUrl);
            
            return nextIdx;
        });
    }, [queue, currentSong, logTelemetry, playSong]);

    const prevSong = useCallback((isManualSkip = true) => {
        if (queue.length === 0) return;
        const audioNode = audioRef.current;
        if (isManualSkip && currentSong && audioNode) {
            logTelemetry(currentSong, audioNode.currentTime, audioNode.duration, true); 
        }
        
        setCurrentIndex((prevIndex) => {
            const prevIdx = (prevIndex - 1 + queue.length) % queue.length; 
            const prevSongObj = queue[prevIdx];
            
            const fullUrl = getMediaUrl(prevSongObj.file_path);
            playSong(fullUrl);
            
            return prevIdx;
        });
    }, [queue, currentSong, logTelemetry, playSong]);

    useEffect(() => {
        const audioNode = audioRef.current;
        if (isEnded && currentSong && audioNode) {
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
        reorderQueue,
        playNextInQueue,
        playShuffledQueue
    }), [queue, currentIndex, currentSong, playQueue, nextSong, prevSong]);

  useEffect(() => {
    if ('mediaSession' in navigator && currentSong) {
      
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentSong.title,
        artist: currentSong.artist,
        album: currentSong.anime || 'YumeTunes',
        artwork: [
          { src: getMediaUrl(currentSong.cover_path), sizes: '512x512', type: 'image/jpeg' }
        ]
      });

      navigator.mediaSession.setActionHandler('play', () => {
        togglePlay(); 
      });
      
      navigator.mediaSession.setActionHandler('pause', () => {
        togglePlay(); 
      });
      
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        prevSong(); 
      });
      
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        nextSong(); 
      });
      
    }

    return () => {
      if ('mediaSession' in navigator) {
        navigator.mediaSession.setActionHandler('play', null);
        navigator.mediaSession.setActionHandler('pause', null);
        navigator.mediaSession.setActionHandler('previoustrack', null);
        navigator.mediaSession.setActionHandler('nexttrack', null);
      }
    };
  }, [currentSong]);

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