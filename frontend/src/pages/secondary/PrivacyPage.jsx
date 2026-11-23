import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function PrivacyPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background-primary text-text-primary px-4 sm:px-6 lg:px-8 py-10 pb-28">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-accent-primary transition-colors mb-6"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                </button>

                <div className="mb-8 pb-6 border-b border-border">
                    <span className="inline-block px-3 py-1 mb-3 text-xs font-black uppercase tracking-widest rounded-full bg-accent-primary/10 text-accent-primary border border-accent-primary/20">
                        Legal
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-text-primary">
                        Privacy Policy
                    </h1>
                    <p className="mt-2 text-sm text-text-muted">Last updated: November 2026</p>
                </div>

                <div className="space-y-6">
                    <section className="p-6 rounded-2xl bg-background-secondary border border-border space-y-3">
                        <h2 className="text-lg font-bold text-text-primary">1. Information We Collect</h2>
                        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                            To provide a personalized listening experience, YumeTunes stores only the data required for core functionality:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-text-secondary">
                            <li><span className="text-text-primary font-semibold">Account Details:</span> Your username, email address, hashed password, and optional profile avatar.</li>
                            <li><span className="text-text-primary font-semibold">Library & Preferences:</span> Liked songs, playlists you create, and UI theme preferences.</li>
                            <li><span className="text-text-primary font-semibold">Playback Activity:</span> Listening counts and recent playback signals used to generate recommendations.</li>
                        </ul>
                    </section>

                    <section className="p-6 rounded-2xl bg-background-secondary border border-border space-y-3">
                        <h2 className="text-lg font-bold text-text-primary">2. Cookies & Local Storage</h2>
                        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                            YumeTunes uses browser local storage and secure, <code className="px-1.5 py-0.5 rounded bg-background-active text-accent-tertiary text-xs">HttpOnly</code> session cookies strictly for authentication and saving your theme settings. We do not use third-party advertising trackers.
                        </p>
                    </section>

                    <section className="p-6 rounded-2xl bg-background-secondary border border-border space-y-3">
                        <h2 className="text-lg font-bold text-text-primary">3. Data Sharing</h2>
                        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                            We do not sell, rent, or trade your personal information to third parties. Data is stored securely on our database infrastructure solely to operate YumeTunes.
                        </p>
                    </section>

                    <section className="p-6 rounded-2xl bg-background-secondary border border-border space-y-3">
                        <h2 className="text-lg font-bold text-text-primary">4. Your Choices & Account Deletion</h2>
                        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                            You can update your profile details from your account settings at any time. If you want your account and associated data deleted, reach out through our{' '}
                            <Link to="/contact" className="text-accent-primary hover:underline font-semibold">
                                Contact page
                            </Link>.
                        </p>
                    </section>
                </div>

                <div className="mt-10 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4 text-sm text-text-muted">
                    <div className="flex items-center gap-5">
                        <Link to="/terms" className="hover:text-accent-primary transition-colors">Terms of Service</Link>
                        <Link to="/dmca" className="hover:text-accent-primary transition-colors">DMCA</Link>
                    </div>
                    <Link to="/contact" className="text-accent-tertiary hover:underline font-medium">
                        Privacy Request →
                    </Link>
                </div>
            </div>
        </div>
    );
}