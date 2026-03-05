import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import SongManager from '../components/admin/SongManager';
import SongEditor from '../components/admin/SongEditor';
import LyricsSyncer from '../components/admin/LyricsSyncer';

// ==========================================
// PLACEHOLDER COMPONENTS (We will split these into separate files later)
// ==========================================


const UserManager = () => (
    <div className="animate-fade-in">
        <h2 className="text-2xl font-bold mb-6">User Management</h2>
        <div className="bg-white/5 border border-white/5 rounded-xl p-8 text-center text-white/40">
            User list and role-based access control (RBAC) toggles will go here.
        </div>
    </div>
);

const AnalyticsDashboard = () => (
    <div className="animate-fade-in">
        <h2 className="text-2xl font-bold mb-6">Platform Analytics</h2>
        <div className="bg-white/5 border border-white/5 rounded-xl p-8 text-center text-white/40">
            Telemetry stats, most played songs, and graphs will go here.
        </div>
    </div>
);

const SiteContentManager = () => (
    <div className="animate-fade-in">
        <h2 className="text-2xl font-bold mb-6">Site Content</h2>
        <div className="bg-white/5 border border-white/5 rounded-xl p-8 text-center text-white/40">
            Quotes array and featured section banners will be managed here.
        </div>
    </div>
);


// ==========================================
// THE MAIN ADMIN SHELL
// ==========================================
const AdminPage = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const { userProfile } = useUser();
    
    const [activeTab, setActiveTab] = useState('songs');
    const [isEditingSong, setIsEditingSong] = useState(false);
    const [isSyncingLyrics, setIsSyncingLyrics] = useState(false);
    const [currentSongData, setCurrentSongData] = useState(null);

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

    // Basic Security Check: Redirect if not logged in
    // (You will want to expand this to check if userProfile.role === 'admin' later!)
    useEffect(() => {
        if (!token) {
            navigate('/');
        }
    }, [token, navigate]);

    const renderContent = () => {
        if (activeTab === 'songs') {
            // Priority 1: Lyrics Studio
            if (isSyncingLyrics && currentSongData) {
                return (
                    <LyricsSyncer 
                        songId={currentSongData.id}
                        songTitle={currentSongData.title}     // <-- NEW
                        songArtist={currentSongData.artist}   // <-- NEW
                        audioUrl={currentSongData.file_path}
                        initialLyrics={currentSongData.lyrics}
                        onCancel={closeSubViews}
                        onSaveSuccess={closeSubViews}
                    />
                );
            }
            
            // Priority 2: Edit/Add Form
            if (isEditingSong) {
                return (
                    <SongEditor 
                        initialData={currentSongData} 
                        onCancel={closeSubViews} 
                        onSaveSuccess={closeSubViews} 
                    />
                );
            }

            // Fallback: The Data Table
            return <SongManager onAddNew={handleAddNew} onEditSong={handleEditSong} onSyncLyrics={handleSyncLyrics} />;
        }
        
        switch (activeTab) {
            case 'songs': return <SongManager onAddNew={handleAddNew} onEditSong={handleEditSong} />;
            //case 'editor': return <div className="text-white">The SongEditor will go here! (Editing: {editingSong ? editingSong.title : 'New Song'})</div>;
            case 'users': return <UserManager />;
            case 'analytics': return <AnalyticsDashboard />;
            case 'content': return <SiteContentManager />;
            default: return <SongManager />;
        }
    };

    const navItems = [
        { id: 'songs', label: 'Manage Songs', icon: '🎵' },
        { id: 'users', label: 'Users & Roles', icon: '👥' },
        { id: 'analytics', label: 'Analytics', icon: '📊' },
        { id: 'content', label: 'Site Content', icon: '🖼️' },
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col md:flex-row">
            
            {/* SIDEBAR NAVIGATION */}
            <aside className="w-full md:w-64 bg-background-secondary border-r border-white/5 flex flex-col shrink-0">
                <div className="p-6 border-b border-white/5">
                    <h1 className="text-xl font-black tracking-widest uppercase text-accent-primary">Admin Panel</h1>
                    <p className="text-xs text-white/40 mt-1">YumeTunes Control Center</p>
                </div>

                <nav className="flex-1 p-4 flex flex-col gap-2">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
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
                <div className="max-w-6xl mx-auto">
                    {renderContent()}
                </div>
            </main>

        </div>
    );
};

export default AdminPage;