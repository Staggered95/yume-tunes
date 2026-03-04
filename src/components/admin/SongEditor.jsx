import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const SongEditor = ({ initialData, onCancel, onSaveSuccess }) => {
    const { authFetch } = useAuth();
    const { addToast } = useToast();
    
    const isEditMode = !!initialData;
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        artist_name: '',
        anime_title: '',
        song_type: 'OP' // Default to Opening
    });

    // File States
    const [audioFile, setAudioFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);

    const audioInputRef = useRef(null);
    const coverInputRef = useRef(null);

    // Pre-fill if in Edit Mode
    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                artist_name: initialData.artist || '',
                anime_title: initialData.anime || '',
                song_type: initialData.song_type || 'OP'
            });
            if (initialData.cover_path) {
                setCoverPreview(initialData.cover_path.startsWith('http') ? initialData.cover_path : `http://localhost:5000${initialData.cover_path}`);
            }
        }
    }, [initialData]);

    const handleTextChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCoverChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setCoverFile(file);
            setCoverPreview(URL.createObjectURL(file)); // Local preview
        } else {
            addToast("Please upload a valid image file", "error");
        }
    };

    const handleAudioChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('audio/')) {
            setAudioFile(file);
        } else {
            addToast("Please upload a valid audio file (.mp3, .wav)", "error");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.title || !formData.artist_name) {
            return addToast("Title and Artist are required", "error");
        }
        if (!isEditMode && !audioFile) {
            return addToast("An audio file is required for new songs", "error");
        }

        setIsSubmitting(true);

        const submitData = new FormData();
        submitData.append('title', formData.title);
        submitData.append('artist_name', formData.artist_name);
        submitData.append('anime_title', formData.anime_title);
        submitData.append('song_type', formData.song_type);
        
        if (audioFile) submitData.append('audio_file', audioFile);
        if (coverFile) submitData.append('cover_image', coverFile);

        const url = isEditMode ? `/admin/songs/${initialData.id}` : '/admin/songs';
        const method = isEditMode ? 'PUT' : 'POST';

        try {
            const res = await authFetch(url, {
                method: method,
                //headers: { 'Content-Type': null }, // Let browser set multipart boundary
                body: submitData
            });
            const json = await res.json();

            if (json.success) {
                addToast(`Song ${isEditMode ? 'updated' : 'added'} successfully!`, "success");
                onSaveSuccess(); // Go back to manager
            } else {
                addToast(json.message || "Failed to save song", "error");
            }
        } catch (err) {
            console.error("Save error:", err);
            addToast("Network error while saving", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="animate-fade-in max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white tracking-tight">
                    {isEditMode ? 'Edit Song' : 'Add New Song'}
                </h2>
                <button onClick={onCancel} className="text-white/50 hover:text-white transition-colors">
                    Cancel & Go Back
                </button>
            </div>

            <form onSubmit={handleSubmit} className="bg-white/5 border border-white/5 rounded-2xl p-8 flex flex-col md:flex-row gap-10">
                
                {/* LEFT: Cover Image Upload */}
                <div className="w-full md:w-64 shrink-0 flex flex-col items-center">
                    <div 
                        onClick={() => coverInputRef.current?.click()}
                        className="w-full aspect-square bg-black/40 border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-accent-primary hover:bg-white/5 transition-all overflow-hidden group relative"
                    >
                        {coverPreview ? (
                            <>
                                <img src={coverPreview} alt="Cover Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-sm font-bold tracking-widest uppercase">Change</span>
                                </div>
                            </>
                        ) : (
                            <div className="text-center p-4">
                                <svg className="w-8 h-8 text-white/40 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                <span className="text-xs text-white/50 font-medium">Upload Cover Art</span>
                            </div>
                        )}
                    </div>
                    <input type="file" ref={coverInputRef} onChange={handleCoverChange} accept="image/*" className="hidden" />
                </div>

                {/* RIGHT: Text Metadata & Audio Upload */}
                <div className="flex-1 flex flex-col gap-6">
                    
                    <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Song Title *</label>
                        <input type="text" name="title" value={formData.title} onChange={handleTextChange} required className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-accent-primary focus:outline-none transition-colors" placeholder="e.g. Unravel" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Artist Name *</label>
                            <input type="text" name="artist_name" value={formData.artist_name} onChange={handleTextChange} required className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-accent-primary focus:outline-none transition-colors" placeholder="e.g. TK" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Anime / Source</label>
                            <input type="text" name="anime_title" value={formData.anime_title} onChange={handleTextChange} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-accent-primary focus:outline-none transition-colors" placeholder="e.g. Tokyo Ghoul" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Category</label>
                        <select name="song_type" value={formData.song_type} onChange={handleTextChange} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-accent-primary focus:outline-none transition-colors appearance-none">
                            <option value="OP">Opening (OP)</option>
                            <option value="ED">Ending (ED)</option>
                            <option value="OST">Original Soundtrack (OST)</option>
                            <option value="Single">Standard Single</option>
                        </select>
                    </div>

                    {/* Audio File Upload */}
                    <div className="pt-4 border-t border-white/5">
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Audio File {isEditMode ? '(Optional: Leave blank to keep current)' : '*'}</label>
                        <div className="flex items-center gap-4">
                            <button 
                                type="button"
                                onClick={() => audioInputRef.current?.click()}
                                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zm12-3c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zM9 10l12-3" /></svg>
                                Select Audio File
                            </button>
                            <span className="text-sm text-white/40 truncate flex-1">
                                {audioFile ? audioFile.name : (isEditMode ? 'Current audio file active' : 'No file selected')}
                            </span>
                        </div>
                        <input type="file" ref={audioInputRef} onChange={handleAudioChange} accept="audio/*" className="hidden" />
                    </div>

                    {/* Submit */}
                    <div className="pt-6 mt-2 flex justify-end">
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className={`bg-accent-primary text-black px-8 py-3 rounded-full font-bold transition-all ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent-hover hover:scale-105 active:scale-95'}`}
                        >
                            {isSubmitting ? 'Saving...' : (isEditMode ? 'Update Song' : 'Upload Song')}
                        </button>
                    </div>

                </div>
            </form>
        </div>
    );
};

export default SongEditor;