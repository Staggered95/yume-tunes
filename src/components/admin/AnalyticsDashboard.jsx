import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const AnalyticsDashboard = () => {
    const { authFetch } = useAuth();
    const { addToast } = useToast();

    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await authFetch('/admin/analytics/dashboard');
                const json = await res.json();
                if (json.success) {
                    setStats(json.data);
                } else {
                    addToast("Failed to load analytics", "error");
                }
            } catch (err) {
                addToast("Network error loading analytics", "error");
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (isLoading) {
        return <div className="animate-pulse text-white/40 p-8">Loading dashboard metrics...</div>;
    }

    if (!stats) return null;

    // Calculate the max plays to scale the CSS bar chart correctly
    const maxPlays = stats.topSongs.length > 0 ? Math.max(...stats.topSongs.map(s => parseInt(s.play_count))) : 1;

    return (
        <div className="animate-fade-in space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Platform Analytics</h2>
                <p className="text-sm text-white/40 mt-1">Real-time overview of YumeTunes telemetry</p>
            </div>

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col justify-center">
                    <span className="text-white/40 text-sm font-bold uppercase tracking-widest mb-2">Total Users</span>
                    <span className="text-4xl font-black text-white">{stats.totalUsers.toLocaleString()}</span>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col justify-center">
                    <span className="text-white/40 text-sm font-bold uppercase tracking-widest mb-2">Library Size</span>
                    <span className="text-4xl font-black text-white">{stats.totalSongs.toLocaleString()}</span>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col justify-center">
                    <span className="text-white/40 text-sm font-bold uppercase tracking-widest mb-2">Active Quotes</span>
                    <span className="text-4xl font-black text-white">{stats.activeQuotes.toLocaleString()}</span>
                </div>
            </div>

            {/* Custom CSS Bar Chart for Top Songs */}
            <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-6">Top 5 Most Played Songs</h3>
                
                {stats.topSongs.length === 0 ? (
                    <p className="text-white/40 text-sm">Not enough listening history yet.</p>
                ) : (
                    <div className="space-y-6">
                        {stats.topSongs.map((song, index) => {
                            const plays = parseInt(song.play_count);
                            // Ensure the bar has at least a 5% width so it's visible even with 0 plays
                            const widthPercent = Math.max((plays / maxPlays) * 100, 5); 

                            return (
                                <div key={song.id} className="relative">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="font-bold text-white/90">
                                            {index + 1}. {song.title} <span className="text-white/40 font-normal ml-1">by {song.artist}</span>
                                        </span>
                                        <span className="text-accent-primary font-mono">{plays.toLocaleString()} plays</span>
                                    </div>
                                    {/* Background Track */}
                                    <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden">
                                        {/* Filled Bar */}
                                        <div 
                                            className="h-full bg-gradient-to-r from-purple-600 to-accent-primary rounded-full transition-all duration-1000 ease-out"
                                            style={{ width: `${widthPercent}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnalyticsDashboard;