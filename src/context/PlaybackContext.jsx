import { createContext, useContext, useState, useEffect, useRef, useMemo, useCallback } from "react";

const PlaybackContext = createContext();

export const PlaybackProvider = ({children}) => {
    const audioRef = useRef(new Audio());
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.8);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const audio = audioRef.current;
        audio.volume = volume;

        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handleLoadedMetadata = () => setDuration(audio.duration);
        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);

        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.addEventListener("loadedmetadata", handleLoadedMetadata);
        audio.addEventListener("play", handlePlay);
        audio.addEventListener("pause", handlePause);

        return () => {
            audio.removeEventListener("timeupdate", handleTimeUpdate);
            audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
            audio.removeEventListener("play", handlePlay);
            audio.removeEventListener("pause", handlePause);
        };
    }, []);

    const playSong = useCallback((url) => {
        audioRef.current.src = url;
        audioRef.current.play();
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

    const togglePlay = () => {
        if (audioRef.current.paused) {
            audioRef.current.play();
        }else {
            audioRef.current.pause();
        }
    }

    const handleSeek = (seconds) => {
        audioRef.current.currentTime = seconds;
    }

    const values = useMemo(() => ({
        currentTime,
        duration,
        isPlaying,
        volume,
        playSong,
        togglePlay,
        handleSeek,
        handleVolumeChange
    }), [currentTime, duration, isPlaying]);

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