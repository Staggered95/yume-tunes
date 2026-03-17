import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import api from '../../api/axios'; 

const AnalyticsDashboard = () => {
    const { addToast } = useToast();

    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/admin/analytics/dashboard');
                if (data.success) {
                    setStats(data.data);
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
    }, [addToast]);

    if (isLoading) {
        return <div className="animate-pulse text-text-muted p-8 text-center md:text-left">Loading dashboard metrics...</div>;
    }

    if (!stats) return null;

    // Calculate the max plays to scale the CSS bar chart correctly
    const maxPlays = stats.topSongs.length > 0 ? Math.max(...stats.topSongs.map(s => parseInt(s.play_count))) : 1;

    return (
        <div className="animate-fade-in space-y-8">
            <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-text-primary tracking-tight">Platform Analytics</h2>
                <p className="text-sm text-text-secondary mt-1">Real-time overview of YumeTunes telemetry</p>
            </div>

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div className="bg-background-secondary border border-border rounded-2xl p-6 flex flex-col justify-center items-center md:items-start hover:bg-background-hover hover:border-border-hover transition-all duration-300 ease-in-out">
                    <span className="text-text-secondary text-sm font-bold uppercase tracking-widest mb-2">Total Users</span>
                    <span className="text-4xl font-black text-text-primary">{stats.totalUsers.toLocaleString()}</span>
                </div>
                <div className="bg-background-secondary border border-border rounded-2xl p-6 flex flex-col justify-center items-center md:items-start hover:bg-background-hover hover:border-border-hover transition-all duration-300 ease-in-out">
                    <span className="text-text-secondary text-sm font-bold uppercase tracking-widest mb-2">Library Size</span>
                    <span className="text-4xl font-black text-text-primary">{stats.totalSongs.toLocaleString()}</span>
                </div>
                <div className="bg-background-secondary border border-border rounded-2xl p-6 flex flex-col justify-center items-center md:items-start hover:bg-background-hover hover:border-border-hover transition-all duration-300 ease-in-out">
                    <span className="text-text-secondary text-sm font-bold uppercase tracking-widest mb-2">Active Quotes</span>
                    <span className="text-4xl font-black text-text-primary">{stats.activeQuotes.toLocaleString()}</span>
                </div>
            </div>

            {/* Custom CSS Bar Chart for Top Songs */}
            <div className="bg-background-secondary border border-border rounded-2xl p-6 hover:border-border-hover transition-all duration-300 ease-in-out">
                <h3 className="text-lg font-bold text-text-primary mb-6 text-center md:text-left">Top 5 Most Played Songs</h3>
                
                {stats.topSongs.length === 0 ? (
                    <p className="text-text-secondary text-sm text-center md:text-left">Not enough listening history yet.</p>
                ) : (
                    <div className="space-y-6">
                        {stats.topSongs.map((song, index) => {
                            const plays = parseInt(song.play_count);
                            const widthPercent = Math.max((plays / maxPlays) * 100, 5); 

                            return (
                                <div key={song.id} className="relative group">
                                    <div className="flex flex-col sm:flex-row justify-between text-sm mb-2 gap-1 sm:gap-0">
                                        <span className="font-bold text-text-primary truncate">
                                            {index + 1}. {song.title} <span className="text-text-secondary font-normal ml-1">by {song.artist}</span>
                                        </span>
                                        <span className="text-accent-primary font-mono shrink-0">{plays.toLocaleString()} plays</span>
                                    </div>
                                    {/* Background Track */}
                                    <div className="w-full h-3 bg-background-primary rounded-full overflow-hidden">
                                        {/*Gradient Filled Bar*/}
                                        <div 
                                            className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full transition-all duration-1000 ease-out opacity-80 group-hover:opacity-100"
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