import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { usePlayback } from "./PlaybackContext";

const SongContext = createContext();

export const SongProvider = ({children}) => {
    const [songs, setSongs] = useState([]);
    const [currentSong, setCurrentSong] = useState(null);
    const [loading, setLoading] = useState(true);

    const { playSong } = usePlayback();

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const response = await fetch('http://localhost:5000/songs/all');
                const songs = await response.json();
                setSongs(songs.data);
                setLoading(false);
            }catch (err) {
                console.log("Error fetching the songs: ", err);
                setLoading(false);
            }
        }
        fetchSongs();
    }, [])

    const selectSong = useCallback((song) => {
        setCurrentSong(song);
        const fullUrl = `http://localhost:5000${song.file_path}`;
        playSong(fullUrl);
    }, [playSong]);

    const nextSong = useCallback(() => {
        if (!currentSong) return;
        const currentIndex = songs.findIndex(s => s.id === currentSong.id);
        const nextIndex = (currentIndex+1)%songs.length;
        selectSong(songs[nextIndex]);
    }, [currentSong, songs, selectSong]);

    const prevSong = useCallback(() => {
        if (!currentSong) return;
        const currentIndex = songs.findIndex(s => s.id === currentSong.id);
        const prevIndex = (currentIndex-1+songs.length)%songs.length;
        selectSong(songs[prevIndex]);
    }, [currentSong, songs, selectSong]);

    const values = useMemo(() => ({
        songs, 
        loading, 
        currentSong, 
        selectSong, 
        nextSong, 
        prevSong
    }), [songs, loading, currentSong, selectSong, nextSong, prevSong]);

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