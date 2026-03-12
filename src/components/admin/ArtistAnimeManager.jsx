import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import api from '../../api/axios';
import ConfirmDialog from '../../minicomps/ConfirmDialog';

const ArtistAnimeManager = () => {
    const { addToast } = useToast();
    
    // Core Data State
    const [activeTab, setActiveTab] = useState('artists');
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // --- NEW: Search State ---
    const [searchQuery, setSearchQuery] = useState('');

    // Edit Modal State
    const [editingItem, setEditingItem] = useState(null);
    const [editName, setEditName] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // --- NEW: Delete Confirmation State ---
    const [deleteMeta, setDeleteMeta] = useState({ isOpen: false, id: null, name: '' });

    useEffect(() => {
        fetchData();
        setSearchQuery(''); // Reset search when switching tabs for better UX
    }, [activeTab]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const endpoint = activeTab === 'artists' ? '/admin/artists' : '/admin/animes';
            const response = await api.get(endpoint);
            
            if (response.data.success) {
                setData(response.data.data);
            } else {
                addToast(`Failed to load ${activeTab}`, "error");
            }
        } catch (error) {
            addToast(`Network error loading ${activeTab}`, "error");
        } finally {
            setIsLoading(false);
        }
    };

    // --- NEW: Derived State for Filtering ---
    const filteredData = data.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // --- NEW: Trigger the Confirm Dialog ---
    const handleDeleteClick = (id, name) => {
        setDeleteMeta({ isOpen: true, id, name });
    };

    // --- NEW: Execute the Actual Deletion ---
    const confirmDelete = async () => {
        const { id, name } = deleteMeta;
        try {
            const endpoint = activeTab === 'artists' ? `/admin/artists/${id}` : `/admin/animes/${id}`;
            const response = await api.delete(endpoint);
            
            if (response.data.success) {
                addToast(`${name} deleted!`, "success");
                setData(data.filter(item => item.id !== id)); 
            } else {
                addToast(response.data.message || "Delete failed", "error");
            }
        } catch (error) {
            addToast(error.response?.data?.message || "Cannot delete: Make sure no songs are linked to this item.", "error");
        }
        // Close modal is handled by the ConfirmDialog component!
    };

    const handleEditClick = (item) => {
        setEditingItem(item);
        setEditName(item.name);
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        if (!editName.trim()) return addToast("Name cannot be empty", "warning");
        
        setIsSaving(true);
        try {
            const endpoint = activeTab === 'artists' ? `/admin/artists/${editingItem.id}` : `/admin/animes/${editingItem.id}`;
            const response = await api.put(endpoint, { name: editName.trim() });
            
            if (response.data.success) {
                addToast("Updated successfully!", "success");
                setData(data.map(item => item.id === editingItem.id ? { ...item, name: editName.trim() } : item));
                setEditingItem(null);
            } else {
                addToast(response.data.message || "Update failed", "error");
            }
        } catch (error) {
            addToast(error.response?.data?.message || "Error updating item", "error");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="animate-in fade-in space-y-8 relative">
            
            {/* Header & Tabs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-text-primary tracking-tight">Database Entities</h2>
                    <p className="text-sm text-text-secondary mt-1">Manage, clean up, and edit Artists and Anime series.</p>
                </div>

                <div className="flex bg-background-secondary border border-border rounded-xl p-1">
                    <button 
                        onClick={() => setActiveTab('artists')}
                        className={`flex-1 px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'artists' ? 'bg-background-active text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
                    >
                        Artists
                    </button>
                    <button 
                        onClick={() => setActiveTab('animes')}
                        className={`flex-1 px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'animes' ? 'bg-background-active text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
                    >
                        Anime
                    </button>
                </div>
            </div>

            {/* --- NEW: Search Bar --- */}
            <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    type="text"
                    placeholder={`Search ${activeTab}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-background-secondary border border-border rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all shadow-sm placeholder-text-muted"
                />
            </div>

            {/* Data Table */}
            <div className="bg-background-secondary border border-border rounded-2xl overflow-hidden hover:border-border-hover transition-all duration-300">
                {isLoading ? (
                    <div className="p-8 text-center text-text-muted animate-pulse">Loading data...</div>
                ) : data.length === 0 ? (
                    <div className="p-8 text-center text-text-muted">No {activeTab} found in the database.</div>
                ) : filteredData.length === 0 ? (
                    <div className="p-8 text-center text-text-muted">No results found for "{searchQuery}".</div>
                ) : (
                    <div className="overflow-x-auto max-h-[600px] overflow-y-auto scrollbar-none">
                        <table className="w-full text-left border-collapse relative">
                            <thead className="sticky top-0 z-10 bg-background-secondary border-b border-border shadow-sm">
                                <tr>
                                    <th className="p-4 text-xs font-black uppercase tracking-widest text-text-muted">ID</th>
                                    <th className="p-4 text-xs font-black uppercase tracking-widest text-text-muted">Name</th>
                                    <th className="p-4 text-xs font-black uppercase tracking-widest text-text-muted text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {filteredData.map((item) => (
                                    <tr key={item.id} className="hover:bg-background-active/30 transition-colors group">
                                        <td className="p-4 text-sm font-mono text-text-muted w-16">{item.id}</td>
                                        <td className="p-4 text-sm font-bold text-text-primary">{item.name}</td>
                                        <td className="p-4 flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => handleEditClick(item)}
                                                className="px-3 py-1.5 rounded-lg text-xs font-bold text-text-secondary bg-background-primary border border-border hover:text-accent-primary hover:border-accent-primary transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteClick(item.id, item.name)}
                                                className="px-3 py-1.5 rounded-lg text-xs font-bold text-error bg-error/10 border border-transparent hover:border-error/30 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* The Edit Modal Overlay */}
            {editingItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-background-secondary border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-black text-text-primary mb-4">
                            Edit {activeTab === 'artists' ? 'Artist' : 'Anime'}
                        </h3>
                        <form onSubmit={handleSaveEdit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-text-muted mb-1">Name / Title</label>
                                    <input 
                                        type="text" 
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="w-full bg-background-primary border border-border rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all"
                                        autoFocus
                                    />
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-end gap-3 mt-8">
                                <button 
                                    type="button"
                                    onClick={() => setEditingItem(null)}
                                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-text-secondary hover:bg-background-hover transition-colors"
                                    disabled={isSaving}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="px-5 py-2.5 rounded-xl text-sm font-black text-background-primary bg-accent-primary hover:bg-accent-hover transition-colors shadow-lg shadow-accent-primary/20 flex items-center gap-2"
                                    disabled={isSaving}
                                >
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- NEW: The Confirm Dialog --- */}
            <ConfirmDialog 
                isOpen={deleteMeta.isOpen}
                onClose={() => setDeleteMeta({ isOpen: false, id: null, name: '' })}
                onConfirm={confirmDelete}
                title={`Delete ${activeTab === 'artists' ? 'Artist' : 'Anime'}`}
                message={`Are you sure you want to permanently delete "${deleteMeta.name}"? This action cannot be undone and will fail if songs are still linked.`}
                confirmText="Delete"
                cancelText="Cancel"
                isDestructive={true}
            />

        </div>
    );
};

export default ArtistAnimeManager;