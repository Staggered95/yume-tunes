import React, { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import { getMediaUrl } from '../../utils/media';
import ConfirmDialog from '../../minicomps/ConfirmDialog';

const SiteContentManager = () => {
    const { addToast } = useToast();

    const [activeView, setActiveView] = useState('quotes'); 
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deleteModal, setDeleteModal] = useState({
                            isOpen: false,
                            type: null,    // e.g., 'quote', 'banner', 'user'
                            id: null,      // The ID of the item
                            title: '',     // Dynamic title
                            message: ''    // Dynamic message
    });

    // --- DATA STATES ---
    const [quotes, setQuotes] = useState([]);
    const [banners, setBanners] = useState([]);

    // --- QUOTE FORM STATES ---
    const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
    const [editingQuoteId, setEditingQuoteId] = useState(null);
    const [quoteForm, setQuoteForm] = useState({ quote_text: '', author: '', anime: '', quote_type: 'normal' });

    // --- BANNER FORM STATES ---
    const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
    const [bannerForm, setBannerForm] = useState({ title: '', subtitle: '', target_url: '', banner_type: 'home' });
    const [bannerFile, setBannerFile] = useState(null);
    const [bannerPreview, setBannerPreview] = useState(null);
    const bannerInputRef = useRef(null);


    // --- FETCHERS ---
    useEffect(() => {
        fetchData();
    }, [activeView]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const endpoint = activeView === 'quotes' ? '/admin/quotes' : '/admin/banners';
            const { data } = await api.get(endpoint);
            if (data.success) {
                activeView === 'quotes' ? setQuotes(data.data) : setBanners(data.data);
            }
        } catch (err) {
            addToast(`Error fetching ${activeView}`, "error");
        } finally {
            setIsLoading(false);
        }
    };

    // --- QUOTE HANDLERS ---
    const openQuoteModal = (quote = null) => {
        if (quote) {
            setEditingQuoteId(quote.id);
            setQuoteForm({ 
                quote_text: quote.quote_text, 
                author: quote.author, 
                anime: quote.anime || '', 
                quote_type: quote.quote_type || 'normal' 
            });
        } else {
            setEditingQuoteId(null);
            setQuoteForm({ quote_text: '', author: '', anime: '', quote_type: 'normal' });
        }
        setIsQuoteModalOpen(true);
    };

    const handleSaveQuote = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const { data } = await api({
                    method: editingQuoteId ? 'PUT' : 'POST',
                    url: editingQuoteId ? `/admin/quotes/${editingQuoteId}` : '/admin/quotes',
                    data: quoteForm
            });
            
            if (data.success) {
                addToast(`Quote ${editingQuoteId ? 'updated' : 'added'}!`, "success");
                setIsQuoteModalOpen(false);
                fetchData();
            } else {
                addToast(data.message, "error");
            }
        } catch (err) {
            addToast("Network error", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleQuote = async (id) => {
        try {
            await api.put(`/admin/quotes/${id}/toggle`);
            setQuotes(quotes.map(q => q.id === id ? { ...q, is_active: !q.is_active } : q));
        } catch (err) { addToast("Failed to toggle quote", "error"); }
    };


    // --- BANNER HANDLERS ---
    const handleBannerFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setBannerFile(file);
            setBannerPreview(URL.createObjectURL(file));
        }
    };

    const handleAddBanner = async (e) => {
        e.preventDefault();
        if (!bannerFile) return addToast("Please select an image", "error");
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('title', bannerForm.title);
        formData.append('subtitle', bannerForm.subtitle);
        formData.append('target_url', bannerForm.target_url);
        formData.append('banner_type', bannerForm.banner_type);
        formData.append('banner_image', bannerFile);

        try {
            // FIX: Pass formData directly, NOT inside curly braces {formData}
            const { data } = await api.post('/admin/banners', formData);
            if (data.success) {
                addToast("Banner uploaded!", "success");
                setIsBannerModalOpen(false);
                setBannerForm({ title: '', subtitle: '', target_url: '', banner_type: 'home' });
                setBannerFile(null);
                setBannerPreview(null);
                fetchData();
            } else {
                addToast(data.message, "error");
            }
        } catch (err) {
            console.error("Upload failed:", err); 
            addToast("Network error uploading banner", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleBanner = async (id) => {
        try {
            await api.put(`/admin/banners/${id}/toggle`);
            setBanners(banners.map(b => b.id === id ? { ...b, is_active: !b.is_active } : b));
        } catch (err) { addToast("Failed to toggle banner", "error"); }
    };

    const requestDelete = (type, id, title, message) => {
        setDeleteModal({ isOpen: true, type, id, title, message });
    };

    // 2. The Execution (The Modal calls this)
    const executeDelete = async () => {
        const { type, id } = deleteModal;
        if (!id || !type) return;
        
        try {
            if (type === 'quote') {
                await api.delete(`/admin/quotes/${id}`);
                setQuotes(quotes.filter(q => q.id !== id));
                addToast("Quote deleted", "success");
            
            } else if (type === 'banner') {
                await api.delete(`/admin/banners/${id}`);
                setBanners(banners.filter(b => b.id !== id));
                addToast("Banner deleted", "success");
            }
            // ... you can add 'song', 'user', etc. here later!
        
        } catch (err) { 
            const errorMessage = err.response?.data?.error || `Failed to delete ${type}`;
            //addToast(`Failed to delete ${type}`, "error"); 
            addToast(errorMessage, "error");
        } finally {
            // Reset the state to close the modal and clear data
            setDeleteModal({ isOpen: false, type: null, id: null, title: '', message: '' });
        }   
    };

    return (
        <div className="animate-fade-in">
            {/* Header & Mini-Navigation */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-text-primary tracking-tight">Site Content</h2>
                    <p className="text-sm text-text-muted mt-1">Manage dynamic homepage elements</p>
                </div>

                <div className="flex bg-background-secondary p-1 rounded-xl">
                    <button 
                        onClick={() => setActiveView('quotes')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-300 ease-in-out ${activeView === 'quotes' ? 'bg-accent-primary text-background-primary shadow-md shadow-accent-primary/20' : 'text-text-secondary hover:text-text-primary'}`}
                    >
                        Quotes
                    </button>
                    <button 
                        onClick={() => setActiveView('banners')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-300 ease-in-out ${activeView === 'banners' ? 'bg-accent-primary text-background-primary shadow-md shadow-accent-primary/20' : 'text-text-secondary hover:text-text-primary'}`}
                    >
                        Hero Banners
                    </button>
                </div>
            </div>

            {/* =========================================
                VIEW: QUOTES
            ========================================= */}
            {activeView === 'quotes' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="flex justify-end">
                        <button onClick={() => openQuoteModal()} className="bg-background-secondary hover:bg-background-hover border border-border hover:border-border-hover text-text-primary px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 ease-in-out">
                            + Add New Quote
                        </button>
                    </div>

                    <div className="bg-background-secondary border border-border rounded-2xl overflow-hidden overflow-x-auto">
                        {isLoading ? <div className="p-8 text-center text-text-muted">Loading quotes...</div> : (
                            <table className="w-full text-left min-w-[600px]">
                                <thead>
                                    <tr className="border-b border-border bg-background-primary/50 text-xs uppercase tracking-widest text-text-muted">
                                        <th className="p-4 font-bold w-1/2">Quote</th>
                                        <th className="p-4 font-bold">Author/Anime</th>
                                        <th className="p-4 font-bold text-center">Active</th>
                                        <th className="p-4 font-bold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {quotes.map(q => (
                                        <tr key={q.id} className="hover:bg-background-hover group transition-colors duration-300 ease-in-out">
                                            <td className="p-4 text-sm text-text-primary italic">
                                                "{q.quote_text}"
                                                {q.quote_type === 'special' && (
                                                    <span className="ml-2 px-2 py-0.5 bg-accent-secondary/20 text-accent-secondary text-[10px] uppercase rounded-full border border-accent-secondary/30 font-bold tracking-wider">Special</span>
                                                )}
                                            </td>
                                            <td className="p-4 text-sm">
                                                <div className="font-bold text-text-primary">{q.author}</div>
                                                <div className="text-text-secondary">{q.anime || '-'}</div>
                                            </td>
                                            <td className="p-4 text-center">
                                                <button onClick={() => toggleQuote(q.id)} className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${q.is_active ? 'bg-success/20 text-success hover:bg-success/30' : 'bg-error/20 text-error hover:bg-error/30'}`}>
                                                    {q.is_active ? 'Visible' : 'Hidden'}
                                                </button>
                                            </td>
                                            <td className="p-4 text-right">
                                                <button onClick={() => openQuoteModal(q)} className="text-text-muted hover:text-accent-primary p-2 transition-colors">✎</button>
                                                <button onClick={() => requestDelete('quote', q.id, "Delete Quote", "Delete this quote forever?")} className="text-text-muted hover:text-error p-2 transition-colors">✕</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            )}

            {/* =========================================
                VIEW: BANNERS
            ========================================= */}
            {activeView === 'banners' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="flex justify-end">
                        <button onClick={() => setIsBannerModalOpen(true)} className="bg-background-secondary hover:bg-background-hover border border-border hover:border-border-hover text-text-primary px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 ease-in-out">
                            + Upload Banner
                        </button>
                    </div>

                    {isLoading ? <div className="p-8 text-center text-text-muted">Loading banners...</div> : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {banners.map(b => (
                                <div key={b.id} className="bg-background-secondary border border-border hover:border-border-hover rounded-2xl overflow-hidden group transition-all duration-300 ease-in-out">
                                    <div className="h-48 relative overflow-hidden bg-background-primary">
                                        <img src={getMediaUrl(b.image_path)} alt="Banner" className={`w-full h-full object-cover transition-all duration-500 ease-in-out ${!b.is_active && 'opacity-30 grayscale'}`} />
                                        
                                        <div className="absolute top-4 left-4">
                                            <button onClick={() => toggleBanner(b.id)} className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md transition-colors ${b.is_active ? 'bg-success/80 text-background-primary hover:bg-success' : 'bg-error/80 text-background-primary hover:bg-error'}`}>
                                                {b.is_active ? 'Live on Site' : 'Hidden'}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-4 flex flex-col sm:flex-row justify-between items-start gap-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="px-2 py-0.5 bg-background-primary text-text-muted text-[10px] uppercase rounded border border-border font-bold tracking-wider">{b.banner_type}</span>
                                                <h4 className="font-bold text-text-primary">{b.title || 'Untitled Banner'}</h4>
                                            </div>
                                            <p className="text-xs text-text-secondary mb-1">{b.subtitle || 'No subtitle'}</p>
                                            <p className="text-xs text-text-muted truncate max-w-[200px]">{b.target_url || 'No link'}</p>
                                        </div>
                                        <button onClick= {() => requestDelete('banner', b.id, "Delete Banner", "Delete this banner? The image file will also be permanently removed from the cloud.")} className="text-text-muted hover:text-error p-2 transition-colors shrink-0">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* --- QUOTE MODAL --- */}
            {isQuoteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background-primary/90 backdrop-blur-sm p-4 animate-fade-in">
                    <form onSubmit={handleSaveQuote} className="bg-background-secondary border border-border rounded-2xl w-full max-w-md p-6 flex flex-col gap-4 shadow-2xl">
                        <h3 className="font-bold text-lg text-text-primary mb-2">{editingQuoteId ? 'Edit Quote' : 'Add New Quote'}</h3>
                        
                        <textarea required placeholder="Quote text..." value={quoteForm.quote_text} onChange={e => setQuoteForm({...quoteForm, quote_text: e.target.value})} className="w-full bg-background-primary border border-border rounded-lg p-3 text-sm text-text-primary focus:border-accent-primary outline-none transition-colors" rows="3" />
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input required type="text" placeholder="Author" value={quoteForm.author} onChange={e => setQuoteForm({...quoteForm, author: e.target.value})} className="bg-background-primary border border-border rounded-lg p-3 text-sm text-text-primary focus:border-accent-primary outline-none transition-colors" />
                            <input type="text" placeholder="Anime (Optional)" value={quoteForm.anime} onChange={e => setQuoteForm({...quoteForm, anime: e.target.value})} className="bg-background-primary border border-border rounded-lg p-3 text-sm text-text-primary focus:border-accent-primary outline-none transition-colors" />
                        </div>

                        <select value={quoteForm.quote_type} onChange={e => setQuoteForm({...quoteForm, quote_type: e.target.value})} className="w-full bg-background-primary border border-border rounded-lg p-3 text-sm text-text-primary focus:border-accent-primary outline-none appearance-none transition-colors">
                            <option value="normal">Normal Display</option>
                            <option value="special">Special Featured</option>
                        </select>

                        <div className="flex gap-4 mt-4">
                            <button type="button" onClick={() => setIsQuoteModalOpen(false)} className="flex-1 py-3 rounded-xl font-bold text-text-secondary hover:text-text-primary hover:bg-background-hover transition-colors">Cancel</button>
                            <button type="submit" disabled={isSubmitting} className="flex-1 bg-accent-primary text-background-primary py-3 rounded-xl font-bold hover:bg-accent-hover transition-colors shadow-lg shadow-accent-primary/20">{isSubmitting ? 'Saving...' : (editingQuoteId ? 'Update' : 'Save')}</button>
                        </div>
                    </form>
                </div>
            )}

            {/* --- BANNER MODAL --- */}
            {isBannerModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background-primary/90 backdrop-blur-sm p-4 animate-fade-in">
                    <form onSubmit={handleAddBanner} className="bg-background-secondary border border-border rounded-2xl w-full max-w-md p-6 flex flex-col gap-4 shadow-2xl">
                        <h3 className="font-bold text-lg text-text-primary mb-2">Upload Hero Banner</h3>
                        
                        <div 
                            onClick={() => bannerInputRef.current?.click()}
                            className="w-full h-32 bg-background-primary border-2 border-dashed border-border rounded-xl flex items-center justify-center cursor-pointer hover:border-accent-primary overflow-hidden relative transition-colors"
                        >
                            {bannerPreview ? (
                                <img src={bannerPreview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-sm text-text-muted">Click to select wide image</span>
                            )}
                        </div>
                        <input type="file" ref={bannerInputRef} onChange={handleBannerFileChange} accept="image/*" className="hidden" />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input type="text" placeholder="Title (Optional)" value={bannerForm.title} onChange={e => setBannerForm({...bannerForm, title: e.target.value})} className="bg-background-primary border border-border rounded-lg p-3 text-sm text-text-primary focus:border-accent-primary outline-none transition-colors" />
                            <select value={bannerForm.banner_type} onChange={e => setBannerForm({...bannerForm, banner_type: e.target.value})} className="bg-background-primary border border-border rounded-lg p-3 text-sm text-text-primary focus:border-accent-primary outline-none appearance-none transition-colors">
                                <option value="home">Home Carousel</option>
                                <option value="category">Category Header</option>
                            </select>
                        </div>

                        <input type="text" placeholder="Subtitle (Optional)" value={bannerForm.subtitle} onChange={e => setBannerForm({...bannerForm, subtitle: e.target.value})} className="bg-background-primary border border-border rounded-lg p-3 text-sm text-text-primary focus:border-accent-primary outline-none transition-colors" />
                        <input type="text" placeholder="Target URL (e.g. /song/12)" value={bannerForm.target_url} onChange={e => setBannerForm({...bannerForm, target_url: e.target.value})} className="bg-background-primary border border-border rounded-lg p-3 text-sm text-text-primary focus:border-accent-primary outline-none transition-colors" />
                        
                        <div className="flex gap-4 mt-4">
                            <button type="button" onClick={() => setIsBannerModalOpen(false)} className="flex-1 py-3 rounded-xl font-bold text-text-secondary hover:text-text-primary hover:bg-background-hover transition-colors">Cancel</button>
                            <button type="submit" disabled={isSubmitting} className="flex-1 bg-accent-primary text-background-primary py-3 rounded-xl font-bold hover:bg-accent-hover transition-colors shadow-lg shadow-accent-primary/20">{isSubmitting ? 'Uploading...' : 'Upload'}</button>
                        </div>
                    </form>
                </div>
            )}
            <ConfirmDialog 
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
                onConfirm={executeDelete}
                title={deleteModal.title}
                message={deleteModal.message}
                confirmText="Delete"
                isDestructive={true} 
            />
        </div>
    );
};

export default SiteContentManager;