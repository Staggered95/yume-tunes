import React, { useState, useEffect } from 'react';
import api from '../../api/axios'; // Native Axios import
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getMediaUrl } from '../../utils/media';

const UserManager = () => {
    const { user } = useAuth(); // Only grabbing 'user' now, authFetch is gone!
    const { addToast } = useToast();

    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            // Axios automatically handles the headers and JSON parsing
            const { data } = await api.get('/admin/users');
            if (data.success) {
                setUsers(data.data);
            } else {
                addToast("Failed to fetch users", "error");
            }
        } catch (err) {
            addToast("Network error fetching users", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            // Axios automatically stringifies the body!
            const { data } = await api.put(`/admin/users/${userId}/role`, { newRole });

            if (data.success) {
                addToast("Role updated successfully!", "success");
                // Update local state so UI reflects the change instantly
                setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
            } else {
                addToast(data.message || "Failed to update role", "error");
            }
        } catch (err) {
            addToast("Network error updating role", "error");
        }
    };

    // Local Search Filter
    const filteredUsers = users.filter(u => {
        const query = searchQuery.toLowerCase();
        return (
            u.username?.toLowerCase().includes(query) || 
            u.email?.toLowerCase().includes(query)
        );
    });

    return (
        <div className="animate-fade-in">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-text-primary tracking-tight">User Management</h2>
                    <p className="text-sm text-text-muted mt-1">Manage accounts and elevate permissions</p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-64 shrink-0">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input 
                        type="text" 
                        placeholder="Search users..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-background-secondary border border-border rounded-full py-2 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-all duration-300 ease-in-out shadow-sm focus:shadow-accent-primary/20"
                    />
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-background-secondary border border-border rounded-2xl overflow-hidden shadow-xl transition-all duration-300">
                {isLoading ? (
                    <div className="p-12 text-center text-text-muted animate-pulse">Loading users...</div>
                ) : filteredUsers.length === 0 ? (
                    <div className="p-12 text-center text-text-muted">No users found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr className="border-b border-border bg-background-primary/50 text-xs uppercase tracking-widest text-text-muted">
                                    <th className="p-4 font-bold">User</th>
                                    <th className="p-4 font-bold">Email</th>
                                    <th className="p-4 font-bold">Joined</th>
                                    <th className="p-4 font-bold text-right">Role</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {/* Using slice(0, 50) to prevent laptop fan takeoff! */}
                                {filteredUsers.slice(0, 50).map(u => (
                                    <tr key={u.id} className="hover:bg-background-hover transition-colors duration-300 ease-in-out group">
                                        
                                        <td className="p-4 flex items-center gap-4 min-w-[200px]">
                                            {/* Profile Picture / Avatar Wrapper */}
                                            <div className="w-8 h-8 rounded-full shrink-0 overflow-hidden bg-background-primary border border-border flex items-center justify-center text-background-primary font-bold text-xs">
                                                {u.user_image ? (
                                                    <img 
                                                        src={getMediaUrl(u.user_image)} 
                                                        alt={`${u.username} avatar`} 
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-tr from-accent-primary to-accent-secondary flex items-center justify-center">
                                                        {u.username.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <span className="font-bold text-text-primary truncate">{u.username}</span>
                                        </td>
                                        
                                        <td className="p-4 text-sm text-text-secondary truncate max-w-[200px]">
                                            {u.email}
                                        </td>
                                        
                                        <td className="p-4 text-sm text-text-secondary whitespace-nowrap">
                                            {new Date(u.created_at).toLocaleDateString()}
                                        </td>
                                        
                                        <td className="p-4 text-right">
                                            <select 
                                                value={u.role || 'user'}
                                                onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                                disabled={user?.id === u.id} // Disable changing own role
                                                className={`bg-background-primary border rounded-lg px-3 py-1.5 text-sm focus:border-accent-primary focus:outline-none transition-all duration-300 appearance-none text-center cursor-pointer shadow-sm ${
                                                    u.role === 'admin' ? 'text-error border-error/30 bg-error/5' : 
                                                    u.role === 'moderator' ? 'text-accent-primary border-accent-primary/30 bg-accent-primary/5' : 
                                                    'text-text-secondary border-border hover:border-border-hover'
                                                } ${user?.id === u.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                <option value="user" className="text-text-primary bg-background-secondary">User</option>
                                                <option value="moderator" className="text-text-primary bg-background-secondary">Moderator</option>
                                                <option value="admin" className="text-text-primary bg-background-secondary">Admin</option>
                                            </select>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManager;