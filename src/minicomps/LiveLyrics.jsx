import { useState, useRef, useEffect } from "react";
import { usePlayback } from "../context/PlaybackContext";

const LiveLyrics = ({ lyrics }) => {
    const [time, setTime] = useState(0);
    const lyricRefs = useRef([]);
    const { audioRef } = usePlayback();

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        
        setTime(audio.currentTime || 0);
        const updateTime = () => setTime(audio.currentTime);
        
        audio.addEventListener('timeupdate', updateTime);
        return () => audio.removeEventListener('timeupdate', updateTime);
    }, [audioRef]);

    const activeIndex = lyrics.findLastIndex(line => time >= line.time);

    useEffect(() => {
        if (activeIndex !== -1 && lyricRefs.current[activeIndex]) {
            lyricRefs.current[activeIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [activeIndex]);

    const handleSeek = (targetTime) => {
        if (audioRef.current) audioRef.current.currentTime = targetTime;
    };

    return (
        <div className="relative w-full h-full overflow-y-auto scrollbar-none px-4 md:px-10 py-[30vh] mask-fade-edges">
            {lyrics.map((line, i) => (
                <p 
                    key={i}
                    ref={el => lyricRefs.current[i] = el}
                    onClick={() => handleSeek(line.time)}
                    className={`text-2xl md:text-5xl font-black py-4 transition-all duration-700 cursor-pointer ${
                        activeIndex === i ? 'text-white scale-105 opacity-100 blur-0' : 'text-white/10 opacity-20 blur-[1px] hover:opacity-40 hover:blur-none'
                    }`}
                >
                    {line.text}
                </p>
            ))}
        </div>
    );
};

export default LiveLyrics;