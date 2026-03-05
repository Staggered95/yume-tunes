import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const UserManager = () => {
    const { authFetch, user } = useAuth(); // Assuming 'user' holds the currently logged-in user
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
            const res = await authFetch('/admin/users');
            const json = await res.json();
            if (json.success) {
                setUsers(json.data);
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
            const res = await authFetch(`/admin/users/${userId}/role`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newRole })
            });
            const json = await res.json();

            if (json.success) {
                addToast("Role updated successfully!", "success");
                // Update local state so UI reflects the change instantly
                setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
            } else {
                addToast(json.message || "Failed to update role", "error");
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
                    <h2 className="text-2xl font-bold text-white tracking-tight">User Management</h2>
                    <p className="text-sm text-white/40 mt-1">Manage accounts and elevate permissions</p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-64">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input 
                        type="text" 
                        placeholder="Search users..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-accent-primary focus:bg-white/10 transition-colors"
                    />
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
                {isLoading ? (
                    <div className="p-12 text-center text-white/40 animate-pulse">Loading users...</div>
                ) : filteredUsers.length === 0 ? (
                    <div className="p-12 text-center text-white/40">No users found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/5 text-xs uppercase tracking-widest text-white/40">
                                    <th className="p-4 font-bold">User</th>
                                    <th className="p-4 font-bold">Email</th>
                                    <th className="p-4 font-bold">Joined</th>
                                    <th className="p-4 font-bold text-right">Role</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {/* Using slice(0, 50) to prevent laptop fan takeoff! */}
                                {filteredUsers.slice(0, 50).map(u => (
                                    <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                                        
                                        <td className="p-4 flex items-center gap-4">
                                            {/* Profile Picture / Avatar Wrapper */}
                                            <div className="w-8 h-8 rounded-full shrink-0 overflow-hidden bg-white/10 flex items-center justify-center text-black font-bold text-xs">
                                                {u.user_image ? (
                                                    <img 
                                                        src={u.user_image.startsWith('http') ? u.user_image : `http://localhost:5000${u.user_image}`} 
                                                        alt={`${u.username} avatar`} 
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-tr from-accent-primary to-purple-500 flex items-center justify-center">
                                                        {u.username.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <span className="font-bold text-white/90">{u.username}</span>
                                        </td>
                                        
                                        <td className="p-4 text-sm text-white/60">
                                            {u.email}
                                        </td>
                                        
                                        <td className="p-4 text-sm text-white/60">
                                            {new Date(u.created_at).toLocaleDateString()}
                                        </td>
                                        
                                        <td className="p-4 text-right">
                                            <select 
                                                value={u.role || 'user'}
                                                onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                                disabled={user?.id === u.id} // Disable changing own role
                                                className={`bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-sm focus:border-accent-primary focus:outline-none transition-colors appearance-none text-center cursor-pointer ${
                                                    u.role === 'admin' ? 'text-rose-400 border-rose-400/30' : 
                                                    u.role === 'moderator' ? 'text-accent-primary border-accent-primary/30' : 
                                                    'text-white/70'
                                                }`}
                                            >
                                                <option value="user">User</option>
                                                <option value="moderator">Moderator</option>
                                                <option value="admin">Admin</option>
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