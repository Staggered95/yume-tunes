import React, { useState } from 'react';
import { CURRENT_RELEASE } from '../config/releaseNotes';

const STORAGE_KEY = 'yumetunes_seen_release';

const ReleaseChip = () => {
    const [isVisible, setIsVisible] = useState(() => {
        if (!CURRENT_RELEASE.enabled) return false;
        try {
            return localStorage.getItem(STORAGE_KEY) !== CURRENT_RELEASE.version;
        } catch {
            return true;
        }
    });
    const [isExpanded, setIsExpanded] = useState(false);

    if (!isVisible) return null;

    const handleDismiss = (e) => {
        e?.stopPropagation();
        try {
            localStorage.setItem(STORAGE_KEY, CURRENT_RELEASE.version);
        } catch {
            // ignore storage quota/privacy mode errors
        }
        setIsVisible(false);
    };

    return (
        <div className="fixed bottom-24 right-4 md:bottom-28 md:right-6 z-40 max-w-[calc(100vw-2rem)] sm:max-w-xs animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-background-secondary/95 backdrop-blur-md border border-border rounded-2xl shadow-2xl overflow-hidden transition-all duration-300">
                {/* Compact Chip Header */}
                <div
                    onClick={() => setIsExpanded(prev => !prev)}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 cursor-pointer hover:bg-background-hover/60 transition-colors"
                >
                    <span className="relative flex h-2 w-2 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-primary opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-primary" />
                    </span>

                    <span className="text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-accent-primary/15 text-accent-primary shrink-0">
                        {CURRENT_RELEASE.badge}
                    </span>

                    <span className="text-xs font-bold text-text-primary truncate flex-1">
                        {CURRENT_RELEASE.title}
                    </span>

                    <button
                        onClick={handleDismiss}
                        aria-label="Dismiss release notice"
                        className="p-1 -mr-1 text-text-muted hover:text-text-primary rounded-full hover:bg-background-hover transition-colors shrink-0"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Expandable Release Highlights */}
                {isExpanded && CURRENT_RELEASE.highlights?.length > 0 && (
                    <div className="px-4 pb-3.5 pt-2 border-t border-border/70 animate-in fade-in duration-200">
                        <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">
                            What&apos;s New
                        </p>
                        <ul className="space-y-1.5 text-xs text-text-secondary">
                            {CURRENT_RELEASE.highlights.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                    <span className="text-accent-primary mt-0.5">•</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={handleDismiss}
                            className="mt-3 w-full py-1.5 rounded-xl bg-background-primary hover:bg-background-hover border border-border text-[11px] font-bold text-text-primary transition-colors"
                        >
                            Got it
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReleaseChip;