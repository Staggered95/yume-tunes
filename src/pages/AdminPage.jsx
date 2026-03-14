import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import SongManager from '../components/admin/SongManager';
import SongEditor from '../components/admin/SongEditor';
import LyricsSyncer from '../components/admin/LyricsSyncer';
import UserManager from '../components/admin/UserManager';
import SiteContentManager from '../components/admin/SiteContentManager';
import AnalyticsDashboard from '../components/admin/AnalyticsDashboard';
import ArtistAnimeManager from '../components/admin/ArtistAnimeManager'; // <-- 1. Import it!

// ==========================================
// THE MAIN ADMIN SHELL
// ==========================================
const AdminPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth(); 
    
    const [activeTab, setActiveTab] = useState('songs');
    const [isEditingSong, setIsEditingSong] = useState(false);
    const [isSyncingLyrics, setIsSyncingLyrics] = useState(false);
    const [currentSongData, setCurrentSongData] = useState(null);

    const isAdmin = user?.role === 'admin';

    const handleEditSong = (songObj) => {
        setCurrentSongData(songObj);
        setIsEditingSong(true);
        setIsSyncingLyrics(false);
    };

    const handleAddNew = () => {
        setCurrentSongData(null);
        setIsEditingSong(true);
        setIsSyncingLyrics(false);
    };

    const handleSyncLyrics = (songObj) => {
        setCurrentSongData(songObj);
        setIsSyncingLyrics(true);
        setIsEditingSong(false);
    };

    const closeSubViews = () => {
        setIsEditingSong(false); 
        setIsSyncingLyrics(false);
        setCurrentSongData(null);
    };

    const renderContent = () => {
        if (activeTab === 'songs') {
            if (isSyncingLyrics && currentSongData) {
                return (
                    <LyricsSyncer 
                        songId={currentSongData.id}
                        songTitle={currentSongData.title}
                        songArtist={currentSongData.artist}
                        audioUrl={currentSongData.file_path}
                        initialLyrics={currentSongData.lyrics}
                        onCancel={closeSubViews}
                        onSaveSuccess={closeSubViews}
                    />
                );
            }
            if (isEditingSong) {
                return (
                    <SongEditor 
                        initialData={currentSongData} 
                        onCancel={closeSubViews} 
                        onSaveSuccess={closeSubViews} 
                    />
                );
            }
            return <SongManager onAddNew={handleAddNew} onEditSong={handleEditSong} onSyncLyrics={handleSyncLyrics} />;
        }
        
        switch (activeTab) {
            case 'entities': // <-- 2. Add to switch statement!
                return <ArtistAnimeManager />;
            case 'users': 
                return isAdmin ? <UserManager /> : <div className="text-error p-6 font-bold">Access Denied</div>;
            case 'analytics': 
                return <AnalyticsDashboard />;
            case 'content': 
                return <SiteContentManager />;
            default: 
                return <SongManager onAddNew={handleAddNew} onEditSong={handleEditSong} onSyncLyrics={handleSyncLyrics} />;
        }
    };

    // 3. Add to the Navigation Sidebar
    const navItems = [
        { 
            id: 'songs', 
            label: 'Manage Songs', 
            icon: (
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
            ) 
        },
        { 
            id: 'entities', 
            label: 'Artists & Anime', 
            icon: (
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {/* A cool Filmstrip/Media icon to represent Anime & Artists */}
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
            ) 
        }, 
        ...(isAdmin ? [{ 
            id: 'users', 
            label: 'Users & Roles', 
            icon: (
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ) 
        }] : []),
        { 
            id: 'analytics', 
            label: 'Analytics', 
            icon: (
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ) 
        },
        { 
            id: 'content', 
            label: 'Site Content', 
            icon: (
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ) 
        },
    ];

    return (
        <div className="min-h-screen bg-background-primary text-text-primary flex flex-col md:flex-row transition-colors duration-300">
            
            {/* SIDEBAR NAVIGATION */}
            <aside className="w-full md:w-64 bg-background-secondary border-r border-border flex flex-col shrink-0">
                <div className="p-6 border-b border-border">
                    <h1 className="text-xl font-black tracking-widest uppercase text-accent-primary">Admin Panel</h1>
                    <p className="text-xs text-text-muted mt-1 flex items-center gap-2">
                        {user?.username} 
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-accent-primary/20 text-accent-primary uppercase">
                            {user?.role}
                        </span>
                    </p>
                </div>

                <nav className="flex-1 p-4 flex flex-col gap-2">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveTab(item.id);
                                closeSubViews(); 
                            }}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                                activeTab === item.id 
                                ? 'bg-accent-primary/10 text-accent-primary border border-accent-primary/20' 
                                : 'text-text-secondary hover:bg-background-hover hover:text-text-primary'
                            }`}
                        >
                            <span className="text-lg">{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-border">
                    <button 
                        onClick={() => navigate('/')}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-text-muted hover:text-text-primary transition-colors"
                    >
                        ← Back to App
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto">
                <div className="max-w-6xl mx-auto animate-in fade-in duration-300">
                    {renderContent()}
                </div>
            </main>

        </div>
    );
};

export default AdminPage;