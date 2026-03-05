import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const SiteContentManager = () => {
    const { authFetch } = useAuth();
    const { addToast } = useToast();

    const [activeView, setActiveView] = useState('quotes'); 
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- DATA STATES ---
    const [quotes, setQuotes] = useState([]);
    const [banners, setBanners] = useState([]);

    // --- QUOTE FORM STATES ---
    const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
    const [editingQuoteId, setEditingQuoteId] = useState(null); // Track if editing
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
            const res = await authFetch(endpoint);
            const json = await res.json();
            if (json.success) {
                activeView === 'quotes' ? setQuotes(json.data) : setBanners(json.data);
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
        
        const url = editingQuoteId ? `/admin/quotes/${editingQuoteId}` : '/admin/quotes';
        const method = editingQuoteId ? 'PUT' : 'POST';

        try {
            const res = await authFetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(quoteForm)
            });
            const json = await res.json();
            
            if (json.success) {
                addToast(`Quote ${editingQuoteId ? 'updated' : 'added'}!`, "success");
                setIsQuoteModalOpen(false);
                fetchData();
            } else {
                addToast(json.message, "error");
            }
        } catch (err) {
            addToast("Network error", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleQuote = async (id) => {
        try {
            await authFetch(`/admin/quotes/${id}/toggle`, { method: 'PUT' });
            setQuotes(quotes.map(q => q.id === id ? { ...q, is_active: !q.is_active } : q));
        } catch (err) { addToast("Failed to toggle quote", "error"); }
    };

    const deleteQuote = async (id) => {
        if (!window.confirm("Delete this quote forever?")) return;
        try {
            await authFetch(`/admin/quotes/${id}`, { method: 'DELETE' });
            setQuotes(quotes.filter(q => q.id !== id));
            addToast("Quote deleted", "success");
        } catch (err) { addToast("Failed to delete quote", "error"); }
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
            const res = await authFetch('/admin/banners', {
                method: 'POST',
                body: formData 
            });
            const json = await res.json();
            if (json.success) {
                addToast("Banner uploaded!", "success");
                setIsBannerModalOpen(false);
                setBannerForm({ title: '', subtitle: '', target_url: '', banner_type: 'home' });
                setBannerFile(null);
                setBannerPreview(null);
                fetchData();
            } else {
                addToast(json.message, "error");
            }
        } catch (err) {
            addToast("Network error", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleBanner = async (id) => {
        try {
            await authFetch(`/admin/banners/${id}/toggle`, { method: 'PUT' });
            setBanners(banners.map(b => b.id === id ? { ...b, is_active: !b.is_active } : b));
        } catch (err) { addToast("Failed to toggle banner", "error"); }
    };

    const deleteBanner = async (id) => {
        if (!window.confirm("Delete this banner? The image file will also be removed.")) return;
        try {
            await authFetch(`/admin/banners/${id}`, { method: 'DELETE' });
            setBanners(banners.filter(b => b.id !== id));
            addToast("Banner deleted", "success");
        } catch (err) { addToast("Failed to delete banner", "error"); }
    };

    return (
        <div className="animate-fade-in">
            {/* Header & Mini-Navigation */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Site Content</h2>
                    <p className="text-sm text-white/40 mt-1">Manage dynamic homepage elements</p>
                </div>

                <div className="flex bg-white/5 p-1 rounded-xl">
                    <button 
                        onClick={() => setActiveView('quotes')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-colors ${activeView === 'quotes' ? 'bg-accent-primary text-black' : 'text-white/50 hover:text-white'}`}
                    >
                        Quotes
                    </button>
                    <button 
                        onClick={() => setActiveView('banners')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-colors ${activeView === 'banners' ? 'bg-accent-primary text-black' : 'text-white/50 hover:text-white'}`}
                    >
                        Hero Banners
                    </button>
                </div>
            </div>

            {/* =========================================
                VIEW: QUOTES
            ========================================= */}
            {activeView === 'quotes' && (
                <div className="space-y-6">
                    <div className="flex justify-end">
                        <button onClick={() => openQuoteModal()} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                            + Add New Quote
                        </button>
                    </div>

                    <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
                        {isLoading ? <div className="p-8 text-center text-white/40">Loading quotes...</div> : (
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/5 bg-white/5 text-xs uppercase tracking-widest text-white/40">
                                        <th className="p-4 font-bold w-1/2">Quote</th>
                                        <th className="p-4 font-bold">Author/Anime</th>
                                        <th className="p-4 font-bold text-center">Active</th>
                                        <th className="p-4 font-bold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {quotes.map(q => (
                                        <tr key={q.id} className="hover:bg-white/5 group transition-colors">
                                            <td className="p-4 text-sm text-white/90 italic">
                                                "{q.quote_text}"
                                                {q.quote_type === 'special' && (
                                                    <span className="ml-2 px-2 py-0.5 bg-purple-500/20 text-purple-400 text-[10px] uppercase rounded-full border border-purple-500/30">Special</span>
                                                )}
                                            </td>
                                            <td className="p-4 text-sm">
                                                <div className="font-bold text-white">{q.author}</div>
                                                <div className="text-white/40">{q.anime || '-'}</div>
                                            </td>
                                            <td className="p-4 text-center">
                                                <button onClick={() => toggleQuote(q.id)} className={`px-3 py-1 rounded-full text-xs font-bold ${q.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                                    {q.is_active ? 'Visible' : 'Hidden'}
                                                </button>
                                            </td>
                                            <td className="p-4 text-right">
                                                <button onClick={() => openQuoteModal(q)} className="text-white/40 hover:text-accent-primary p-2">✎</button>
                                                <button onClick={() => deleteQuote(q.id)} className="text-white/40 hover:text-rose-400 p-2">✕</button>
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
                <div className="space-y-6">
                    <div className="flex justify-end">
                        <button onClick={() => setIsBannerModalOpen(true)} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                            + Upload Banner
                        </button>
                    </div>

                    {isLoading ? <div className="p-8 text-center text-white/40">Loading banners...</div> : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {banners.map(b => (
                                <div key={b.id} className="bg-black/40 border border-white/5 rounded-2xl overflow-hidden group">
                                    <div className="h-48 relative overflow-hidden bg-white/5">
                                        <img src={`http://localhost:5000${b.image_path}`} alt="Banner" className={`w-full h-full object-cover transition-all ${!b.is_active && 'opacity-30 grayscale'}`} />
                                        
                                        <div className="absolute top-4 left-4">
                                            <button onClick={() => toggleBanner(b.id)} className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md ${b.is_active ? 'bg-emerald-500/80 text-white' : 'bg-rose-500/80 text-white'}`}>
                                                {b.is_active ? 'Live on Site' : 'Hidden'}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-4 flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="px-2 py-0.5 bg-white/10 text-white/60 text-[10px] uppercase rounded border border-white/5">{b.banner_type}</span>
                                                <h4 className="font-bold text-white">{b.title || 'Untitled Banner'}</h4>
                                            </div>
                                            <p className="text-xs text-white/60 mb-1">{b.subtitle || 'No subtitle'}</p>
                                            <p className="text-xs text-white/40">{b.target_url || 'No link'}</p>
                                        </div>
                                        <button onClick={() => deleteBanner(b.id)} className="text-white/40 hover:text-rose-400 p-2">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* --- QUOTE MODAL --- */}
            {isQuoteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
                    <form onSubmit={handleSaveQuote} className="bg-background-secondary border border-white/10 rounded-2xl w-full max-w-md p-6 flex flex-col gap-4">
                        <h3 className="font-bold text-lg text-white mb-2">{editingQuoteId ? 'Edit Quote' : 'Add New Quote'}</h3>
                        
                        <textarea required placeholder="Quote text..." value={quoteForm.quote_text} onChange={e => setQuoteForm({...quoteForm, quote_text: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-accent-primary outline-none" rows="3" />
                        
                        <div className="grid grid-cols-2 gap-4">
                            <input required type="text" placeholder="Author" value={quoteForm.author} onChange={e => setQuoteForm({...quoteForm, author: e.target.value})} className="bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-accent-primary outline-none" />
                            <input type="text" placeholder="Anime (Optional)" value={quoteForm.anime} onChange={e => setQuoteForm({...quoteForm, anime: e.target.value})} className="bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-accent-primary outline-none" />
                        </div>

                        {/* NEW: Quote Type Select */}
                        <select value={quoteForm.quote_type} onChange={e => setQuoteForm({...quoteForm, quote_type: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-accent-primary outline-none appearance-none">
                            <option value="normal">Normal Display</option>
                            <option value="special">Special Featured</option>
                        </select>

                        <div className="flex gap-4 mt-4">
                            <button type="button" onClick={() => setIsQuoteModalOpen(false)} className="flex-1 py-3 rounded-xl font-bold text-white/50 hover:text-white hover:bg-white/5">Cancel</button>
                            <button type="submit" disabled={isSubmitting} className="flex-1 bg-accent-primary text-black py-3 rounded-xl font-bold hover:bg-accent-hover">{isSubmitting ? 'Saving...' : (editingQuoteId ? 'Update Quote' : 'Save Quote')}</button>
                        </div>
                    </form>
                </div>
            )}

            {/* --- BANNER MODAL --- */}
            {isBannerModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
                    <form onSubmit={handleAddBanner} className="bg-background-secondary border border-white/10 rounded-2xl w-full max-w-md p-6 flex flex-col gap-4">
                        <h3 className="font-bold text-lg text-white mb-2">Upload Hero Banner</h3>
                        
                        <div 
                            onClick={() => bannerInputRef.current?.click()}
                            className="w-full h-32 bg-black/40 border-2 border-dashed border-white/20 rounded-xl flex items-center justify-center cursor-pointer hover:border-accent-primary overflow-hidden relative"
                        >
                            {bannerPreview ? (
                                <img src={bannerPreview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-sm text-white/50">Click to select wide image</span>
                            )}
                        </div>
                        <input type="file" ref={bannerInputRef} onChange={handleBannerFileChange} accept="image/*" className="hidden" />

                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" placeholder="Title (Optional)" value={bannerForm.title} onChange={e => setBannerForm({...bannerForm, title: e.target.value})} className="bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-accent-primary outline-none" />
                            {/* NEW: Banner Type Select */}
                            <select value={bannerForm.banner_type} onChange={e => setBannerForm({...bannerForm, banner_type: e.target.value})} className="bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-accent-primary outline-none appearance-none">
                                <option value="home">Home Carousel</option>
                                <option value="category">Category Header</option>
                            </select>
                        </div>

                        {/* NEW: Subtitle Input */}
                        <input type="text" placeholder="Subtitle (Optional)" value={bannerForm.subtitle} onChange={e => setBannerForm({...bannerForm, subtitle: e.target.value})} className="bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-accent-primary outline-none" />
                        <input type="text" placeholder="Target URL (e.g. /song/12)" value={bannerForm.target_url} onChange={e => setBannerForm({...bannerForm, target_url: e.target.value})} className="bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-accent-primary outline-none" />
                        
                        <div className="flex gap-4 mt-4">
                            <button type="button" onClick={() => setIsBannerModalOpen(false)} className="flex-1 py-3 rounded-xl font-bold text-white/50 hover:text-white hover:bg-white/5">Cancel</button>
                            <button type="submit" disabled={isSubmitting} className="flex-1 bg-accent-primary text-black py-3 rounded-xl font-bold hover:bg-accent-hover">{isSubmitting ? 'Uploading...' : 'Upload Banner'}</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default SiteContentManager;