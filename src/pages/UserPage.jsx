import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import { useToast } from '../context/ToastContext';

const DUMMY_HISTORY = [
    { id: 1, title: "Unravel", artist: "TK from Ling tosite sigure", anime: "Tokyo Ghoul", time: "2 hours ago" },
    { id: 2, title: "Gurenge", artist: "LiSA", anime: "Demon Slayer", time: "5 hours ago" },
    { id: 3, title: "KICK BACK", artist: "Kenshi Yonezu", anime: "Chainsaw Man", time: "Yesterday" },
    { id: 4, title: "Idol", artist: "YOASOBI", anime: "Oshi no Ko", time: "Yesterday" },
    { id: 5, title: "Shinzo wo Sasageyo!", artist: "Linked Horizon", anime: "Attack on Titan", time: "2 days ago" },
    { id: 6, title: "Crossing Field", artist: "LiSA", anime: "Sword Art Online", time: "3 days ago" },
];

const UserPage = () => {
    const { authFetch } = useAuth();
    const { userProfile, setUserProfile } = useUser();
    const { addToast } = useToast();

    // UI States
    const [activeTab, setActiveTab] = useState('profile'); 
    const [isEditing, setIsEditing] = useState(false);
    const [showFullHistory, setShowFullHistory] = useState(false);
    
    // Form States
    const [editForm, setEditForm] = useState({ first_name: '', last_name: '' });
    
    // Upload States
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [isUploadingBanner, setIsUploadingBanner] = useState(false);
    const avatarInputRef = useRef(null);
    const bannerInputRef = useRef(null); // 1. New Ref for the Banner!

    useEffect(() => {
        if (userProfile) {
            setEditForm({
                first_name: userProfile.first_name || '',
                last_name: userProfile.last_name || ''
            });
        }
    }, [userProfile, isEditing]);

    const handleSaveProfile = async () => {
        try {
            const res = await authFetch('/user/update', {
                method: 'PUT',
                headers: {
        'Content-Type': 'application/json'
    },
                body: JSON.stringify(editForm)
            });
            const json = await res.json();
            
            if (json.success) {
                setUserProfile(prev => ({ ...prev, ...editForm }));
                setIsEditing(false);
                addToast("Profile updated successfully", "success");
            } else {
                addToast(json.message || "Failed to update profile", "error");
            }
        } catch (err) {
            addToast("Network error while saving", "error");
        }
    };

    // === AVATAR UPLOAD ===
    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            addToast("Please upload a valid image file", "error");
            return;
        }

        setIsUploadingAvatar(true);
        const formData = new FormData();
        formData.append('user_image', file);
        //console.log(userProfile);
        try {
            const res = await authFetch('/user/upload-avatar', {
                method: 'POST',
                body: formData
            });
            const json = await res.json();
            if (json.success) {
                setUserProfile(prev => ({ ...prev, user_image: json.imageUrl }));
                addToast("Profile picture updated!", "success");
            } else addToast("Failed to upload image", "error");
        } catch (err) {
            addToast("Network error during upload", "error");
        } finally {
            setIsUploadingAvatar(false);
            if (avatarInputRef.current) avatarInputRef.current.value = ''; 
        }
    };

    // === 2. BANNER UPLOAD LOGIC ===
    const handleBannerChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            addToast("Please upload a valid image file", "error");
            return;
        }

        setIsUploadingBanner(true);
        const formData = new FormData();
        // We will tell Multer to look for 'banner_image'
        formData.append('banner_image', file); 

        try {
            // New endpoint specifically for the banner
            const res = await authFetch('/user/upload-banner', { 
                method: 'POST',
                //file headers are automatically given by the browser
                //headers: { 'Content-Type': null },
                body: formData
            });
            const json = await res.json();
            if (json.success) {
                console.log(json);
                console.log(userProfile);
                setUserProfile(prev => ({ ...prev, banner_image: json.imageUrl }));
                addToast("Cover photo updated!", "success");
            } else addToast("Failed to upload cover photo", "error");
        } catch (err) {
            addToast("Network error during upload", "error");
        } finally {
            setIsUploadingBanner(false);
            if (bannerInputRef.current) bannerInputRef.current.value = ''; 
        }
    };

    // Safe Image URL Parsers
    const avatarSrc = userProfile?.user_image 
        ? (userProfile.user_image.startsWith('http') ? userProfile.user_image : `http://localhost:5000${userProfile.user_image}`)
        : null;

    const bannerSrc = userProfile?.banner_image 
        ? (userProfile.banner_image.startsWith('http') ? userProfile.banner_image : `http://localhost:5000${userProfile.banner_image}`)
        : null;

    const displayedHistory = showFullHistory ? DUMMY_HISTORY : DUMMY_HISTORY.slice(0, 3);
    console.log(avatarSrc);

    return (
        <div className="min-h-screen bg-[#050505] text-white pb-24">
            
            {/* 3. HERO BANNER (Now Interactive!) */}
            <div className="relative group h-48 md:h-64 w-full bg-gradient-to-r from-accent-primary/20 via-purple-900/20 to-black overflow-hidden">
                
                {/* Dynamically render the background image if it exists */}
                {bannerSrc && (
                    <img 
                        src={bannerSrc} 
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isUploadingBanner ? 'opacity-50 animate-pulse' : 'opacity-100'}`} 
                        alt="Cover" 
                    />
                )}
                
                {/* A subtle dark overlay so the white text always stays readable regardless of the image uploaded */}
                <div className="absolute inset-0 bg-black/30"></div>

                {/* Hover Edit Button (Top Right) */}
                <div 
                    onClick={() => bannerInputRef.current?.click()}
                    className="absolute right-4 top-4 md:right-8 md:top-8 px-4 py-2 bg-black/50 hover:bg-black/80 rounded-full opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-md border border-white/20 z-20 flex items-center gap-2"
                >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    <span className="text-xs font-bold uppercase tracking-widest text-white hidden md:block">Edit Cover</span>
                </div>

                {/* Hidden Input for Banner */}
                <input type="file" ref={bannerInputRef} onChange={handleBannerChange} accept="image/*" className="hidden" />
            </div>

            <div className="max-w-6xl mx-auto px-6 lg:px-12 -mt-20 relative z-10">
                
                {/* PROFILE HEADER */}
                <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-12">
                    
                    {/* The Avatar Upload Zone */}
                    <div className="relative group shrink-0">
                        <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full bg-background-active border-4 border-[#050505] shadow-2xl overflow-hidden flex items-center justify-center ${isUploadingAvatar ? 'animate-pulse' : ''}`}>
                            {avatarSrc ? (
                                <img src={avatarSrc} className="w-full h-full object-cover" alt="Profile" />
                            ) : (
                                <span className="text-5xl font-bold text-accent-primary">
                                    {userProfile?.username?.charAt(0).toUpperCase() || 'U'}
                                </span>
                            )}
                        </div>

                        {/* Hover Overlay for Avatar */}
                        <div 
                            onClick={() => avatarInputRef.current?.click()}
                            className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer border-4 border-transparent hover:border-accent-primary"
                        >
                            <svg className="w-8 h-8 text-white mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            <span className="text-xs font-bold tracking-widest uppercase">Change</span>
                        </div>
                        {/* Hidden Input for Avatar */}
                        <input type="file" ref={avatarInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
                    </div>

                    {/* Name & Username Display */}
                    <div className="flex-1 text-center md:text-left">
                        {isEditing ? (
                            <div className="flex flex-col md:flex-row gap-3 mb-2 items-center md:items-start">
                                <input 
                                    type="text" 
                                    value={editForm.first_name} 
                                    onChange={(e) => setEditForm({...editForm, first_name: e.target.value})} 
                                    className="bg-white/5 border border-white/10 rounded-md px-3 py-2 text-2xl font-black focus:outline-none focus:border-accent-primary focus:bg-white/10 transition-colors w-full md:w-auto"
                                    placeholder="First Name"
                                />
                                <input 
                                    type="text" 
                                    value={editForm.last_name} 
                                    onChange={(e) => setEditForm({...editForm, last_name: e.target.value})} 
                                    className="bg-white/5 border border-white/10 rounded-md px-3 py-2 text-2xl font-black focus:outline-none focus:border-accent-primary focus:bg-white/10 transition-colors w-full md:w-auto"
                                    placeholder="Last Name"
                                />
                            </div>
                        ) : (
                            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-2">
                                {userProfile?.first_name} {userProfile?.last_name}
                            </h1>
                        )}
                        <p className="text-white/50 text-lg md:text-xl font-medium tracking-wide">@{userProfile?.username}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="shrink-0 flex gap-3 mt-4 md:mt-0">
                        {isEditing ? (
                            <>
                                <button onClick={() => setIsEditing(false)} className="px-5 py-2.5 rounded-full bg-white/5 text-white hover:bg-white/10 font-bold text-sm transition-colors">Cancel</button>
                                <button onClick={handleSaveProfile} className="px-5 py-2.5 rounded-full bg-accent-primary text-black hover:bg-accent-hover font-bold text-sm transition-colors">Save Changes</button>
                            </>
                        ) : (
                            <button onClick={() => setIsEditing(true)} className="px-5 py-2.5 rounded-full border border-white/20 text-white hover:border-white hover:bg-white/5 font-bold text-sm transition-all flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>

                {/* TABS NAVIGATION */}
                <div className="flex gap-8 border-b border-white/5 mb-8">
                    <button onClick={() => setActiveTab('profile')} className={`pb-3 text-sm font-bold uppercase tracking-widest transition-colors border-b-2 ${activeTab === 'profile' ? 'border-accent-primary text-white' : 'border-transparent text-white/40 hover:text-white'}`}>Overview</button>
                    <button onClick={() => setActiveTab('settings')} className={`pb-3 text-sm font-bold uppercase tracking-widest transition-colors border-b-2 ${activeTab === 'settings' ? 'border-accent-primary text-white' : 'border-transparent text-white/40 hover:text-white'}`}>Settings</button>
                </div>

                {/* TAB CONTENT */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2">
                        {activeTab === 'profile' && (
                            <section>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold tracking-tight">Recent Listening History</h2>
                                </div>
                                <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
                                    {displayedHistory.map((track, idx) => (
                                        <div key={track.id} className={`flex items-center gap-4 p-4 hover:bg-white/5 transition-colors cursor-pointer ${idx !== displayedHistory.length - 1 ? 'border-b border-white/5' : ''}`}>
                                            <div className="w-12 h-12 bg-white/10 rounded-md flex items-center justify-center shrink-0">
                                                <svg className="w-5 h-5 text-white/40" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-white/90 truncate">{track.title}</h3>
                                                <p className="text-xs text-white/50 truncate">{track.artist} • {track.anime}</p>
                                            </div>
                                            <div className="text-xs text-white/30 font-medium shrink-0">{track.time}</div>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={() => setShowFullHistory(!showFullHistory)} className="mt-4 text-sm font-bold text-white/50 hover:text-white transition-colors uppercase tracking-widest">
                                    {showFullHistory ? 'Show Less ↑' : 'Show All History ↓'}
                                </button>
                            </section>
                        )}

                        {activeTab === 'settings' && (
                            <section className="flex flex-col gap-6">
                                <div className="bg-white/5 border border-white/5 rounded-2xl p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
                                    <svg className="w-16 h-16 text-white/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    <h2 className="text-xl font-bold mb-2">Settings are locked</h2>
                                    <p className="text-white/40 max-w-sm">Password management, Google linking, and theme controls will be available here soon.</p>
                                </div>
                            </section>
                        )}
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/5 border border-white/5 rounded-2xl p-6 sticky top-24">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6">Account Details</h3>
                            <div className="flex flex-col gap-5">
                                <div>
                                    <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Email</p>
                                    <p className="font-medium text-white/90">{userProfile?.email}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Member Since</p>
                                    <p className="font-medium text-white/90">
                                        {userProfile?.created_at ? new Date(userProfile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Unknown'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Plan</p>
                                    <span className="inline-block px-3 py-1 bg-accent-primary/20 text-accent-primary text-xs font-bold tracking-widest rounded-full border border-accent-primary/30 mt-1">
                                        YUMETUNES FREE
                                    </span>
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