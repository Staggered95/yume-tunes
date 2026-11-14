import React, { useState, useRef, useEffect } from 'react';
import api from '../../api/axios'; // Native Axios import
import { useToast } from '../../context/ToastContext';
import ImageCropperModal from '../../minicomps/ImageCropperModal';
import { getMediaUrl } from '../../utils/media';

const SongEditor = ({ initialData, onCancel, onSaveSuccess }) => {
    const { addToast } = useToast();
    
    const isEditMode = !!initialData;
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        artist_name: '',
        anime_title: '',
        song_type: 'OP',
        genre: '',
        duration_seconds: ''
    });

    // File States
    const [audioFile, setAudioFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);

    // Cropper States
    const [isCropperOpen, setIsCropperOpen] = useState(false);
    const [rawImageSrc, setRawImageSrc] = useState(null);

    const audioInputRef = useRef(null);
    const coverInputRef = useRef(null);

    // Pre-fill if in Edit Mode
    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                artist_name: initialData.artist || '',
                anime_title: initialData.anime || '',
                song_type: initialData.song_type || 'OP',
                genre: initialData.genre || '',
                duration_seconds: initialData.duration_seconds || ''
            });
            if (initialData.cover_path) {
                setCoverPreview(getMediaUrl(initialData.cover_path));
            }
        }
    }, [initialData]);

    const handleTextChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- CROPPER LOGIC ---
    const handleInitialCoverSelect = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const imageUrl = URL.createObjectURL(file);
            setRawImageSrc(imageUrl); 
            setIsCropperOpen(true);   
        } else {
            addToast("Please upload a valid image file", "error");
        }
        if (coverInputRef.current) coverInputRef.current.value = '';
    };

    const handleCropComplete = (croppedFile) => {
        setCoverFile(croppedFile);
        setCoverPreview(URL.createObjectURL(croppedFile)); 
        setIsCropperOpen(false);
    };

    // --- AUDIO LOGIC (WITH AUTO-DURATION) ---
    const handleAudioChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('audio/')) {
            setAudioFile(file);
            
            const audioUrl = URL.createObjectURL(file);
            const audio = new Audio(audioUrl);
            audio.onloadedmetadata = () => {
                setFormData(prev => ({ ...prev, duration_seconds: Math.round(audio.duration) }));
                addToast(`Audio duration auto-calculated: ${Math.round(audio.duration)}s`, "success");
            };
        } else {
            addToast("Please upload a valid audio file (.mp3, .wav)", "error");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
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
        submitData.append('genre', formData.genre);
        submitData.append('duration_seconds', formData.duration_seconds);
        
        if (audioFile) submitData.append('audio_file', audioFile);
        if (coverFile) submitData.append('cover_image', coverFile);

        const url = isEditMode ? `/admin/songs/${initialData.id}` : '/admin/songs';
        const method = isEditMode ? 'put' : 'post';

        try {
            // Axios automatically detects FormData and sets multipart/form-data headers!
            const { data } = await api({
                method: method,
                url: url,
                data: submitData
            });

            if (data.success) {
                addToast(`Song ${isEditMode ? 'updated' : 'added'} successfully!`, "success");
                onSaveSuccess(); 
            } else {
                addToast(data.message || "Failed to save song", "error");
            }
        } catch (err) {
            console.error("Save error:", err);
            addToast("Network error while saving", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {isCropperOpen && (
                <ImageCropperModal 
                    imageSrc={rawImageSrc} 
                    onCropComplete={handleCropComplete} 
                    onClose={() => setIsCropperOpen(false)} 
                />
            )}

            <div className="animate-fade-in max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 sm:gap-0">
                    <h2 className="text-2xl font-bold text-text-primary tracking-tight">
                        {isEditMode ? 'Edit Song' : 'Add New Song'}
                    </h2>
                    <button onClick={onCancel} className="text-text-muted hover:text-text-primary transition-colors duration-300">
                        Cancel & Go Back
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="bg-background-secondary border border-border rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8 z-20 md:gap-10 shadow-xl transition-all duration-300">
                    
                    {/* LEFT: Cover Image Upload */}
                    <div className="w-full md:w-64 shrink-0 flex flex-col items-center">
                        <div 
                            onClick={() => coverInputRef.current?.click()}
                            className="w-full aspect-square bg-background-primary border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-accent-primary hover:bg-background-hover transition-all duration-300 overflow-hidden group relative"
                        >
                            {coverPreview ? (
                                <>
                                    <img src={coverPreview} alt="Cover Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-background-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <span className="text-sm text-text-primary font-bold tracking-widest uppercase">Change</span>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center p-4">
                                    <svg className="w-8 h-8 text-text-muted mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    <span className="text-xs text-text-secondary font-medium">Upload Cover Art</span>
                                </div>
                            )}
                        </div>
                        <input type="file" ref={coverInputRef} onChange={handleInitialCoverSelect} accept="image/*" className="hidden" />
                    </div>

                    {/* RIGHT: Text Metadata & Audio Upload */}
                    <div className="flex-1 flex flex-col gap-6">
                        
                        <div>
                            <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">Song Title *</label>
                            <input type="text" name="title" value={formData.title} onChange={handleTextChange} required className="w-full bg-background-primary border border-border rounded-lg px-4 py-3 text-text-primary focus:border-accent-primary focus:outline-none transition-all duration-300 placeholder:text-text-muted" placeholder="e.g. Unravel" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">Artist Name *</label>
                                <input type="text" name="artist_name" value={formData.artist_name} onChange={handleTextChange} required className="w-full bg-background-primary border border-border rounded-lg px-4 py-3 text-text-primary focus:border-accent-primary focus:outline-none transition-all duration-300 placeholder:text-text-muted" placeholder="e.g. TK" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">Anime / Source</label>
                                <input type="text" name="anime_title" value={formData.anime_title} onChange={handleTextChange} className="w-full bg-background-primary border border-border rounded-lg px-4 py-3 text-text-primary focus:border-accent-primary focus:outline-none transition-all duration-300 placeholder:text-text-muted" placeholder="e.g. Tokyo Ghoul" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">Category</label>
                                <select name="song_type" value={formData.song_type} onChange={handleTextChange} className="w-full bg-background-primary border border-border rounded-lg px-4 py-3 text-text-primary focus:border-accent-primary focus:outline-none transition-all duration-300 appearance-none">
                                    <option value="OP">Opening (OP)</option>
                                    <option value="ED">Ending (ED)</option>
                                    <option value="OST">Original Soundtrack (OST)</option>
                                    <option value="Single">Standard Single</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">Genre</label>
                                <input type="text" name="genre" value={formData.genre} onChange={handleTextChange} className="w-full bg-background-primary border border-border rounded-lg px-4 py-3 text-text-primary focus:border-accent-primary focus:outline-none transition-all duration-300 placeholder:text-text-muted" placeholder="e.g. J-Rock" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">Duration (Secs)</label>
                                <input type="number" name="duration_seconds" value={formData.duration_seconds} onChange={handleTextChange} className="w-full bg-background-primary border border-border rounded-lg px-4 py-3 text-text-primary focus:border-accent-primary focus:outline-none transition-all duration-300 placeholder:text-text-muted" placeholder="Auto-fills" />
                            </div>
                        </div>

                        {/* Audio File Upload */}
                        <div className="pt-4 border-t border-border">
                            <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">Audio File {isEditMode ? '(Optional: Leave blank to keep current)' : '*'}</label>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <button 
                                    type="button"
                                    onClick={() => audioInputRef.current?.click()}
                                    className="px-4 py-2 bg-background-secondary hover:bg-background-hover border border-border text-text-primary rounded-md text-sm font-medium transition-all duration-300 flex items-center gap-2 whitespace-nowrap"
                                >
                                    <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zm12-3c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zM9 10l12-3" /></svg>
                                    Select Audio File
                                </button>
                                <span className="text-sm text-text-muted truncate w-full flex-1">
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
                                className={`w-full sm:w-auto bg-accent-primary text-background-primary px-8 py-3 rounded-full font-bold transition-all duration-300 shadow-lg shadow-accent-primary/20 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent-hover hover:scale-105 active:scale-95'}`}
                            >
                                {isSubmitting ? 'Saving...' : (isEditMode ? 'Update Song' : 'Upload Song')}
                            </button>
                        </div>

                    </div>
                </form>
            </div>
        </>
    );
};

export default SongEditor;