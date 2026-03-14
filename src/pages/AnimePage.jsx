import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSongs } from '../context/SongContext';
import api from '../api/axios';
import { getMediaUrl } from '../utils/media';
import ShuffleButton from '../minicomps/ShuffleButton';

const getTypeWeight = (type) => {
    const t = (type || '').toUpperCase();
    if (t.startsWith('OP')) return 1;
    if (t.startsWith('ED')) return 2;
    if (t.startsWith('OST')) return 3;
    return 4;
};

const formatSongType = (type) => {
    if (!type) return 'OST';
    const t = type.toUpperCase();
    if (t === 'OP') return 'OP 1';
    if (t === 'ED') return 'ED 1';
    if (t.startsWith('OP') && t.length > 2) return `OP ${t.slice(2)}`;
    if (t.startsWith('ED') && t.length > 2) return `ED ${t.slice(2)}`;
    return t;
};

const AnimePage = () => {
    const { title } = useParams(); 
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { playQueue, playShuffledQueue } = useSongs();

    useEffect(() => {
        const fetchSongs = async () => {
            setLoading(true);
            try {
                const url = `/songs/anime/${encodeURIComponent(title)}`;
                const { data } = await api.get(url);
                const validSongs = Array.isArray(data.data || data) ? (data.data || data) : [];

                // Clean Sort (No deduplication needed!)
                const sortedSongs = [...validSongs].sort((a, b) => {
                    const seasonA = parseInt(a.season) || 1;
                    const seasonB = parseInt(b.season) || 1;
                    if (seasonA !== seasonB) return seasonA - seasonB;
                    
                    const weightA = getTypeWeight(a.song_type);
                    const weightB = getTypeWeight(b.song_type);
                    if (weightA !== weightB) return weightA - weightB;
                    
                    return (a.song_type || '').localeCompare(b.song_type || '');
                });

                setSongs(sortedSongs);
            } catch (err) {
                console.error("❌ API Error:", err);
            } finally {
                setLoading(false);
            }
        };

        if (title) fetchSongs();
    }, [title]);

    const groupedSongs = songs.reduce((acc, song, index) => {
        const s = parseInt(song.season) || 1;
        if (!acc[s]) acc[s] = [];
        acc[s].push({ song, absoluteIndex: index }); 
        return acc;
    }, {});

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-text-muted animate-pulse text-2xl md:text-4xl font-black tracking-widest uppercase">Loading...</div>
        </div>
    );

    return (
        <div className="min-h-screen pb-32 bg-background-primary">
            
            <div className="relative min-h-[45vh] md:h-[45vh] flex items-end p-6 pt-24 md:p-12 overflow-hidden bg-background-secondary shadow-lg">
                {songs[0]?.cover_path && (
                    <img src={getMediaUrl(songs[0].cover_path)} className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-20 scale-125 pointer-events-none" alt="" />
                )}
                
                <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 w-full mt-auto">
                    <img src={getMediaUrl(songs[0]?.cover_path)} className="w-50 h-50 md:w-56 md:h-56 rounded-xl md:rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] object-cover border border-border shrink-0" alt={title} />
                    
                    <div className="text-center md:text-left flex-1 min-w-0">
                        <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-accent-primary mb-2 md:mb-3">Anime Series</p>
                        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-tight md:leading-none mb-4 md:mb-6 text-text-primary">{title}</h1>
                        
                        {songs.length > 0 && (
                            <div className="flex items-center justify-center md:justify-start gap-4">
                                <button onClick={() => playQueue(songs, 0)} className="w-12 h-12 md:w-14 md:h-14 bg-accent-primary text-background-primary rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl shadow-accent-primary/20 group">
                                    <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-8 md:h-8 ml-1 transition-transform group-hover:scale-110" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                                </button>
                                <ShuffleButton variant="action" onClick={() => playShuffledQueue(songs)} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="p-4 md:p-12 max-w-7xl mx-auto">
                {songs.length > 0 ? (
                    Object.keys(groupedSongs).map((season) => (
                        <div key={`season-${season}`} className="mb-12 last:mb-0">
                            <div className="flex items-center gap-4 mb-6 sticky top-16 bg-background-primary/90 backdrop-blur-md z-20 py-4">
                                <h2 className="text-xl md:text-2xl font-black text-text-primary uppercase tracking-widest">Season {season}</h2>
                                <div className="h-px bg-border flex-1"></div>
                            </div>

                            <div className="flex flex-col gap-2">
                                {groupedSongs[season].map(({ song, absoluteIndex }, idx) => (
                                    <div key={song.id} onClick={() => playQueue(songs, absoluteIndex)} className="flex items-center gap-3 md:gap-6 p-3 md:p-4 rounded-xl md:rounded-2xl hover:bg-background-hover active:bg-background-active transition-all cursor-pointer group">
                                        <span className="w-5 md:w-6 text-xs md:text-sm font-bold text-text-muted group-hover:text-accent-primary transition-colors text-center shrink-0">
                                            {(idx + 1).toString().padStart(2, '0')}
                                        </span>
                                        
                                        <div className="flex-1 min-w-0 pr-2 md:pr-4 flex items-center gap-2 md:gap-3">
                                            <div className="flex flex-col flex-1 min-w-0">
                                                <h4 className="font-bold text-sm md:text-lg truncate group-hover:text-accent-primary transition-colors text-text-primary">{song.title}</h4>
                                                <p className="text-xs md:text-sm text-text-secondary truncate mt-0.5">{song.artist}</p>
                                            </div>

                                            {/* 🛡️ MOBILE CHIP FIX: Removed 'hidden'. It is now just 'flex' so it forces rendering on all screens! */}
                                            <div className="flex shrink-0 px-2 py-1 md:px-3 md:py-1 bg-accent-primary/10 border border-accent-primary/30 rounded-full">
                                                <span className="text-[9px] md:text-xs font-black text-accent-primary uppercase tracking-wider">{formatSongType(song.song_type)}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="hidden sm:flex text-text-muted group-hover:text-accent-primary transition-colors shrink-0">
                                            <svg className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-20 text-center text-text-muted italic text-sm md:text-base">No songs found for this series.</div>
                )}
            </div>
        </div>
    );
};

export default AnimePage;