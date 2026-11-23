import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function TermsPage() {
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
                        Terms of Service
                    </h1>
                    <p className="mt-2 text-sm text-text-muted">Last updated: November 2026</p>
                </div>

                <div className="space-y-6">
                    <section className="p-6 rounded-2xl bg-background-secondary border border-border space-y-3">
                        <h2 className="text-lg font-bold text-text-primary">1. Acceptance of Terms</h2>
                        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                            By accessing or using YumeTunes, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please discontinue use of the platform.
                        </p>
                    </section>

                    <section className="p-6 rounded-2xl bg-background-secondary border border-border space-y-3">
                        <h2 className="text-lg font-bold text-text-primary">2. User Accounts</h2>
                        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                            When you create an account on YumeTunes, you are responsible for keeping your credentials secure and for any activity under your account. Do not impersonate others or use offensive usernames or profile images.
                        </p>
                    </section>

                    <section className="p-6 rounded-2xl bg-background-secondary border border-border space-y-3">
                        <h2 className="text-lg font-bold text-text-primary">3. Acceptable Use</h2>
                        <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-text-secondary">
                            <li>Use the platform only for personal, non-commercial listening.</li>
                            <li>Do not attempt to scrape, overload, reverse-engineer, or disrupt the servers or APIs.</li>
                            <li>Do not attempt to bypass authentication, rate limits, or role-based access controls.</li>
                        </ul>
                    </section>

                    <section className="p-6 rounded-2xl bg-background-secondary border border-border space-y-3">
                        <h2 className="text-lg font-bold text-text-primary">4. Service Availability & Disclaimer</h2>
                        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                            YumeTunes is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. Features, tracks, or user playlists may change, experience downtime, or be modified without prior notice.
                        </p>
                    </section>

                    <section className="p-6 rounded-2xl bg-background-secondary border border-border space-y-3">
                        <h2 className="text-lg font-bold text-text-primary">5. Changes & Termination</h2>
                        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                            We reserve the right to suspend accounts that violate these terms and to update these terms as YumeTunes evolves. Continued use of the app after updates constitutes acceptance of the revised terms.
                        </p>
                    </section>
                </div>

                <div className="mt-10 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4 text-sm text-text-muted">
                    <div className="flex items-center gap-5">
                        <Link to="/privacy" className="hover:text-accent-primary transition-colors">Privacy Policy</Link>
                        <Link to="/dmca" className="hover:text-accent-primary transition-colors">DMCA</Link>
                    </div>
                    <Link to="/contact" className="text-accent-tertiary hover:underline font-medium">
                        Questions? Contact Us →
                    </Link>
                </div>
            </div>
        </div>
    );
}