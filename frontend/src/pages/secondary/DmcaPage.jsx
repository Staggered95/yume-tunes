import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function DmcaPage() {
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
                        DMCA & Copyright Policy
                    </h1>
                    <p className="mt-2 text-sm text-text-muted">Last updated: November 2026</p>
                </div>

                <div className="space-y-6">
                    <section className="p-6 rounded-2xl bg-background-secondary border border-border space-y-3">
                        <h2 className="text-lg font-bold text-text-primary">1. Respect for Intellectual Property</h2>
                        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                            YumeTunes is an independent, non-commercial project built for learning and music discovery. We respect the intellectual property rights of artists, labels, and copyright holders, and we respond promptly to valid takedown notices under the Digital Millennium Copyright Act (DMCA).
                        </p>
                    </section>

                    <section className="p-6 rounded-2xl bg-background-secondary border border-border space-y-3">
                        <h2 className="text-lg font-bold text-text-primary">2. Submitting a Takedown Notice</h2>
                        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                            If you believe that any audio, artwork, or other content available on YumeTunes infringes upon your copyright, please submit a request through our{' '}
                            <Link to="/contact" className="text-accent-primary hover:underline font-semibold">
                                Contact page
                            </Link>{' '}
                            including the following details:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-text-secondary">
                            <li>Identification of the copyrighted work claimed to have been infringed.</li>
                            <li>The exact title, artist, or URL of the material on YumeTunes you want removed.</li>
                            <li>Your contact information (name, organization if applicable, and email address).</li>
                            <li>A statement that you have a good-faith belief the use is not authorized by the copyright owner, its agent, or the law.</li>
                            <li>A statement that the information in your notice is accurate and that you are authorized to act on behalf of the copyright owner.</li>
                        </ul>
                    </section>

                    <section className="p-6 rounded-2xl bg-background-secondary border border-border space-y-3">
                        <h2 className="text-lg font-bold text-text-primary">3. Action on Valid Requests</h2>
                        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                            Upon receiving a complete and valid copyright notice, we will review the request and remove or disable access to the identified content as quickly as possible.
                        </p>
                    </section>
                </div>

                <div className="mt-10 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4 text-sm text-text-muted">
                    <div className="flex items-center gap-5">
                        <Link to="/terms" className="hover:text-accent-primary transition-colors">Terms of Service</Link>
                        <Link to="/privacy" className="hover:text-accent-primary transition-colors">Privacy Policy</Link>
                    </div>
                    <Link to="/contact" className="text-accent-tertiary hover:underline font-medium">
                        Contact Support →
                    </Link>
                </div>
            </div>
        </div>
    );
}