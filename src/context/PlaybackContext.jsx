import { createContext, useContext, useState, useEffect, useRef, useMemo, useCallback } from "react";

const PlaybackContext = createContext();

export const PlaybackProvider = ({children}) => {
    const audioRef = useRef(new Audio());
    //const [currentTime, setCurrentTime] = useState(0);
    //const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1.0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isEnded, setIsEnded] = useState(false);

    useEffect(() => {
        const audio = audioRef.current;
        audio.volume = volume;

        //const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        //const handleLoadedMetadata = () => setDuration(audio.duration);
        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        const handleEnded = () => { setIsPlaying(false); setIsEnded(true); };

        //audio.addEventListener("timeupdate", handleTimeUpdate);
        //audio.addEventListener("loadedmetadata", handleLoadedMetadata);
        audio.addEventListener("play", handlePlay);
        audio.addEventListener("pause", handlePause);
        audio.addEventListener("ended", handleEnded);

        return () => {
            //audio.removeEventListener("timeupdate", handleTimeUpdate);
            //audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
            audio.removeEventListener("play", handlePlay);
            audio.removeEventListener("pause", handlePause);
            audio.removeEventListener("ended", handleEnded);
        };
    }, []);

    const playSong = useCallback((url) => {
        setIsEnded(false);
        audioRef.current.src = url;
        audioRef.current.play().catch(err => {
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