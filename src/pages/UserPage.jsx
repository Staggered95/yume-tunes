import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/axios'; // Centralized Axios instance
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import { useToast } from '../context/ToastContext';
import { getMediaUrl } from '../utils/media';
import UserSettings from '../components/UserSettings';

const UserPage = () => {
    const location = useLocation();
    
    const { isLoggedIn } = useAuth();
    const { userProfile, setUserProfile } = useUser();
    const { addToast } = useToast();

    // UI States
    const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'profile'); 
    const [isEditing, setIsEditing] = useState(false);
    const [showFullHistory, setShowFullHistory] = useState(false);
    const [history, setHistory] = useState([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    
    // Form States
    const [editForm, setEditForm] = useState({ first_name: '', last_name: '' });
    
    // Upload States
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [isUploadingBanner, setIsUploadingBanner] = useState(false);
    const avatarInputRef = useRef(null);
    const bannerInputRef = useRef(null);

    // === 1. UTILITY: DYNAMIC TIME FORMATTER ===
    const getTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        
        if (seconds < 60) return 'Just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        if (days === 1) return 'Yesterday';
        return date.toLocaleDateString();
    };

    useEffect(() => {
        if (location.state?.activeTab) {
            setActiveTab(location.state.activeTab);
            
            // Optional: Clear the state from the URL history so if they refresh 
            // the page later, it doesn't force them back to settings.
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    // === 2. DATA FETCHING ===
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const { data } = await api.get('/user/history');
                if (data.success) setHistory(data.data);
            } catch (err) {
                console.error("Failed to load history", err);
            } finally {
                setIsLoadingHistory(false);
            }
        };

        if (isLoggedIn && userProfile) fetchHistory();
    }, [isLoggedIn, userProfile]);

    useEffect(() => {
        if (userProfile) {
            setEditForm({
                first_name: userProfile.first_name || '',
                last_name: userProfile.last_name || ''
            });
        }
    }, [userProfile, isEditing]);

    // === 3. PROFILE ACTIONS ===
    const handleSaveProfile = async () => {
        try {
            const { data } = await api.put('/user/update', editForm);
            if (data.success) {
                setUserProfile(prev => ({ ...prev, ...editForm }));
                setIsEditing(false);
                addToast("Profile synchronized!", "success");
            }
        } catch (err) {
            addToast("Failed to update profile", "error");
        }
    };

    const handleFileUpload = async (e, type) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith('image/')) {
            addToast("Invalid image file", "error");
            return;
        }

        const isAvatar = type === 'avatar';
        isAvatar ? setIsUploadingAvatar(true) : setIsUploadingBanner(true);

        const formData = new FormData();
        formData.append(isAvatar ? 'user_image' : 'banner_image', file);

        try {
            const endpoint = isAvatar ? '/user/upload-avatar' : '/user/upload-banner';
            const { data } = await api.post(endpoint, formData);
            
            if (data.success) {
                const updateKey = isAvatar ? 'user_image' : 'banner_image';
                setUserProfile(prev => ({ ...prev, [updateKey]: data.imageUrl }));
                addToast(`${isAvatar ? 'Avatar' : 'Banner'} updated!`, "success");
            }
        } catch (err) {
            addToast("Upload failed", "error");
        } finally {
            isAvatar ? setIsUploadingAvatar(false) : setIsUploadingBanner(false);
            e.target.value = ''; 
        }
    };

    // Path Resolvers
    const avatarSrc = getMediaUrl(userProfile?.user_image);
    const bannerSrc = getMediaUrl(userProfile?.banner_image);
    
    const displayedHistory = showFullHistory ? history : history.slice(0, 5);

    if (!isLoggedIn) return null;

    return (
        <div className="min-h-screen bg-background-primary text-text-primary pb-32">
            
            {/* INTERACTIVE BANNER */}
            <div className="relative group h-64 md:h-80 w-full bg-background-secondary overflow-hidden">
                {bannerSrc ? (
                    <img 
                        src={bannerSrc} 
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isUploadingBanner ? 'opacity-30' : 'opacity-100'}`} 
                        alt="" 
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/10 via-background-primary to-background-secondary" />
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-background-primary via-transparent to-black/20" />

                <button 
                    onClick={() => bannerInputRef.current?.click()}
                    className="absolute right-8 top-8 px-6 py-2.5 bg-background-primary/60 hover:bg-background-primary rounded-xl opacity-40 md:opacity-0 group-hover:opacity-100 transition-all backdrop-blur-xl border border-border flex items-center gap-3 active:scale-95"
                >
                    <svg className="w-4 h-4 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /></svg>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Change Banner</span>
                </button>
                <input type="file" ref={bannerInputRef} onChange={(e) => handleFileUpload(e, 'banner')} className="hidden" />
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 -mt-24 relative z-20">
                
                {/* PROFILE HEADER SECTION */}
                <div className="flex flex-col md:flex-row items-center md:items-end gap-8 mb-16">
                    <div className="relative group shrink-0">
                        <div className={`w-40 h-40 md:w-48 md:h-48 rounded-[2.5rem] bg-background-active border-8 border-background-primary shadow-2xl overflow-hidden flex items-center justify-center transition-all duration-500 ${isUploadingAvatar ? 'scale-90 opacity-50' : ''}`}>
                            {avatarSrc ? (
                                <img src={avatarSrc} className="w-full h-full object-cover" alt="" />
                            ) : (
                                <span className="text-6xl font-black text-accent-primary">
                                    {userProfile?.username?.charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>

                        <div 
                            onClick={() => avatarInputRef.current?.click()}
                            className="absolute inset-0 bg-accent-primary/20 backdrop-blur-sm rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center cursor-pointer border-4 border-accent-primary"
                        >
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /></svg>
                        </div>
                        <input type="file" ref={avatarInputRef} onChange={(e) => handleFileUpload(e, 'avatar')} className="hidden" />
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        {isEditing ? (
                            <div className="flex gap-4 mb-4">
                                <input 
                                    type="text" 
                                    value={editForm.first_name} 
                                    onChange={(e) => setEditForm({...editForm, first_name: e.target.value})} 
                                    className="bg-background-secondary border border-border rounded-xl px-4 py-3 text-2xl font-black focus:border-accent-primary outline-none transition-all w-1/2"
                                    placeholder="First Name"
                                />
                                <input 
                                    type="text" 
                                    value={editForm.last_name} 
                                    onChange={(e) => setEditForm({...editForm, last_name: e.target.value})} 
                                    className="bg-background-secondary border border-border rounded-xl px-4 py-3 text-2xl font-black focus:border-accent-primary outline-none transition-all w-1/2"
                                    placeholder="Last Name"
                                />
                            </div>
                        ) : (
                            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none mb-3">
                                {userProfile?.first_name} {userProfile?.last_name}
                            </h1>
                        )}
                        <p className="text-accent-primary text-xl font-bold tracking-tight opacity-80">@{userProfile?.username}</p>
                    </div>

                    <div className="shrink-0 pt-6">
                        {isEditing ? (
                            <div className="flex gap-4">
                                <button onClick={() => setIsEditing(false)} className="px-8 py-3 rounded-xl font-bold text-sm bg-background-secondary hover:bg-background-hover transition-all">Cancel</button>
                                <button onClick={handleSaveProfile} className="px-8 py-3 rounded-xl font-black text-sm bg-accent-primary text-background-primary shadow-lg shadow-accent-primary/20 transition-all active:scale-95">Save</button>
                            </div>
                        ) : (
                            <button onClick={() => setIsEditing(true)} className="px-8 py-3 rounded-xl border border-border hover:border-accent-primary font-black text-xs uppercase tracking-widest transition-all">Edit Profile</button>
                        )}
                    </div>
                </div>

                {/* CONTENT GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-12">
                        
                        {/* TABS */}
                        <div className="flex gap-10 border-b border-border">
                            {['profile', 'settings'].map(tab => (
                                <button 
                                    key={tab}
                                    onClick={() => setActiveTab(tab)} 
                                    className={`pb-5 text-xs font-black uppercase tracking-[0.3em] transition-all border-b-2 ${activeTab === tab ? 'border-accent-primary text-text-primary' : 'border-transparent text-text-muted hover:text-text-primary'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {activeTab === 'profile' && (
                            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h2 className="text-xs font-black uppercase tracking-[0.4em] text-text-muted mb-8 italic">Listening History</h2>
                                <div className="space-y-1">
                                    {isLoadingHistory ? (
                                        <div className="py-20 text-center text-text-muted animate-pulse font-bold uppercase tracking-widest">Scanning History...</div>
                                    ) : (
                                        displayedHistory.map((track, idx) => (
                                            <div key={track.history_id} className="group flex items-center gap-6 p-4 hover:bg-background-secondary rounded-2xl transition-all border border-transparent hover:border-border">
                                                <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 shadow-lg">
                                                    <img src={getMediaUrl(track.cover_path)} className="w-full h-full object-cover" alt="" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-black text-sm tracking-tight group-hover:text-accent-primary transition-colors">{track.title}</h3>
                                                    <p className="text-xs text-text-secondary font-bold">{track.artist} • {track.anime}</p>
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted shrink-0">{getTimeAgo(track.created_at)}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                                {history.length > 5 && (
                                    <button onClick={() => setShowFullHistory(!showFullHistory)} className="w-full mt-6 py-4 rounded-xl border border-border text-[10px] font-black uppercase tracking-[0.3em] hover:bg-background-secondary transition-all">
                                        {showFullHistory ? 'Close View ↑' : `View ${history.length - 5} More ↓`}
                                    </button>
                                )}
                            </section>
                        )}

                        {activeTab === 'settings' && (
                            <UserSettings/>
                        )}
                    </div>

                    {/* ACCOUNT SIDEBAR */}
                    <div className="lg:col-span-1">
                        <div className="bg-background-secondary/30 border border-border rounded-3xl p-8 sticky top-28 backdrop-blur-md">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-primary mb-8 italic underline underline-offset-8">Intelligence</h3>
                            <div className="space-y-8">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Primary Node</p>
                                    <p className="font-bold text-text-primary">{userProfile?.email}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Activation Date</p>
                                    <p className="font-bold text-text-primary">
                                        {userProfile?.created_at ? new Date(userProfile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A'}
                                    </p>
                                </div>
                                <div className="pt-4">
                                    <div className="px-4 py-2 bg-accent-primary/5 border border-accent-primary/20 text-accent-primary text-[10px] font-black uppercase tracking-widest rounded-xl text-center">
                                        Free Tier Verified
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserPage;