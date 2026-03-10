import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// import { useUser } from '../context/UserContext'; <-- You don't need this anymore, useAuth has the user!

import SongManager from '../components/admin/SongManager';
import SongEditor from '../components/admin/SongEditor';
import LyricsSyncer from '../components/admin/LyricsSyncer';
import UserManager from '../components/admin/UserManager';
import SiteContentManager from '../components/admin/SiteContentManager';
import AnalyticsDashboard from '../components/admin/AnalyticsDashboard';

// ==========================================
// THE MAIN ADMIN SHELL
// ==========================================
const AdminPage = () => {
    const navigate = useNavigate();
    // Grab the user from AuthContext (which contains the verified role)
    const { user } = useAuth(); 
    
    const [activeTab, setActiveTab] = useState('songs');
    const [isEditingSong, setIsEditingSong] = useState(false);
    const [isSyncingLyrics, setIsSyncingLyrics] = useState(false);
    const [currentSongData, setCurrentSongData] = useState(null);

    // --- RBAC Check ---
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
        // 1. Handle the complex 'songs' tab logic first
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
        
        // 2. Handle the standard tabs
        switch (activeTab) {
            case 'users': 
                // Extra failsafe: If a moderator somehow forces the state to 'users', show an error instead of the component
                return isAdmin ? <UserManager /> : <div className="text-error p-6">Access Denied</div>;
            case 'analytics': 
                return <AnalyticsDashboard />;
            case 'content': 
                return <SiteContentManager />;
            default: 
                return <SongManager onAddNew={handleAddNew} onEditSong={handleEditSong} onSyncLyrics={handleSyncLyrics} />;
        }
    };

    // The dynamic navigation array!
    const navItems = [
        { id: 'songs', label: 'Manage Songs', icon: '🎵' },
        // Use the spread operator to conditionally insert the Users tab ONLY if they are an admin
        ...(isAdmin ? [{ id: 'users', label: 'Users & Roles', icon: '👥' }] : []),
        { id: 'analytics', label: 'Analytics', icon: '📊' },
        { id: 'content', label: 'Site Content', icon: '🖼️' },
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col md:flex-row">
            
            {/* SIDEBAR NAVIGATION */}
            <aside className="w-full md:w-64 bg-background-secondary border-r border-white/5 flex flex-col shrink-0">
                <div className="p-6 border-b border-white/5">
                    <h1 className="text-xl font-black tracking-widest uppercase text-accent-primary">Admin Panel</h1>
                    <p className="text-xs text-white/40 mt-1 flex items-center gap-2">
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
                                closeSubViews(); // Reset sub-views when switching tabs!
                            }}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                                activeTab === item.id 
                                ? 'bg-accent-primary/10 text-accent-primary border border-accent-primary/20' 
                                : 'text-white/50 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            <span className="text-lg">{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                </nav>

                {/* Back to main site button */}
                <div className="p-4 border-t border-white/5">
                    <button 
                        onClick={() => navigate('/')}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-white/50 hover:text-white transition-colors"
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