import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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

    const navItems = [
        { id: 'songs', label: 'Manage Songs', icon: '🎵' },
        ...(isAdmin ? [{ id: 'users', label: 'Users & Roles', icon: '👥' }] : []),
        { id: 'analytics', label: 'Analytics', icon: '📊' },
        { id: 'content', label: 'Site Content', icon: '🖼️' },
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

                {/* Back to main site button */}
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