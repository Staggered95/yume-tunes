import { createContext, useContext, useState, useEffect, useRef, useMemo, useCallback } from "react";

const PlaybackContext = createContext();

export const PlaybackProvider = ({children}) => {
    const audioRef = useRef(new Audio());
    const [volume, setVolume] = useState(1.0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isEnded, setIsEnded] = useState(false);

    useEffect(() => {
        const audio = audioRef.current;
        audio.volume = volume;

        // === 1. BULLETPROOF OS SYNC ===
        const updateOSPosition = () => {
            if ('mediaSession' in navigator && 'setPositionState' in navigator.mediaSession) {
                // Force strict number typing. If duration is missing, default to 0 to prevent crashes.
                const currentDuration = Number(audio.duration) || 0;
                const currentPosition = Number(audio.currentTime) || 0;
                const currentPlaybackRate = Number(audio.playbackRate) || 1;

                // Only update if we have a real duration greater than 0
                if (currentDuration > 0 && currentDuration !== Infinity) {
                    try {
                        navigator.mediaSession.setPositionState({
                            duration: currentDuration,
                            playbackRate: currentPlaybackRate,
                            position: currentPosition
                        });
                    } catch (err) {
                        // Silently catch rare OS-level API errors
                        console.warn("MediaSession update failed:", err);
                    }
                }
            }
        };

        // === 2. EVENT HANDLERS ===
        const handlePlay = () => { setIsPlaying(true); updateOSPosition(); };
        const handlePause = () => { setIsPlaying(false); updateOSPosition(); };
        const handleEnded = () => { setIsPlaying(false); setIsEnded(true); };
        
        // This is the golden event. It fires exactly when the browser calculates the MP3 length.
        const handleDurationChange = () => updateOSPosition();
        
        // The "Heartbeat". This pings the OS so the progress bar never gets stuck. 
        // (Since there is no setState here, it does NOT slow down React!)
        const handleTimeUpdate = () => updateOSPosition();

        // === 3. ATTACH LISTENERS ===
        audio.addEventListener("play", handlePlay);
        audio.addEventListener("pause", handlePause);
        audio.addEventListener("ended", handleEnded);
        audio.addEventListener("durationchange", handleDurationChange);
        audio.addEventListener("timeupdate", handleTimeUpdate);

        // === 4. OS LOCK SCREEN SCRUBBING ===
        if ('mediaSession' in navigator) {
            navigator.mediaSession.setActionHandler('seekto', (details) => {
                if (details.fastSeek && 'fastSeek' in audio) {
                    audio.fastSeek(details.seekTime);
                } else {
                    audio.currentTime = details.seekTime;
                }
                updateOSPosition(); // Force update immediately after scrubbing
            });
        }

        return () => {
            audio.removeEventListener("play", handlePlay);
            audio.removeEventListener("pause", handlePause);
            audio.removeEventListener("ended", handleEnded);
            audio.removeEventListener("durationchange", handleDurationChange);
            audio.removeEventListener("timeupdate", handleTimeUpdate);
            
            if ('mediaSession' in navigator) {
                navigator.mediaSession.setActionHandler('seekto', null);
            }
        };
    }, []);

    const playSong = useCallback((url) => {
        setIsEnded(false);
        audioRef.current.pause();
        audioRef.current.src = url;
        audioRef.current.play().catch(err => {
            //check
            console.warn("Autoplay blocked by browser. User must click play.", err);
            setIsPlaying(false);
        });
    }, []);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    const handleVolumeChange = useCallback((value) => {
        const newVolume = parseFloat(value);
        setVolume(newVolume);
    }, []);

    const togglePlay = useCallback(() => {
        if (audioRef.current.paused) {
            audioRef.current.play().catch(err => console.warn("Play blocked:", err));
        } else {
            audioRef.current.pause();
        }
    }, []);

    const values = useMemo(() => ({
        audioRef,
        isPlaying,
        volume,
        isEnded, 
        playSong,
        togglePlay,
        handleVolumeChange
    }), [isPlaying, volume, isEnded, playSong, togglePlay, handleVolumeChange]);

    return (
        <PlaybackContext.Provider value={values}>
            {children}
        </PlaybackContext.Provider>
    );
}

export const usePlayback = () => {
    const context = useContext(PlaybackContext);
    if (!context) {
        throw new Error("usePlayback must be inside PlaybackProvider");
    }
    return context;
}