import { createContext, useContext, useState, useEffect, useRef, useMemo, useCallback } from "react";

const PlaybackContext = createContext();

export const PlaybackProvider = ({children}) => {
    const audioRef = useRef(new Audio());
    const [volume, setVolume] = useState(1.0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isEnded, setIsEnded] = useState(false);
    const [isBuffering, setIsBuffering] = useState(false);

    useEffect(() => {
        const audio = audioRef.current;
        audio.volume = volume;

        // OS sync
        const updateOSPosition = () => {
            if ('mediaSession' in navigator && 'setPositionState' in navigator.mediaSession) {
                const currentDuration = Number(audio.duration) || 0;
                const currentPosition = Number(audio.currentTime) || 0;
                const currentPlaybackRate = Number(audio.playbackRate) || 1;

                if (currentDuration > 0 && currentDuration !== Infinity) {
                    try {
                        navigator.mediaSession.setPositionState({
                            duration: currentDuration,
                            playbackRate: currentPlaybackRate,
                            position: currentPosition
                        });
                    } catch (err) {
                        console.warn("MediaSession update failed:", err);
                    }
                }
            }
        };

        // EVENT HANDLERS
        const handlePlay = () => { setIsPlaying(true); updateOSPosition(); };
        const handlePause = () => { setIsPlaying(false); updateOSPosition(); };
        const handleEnded = () => { setIsPlaying(false); setIsEnded(true); };
        
        const handleDurationChange = () => updateOSPosition();
        const handleTimeUpdate = () => updateOSPosition();

        const handleWaiting = () => setIsBuffering(true); 
        const handlePlaying = () => setIsBuffering(false); 
        const handleCanPlay = () => setIsBuffering(false); 

        // ATTACH LISTENERS
        audio.addEventListener("play", handlePlay);
        audio.addEventListener("pause", handlePause);
        audio.addEventListener("ended", handleEnded);
        audio.addEventListener("durationchange", handleDurationChange);
        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.addEventListener("waiting", handleWaiting);
        audio.addEventListener("playing", handlePlaying);
        audio.addEventListener("canplay", handleCanPlay);

        // OS LOCK SCREEN SCRUBBING
        if ('mediaSession' in navigator) {
            navigator.mediaSession.setActionHandler('seekto', (details) => {
                if (details.fastSeek && 'fastSeek' in audio) {
                    audio.fastSeek(details.seekTime);
                } else {
                    audio.currentTime = details.seekTime;
                }
                updateOSPosition(); 
            });
        }

        return () => {
            audio.removeEventListener("play", handlePlay);
            audio.removeEventListener("pause", handlePause);
            audio.removeEventListener("ended", handleEnded);
            audio.removeEventListener("durationchange", handleDurationChange);
            audio.removeEventListener("timeupdate", handleTimeUpdate);
            audio.removeEventListener("waiting", handleWaiting);
            audio.removeEventListener("playing", handlePlaying);
            audio.removeEventListener("canplay", handleCanPlay);
            
            if ('mediaSession' in navigator) {
                navigator.mediaSession.setActionHandler('seekto', null);
            }
        };
    }, []);

    const playSong = useCallback((url) => {
        setIsEnded(false);
        setIsBuffering(true);
        audioRef.current.pause();
        audioRef.current.src = url;
        audioRef.current.play().catch(err => {
            //check
            console.warn("Autoplay blocked by browser. User must click play.", err);
            setIsPlaying(false);
            setIsBuffering(false);
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
        isBuffering,
        playSong,
        togglePlay,
        handleVolumeChange
    }), [isPlaying, volume, isEnded, isBuffering, playSong, togglePlay, handleVolumeChange]);

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