import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function UserSettings() {
    const { themeFamily, setThemeFamily, themeMode, toggleThemeMode, themeFamilies } = useTheme();

    return (
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12">
            
            {/* Appearance Block */}
            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-border/50 pb-4">
                    <h2 className="text-xs font-black uppercase tracking-[0.4em] text-text-muted italic">Appearance</h2>
                </div>

                {/* Grid layout for settings cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Setting Item 1: Theme Palette */}
                    <div className="space-y-5 border border-border p-6 rounded-3xl bg-background-secondary/20 transition-colors">
                        <div>
                            <h3 className="text-sm font-black tracking-tight text-text-primary mb-1">Theme Palette</h3>
                            <p className="text-xs font-medium text-text-secondary">Select your core brand aesthetic.</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                            {themeFamilies.map((family) => {
                                const isActive = themeFamily === family.id;
                                
                                return (
                                    <button
                                        key={family.id}
                                        onClick={() => setThemeFamily(family.id)}
                                        className={`group relative flex items-center gap-3 p-3 rounded-2xl border transition-all duration-300 overflow-hidden ${
                                            isActive 
                                            ? 'border-border bg-background-active shadow-md' 
                                            : 'border-transparent bg-background-secondary hover:bg-background-hover hover:border-border/50'
                                        }`}
                                    >
                                        {/* The Glowing Color Orb */}
                                        <div 
                                            className={`w-4 h-4 shrink-0 rounded-full shadow-inner transition-all duration-300 ${
                                                isActive ? 'scale-110' : 'group-hover:scale-110'
                                            }`}
                                            style={{ 
                                                backgroundColor: family.color,
                                                boxShadow: isActive ? `0 0 12px ${family.color}80` : 'none' 
                                            }}
                                        />
                                        
                                        {/* The Label */}
                                        <span className={`text-sm font-bold tracking-tight truncate ${
                                            isActive ? 'text-text-primary' : 'text-text-secondary group-hover:text-text-primary'
                                        }`}>
                                            {family.label}
                                        </span>
                                        
                                        {/* Active Checkmark */}
                                        <div className={`ml-auto transition-all duration-300 transform ${
                                            isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 absolute right-3'
                                        }`}>
                                            <svg className="w-4 h-4 text-text-primary opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Setting Item 2: Display Mode */}
                    <div className="space-y-4 border border-border p-6 rounded-3xl bg-background-secondary/20 transition-colors flex flex-col">
                        <div>
                            <h3 className="text-sm font-black tracking-tight text-text-primary mb-1">Display Mode</h3>
                            <p className="text-xs font-medium text-text-secondary">Toggle between Light and Dark interface.</p>
                        </div>
                        
                        <div className="flex-1 flex items-start mt-2">
                            <button
                                onClick={toggleThemeMode}
                                className="flex items-center justify-between w-full p-2 pl-5 rounded-2xl bg-background-secondary border border-border transition-all hover:border-accent-primary/50 group"
                            >
                                <span className="text-sm font-bold text-text-primary">
                                    {themeMode === 'dark' ? 'Dark Mode Active' : 'Light Mode Active'}
                                </span>
                                
                                <div className="relative inline-flex h-10 w-16 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-background-active border border-border transition-colors duration-300">
                                    <span className={`absolute inset-1 rounded-lg transition-colors duration-300 ${themeMode === 'dark' ? 'bg-background-primary' : 'bg-accent-primary/20'}`} />
                                    <span
                                        className={`absolute left-1.5 flex h-7 w-7 transform items-center justify-center rounded-lg shadow-sm transition-transform duration-300 ${
                                            themeMode === 'dark' 
                                            ? 'translate-x-0 bg-text-primary' 
                                            : 'translate-x-6 bg-warning'
                                        }`}
                                    >
                                        {themeMode === 'dark' ? (
                                            <svg className="h-4 w-4 text-background-primary" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
                                        ) : (
                                            <svg className="h-4 w-4 text-background-primary" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" /></svg>
                                        )}
                                    </span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Placeholder for future settings blocks */}
            <div className="opacity-30 pointer-events-none">
                <div className="flex items-center justify-between border-b border-border/50 pb-4 mb-6">
                    <h2 className="text-xs font-black uppercase tracking-[0.4em] text-text-muted italic">Playback & Audio</h2>
                </div>
                <div className="h-24 border-2 border-dashed border-border rounded-3xl flex items-center justify-center text-xs font-bold uppercase tracking-widest text-text-muted">
                    Coming Soon
                </div>
            </div>

        </section>
    );
}