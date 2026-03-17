import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';
import Spinner from '../minicomps/Spinner';

const ContactPage = () => {
    const { userProfile, token } = useAuth();
    const { addToast } = useToast();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        type: 'General Suggestion',
        message: ''
    });

    // Auto-fill the form if the user is already logged in!
    useEffect(() => {
        if (userProfile && token) {
            setFormData(prev => ({
                ...prev,
                name: userProfile.username || '',
                email: userProfile.email || ''
            }));
        }
    }, [userProfile, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name || !formData.email || !formData.message) {
            addToast("Please fill out all fields.", "error");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await api.post('/contact', formData);
            
            if (response.data.success) {
                addToast("Message sent! We'll be in touch.", "success");
                // Clear the message box, but keep their name/email/type
                setFormData(prev => ({ ...prev, message: '' }));
            }
        } catch (error) {
            // Handle the 429 Too Many Requests from our Rate Limiter!
            if (error.response?.status === 429) {
                addToast("Whoa there! You've sent too many messages. Try again later.", "error");
            } else {
                addToast(error.response?.data?.message || "Failed to send message.", "error");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const mascotImg = "https://res.cloudinary.com/ddc6silap/image/upload/f_auto,q_auto,w_600/v1773518851/contact_i9lshy.png";

    return (
        <div className="min-h-screen pt-24 pb-32 px-4 md:px-12 bg-background-primary flex items-center justify-center">
            
            <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
                
                {/* LEFT COLUMN: The Mascot & Branding */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left animate-fade-in slide-in-from-left-8">                    <div className="relative group w-64 h-64 md:w-80 md:h-80 mb-8 flex justify-center items-center">
                        {/* Glowing backdrop effect */}
                        <div className="absolute inset-0 bg-accent-primary/20 blur-3xl rounded-full scale-75 group-hover:scale-100 transition-transform duration-700"></div>
                        <img 
                            src={mascotImg} 
                            alt="Contact Support" 
                            className="relative z-10 w-full h-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] animate-float"
                        />
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl font-black text-text-primary tracking-tighter mb-4 uppercase">
                        Let's <span className="text-accent-primary">Connect</span>
                    </h1>
                    <p className="text-text-secondary text-base md:text-lg font-medium max-w-md">
                        Found a bug? Have a feature request? Or just want to talk about your favorite anime OP? Drop a line straight to the developer.
                    </p>
                </div>

                {/* RIGHT COLUMN: The Frosted Glass Form */}
                <div className="bg-background-secondary/40 backdrop-blur-xl border border-border/50 p-6 md:p-10 rounded-3xl shadow-2xl animate-fade-in slide-in-from-right-8">                    
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* NAME */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Name</label>
                                <input 
                                    type="text" 
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Your Name"
                                    className="bg-background-primary border border-border rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent-primary transition-colors placeholder:text-text-muted/50"
                                />
                            </div>

                            {/* EMAIL */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Email</label>
                                <input 
                                    type="email" 
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="your@email.com"
                                    className="bg-background-primary border border-border rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent-primary transition-colors placeholder:text-text-muted/50"
                                />
                            </div>
                        </div>

                        {/* CATEGORY */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-text-muted uppercase tracking-widest">How can we help?</label>
                            <select 
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="bg-background-primary border border-border rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent-primary transition-colors appearance-none cursor-pointer"
                            >
                                <option value="Bug Report">🐛 Report a Bug</option>
                                <option value="Feature Request">✨ Request a Feature</option>
                                <option value="Music Request">🎵 Request an Anime / Song</option>
                                <option value="General Suggestion">💡 General Suggestion</option>
                            </select>
                        </div>

                        {/* MESSAGE */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Message</label>
                            <textarea 
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="What's on your mind?"
                                className="bg-background-primary border border-border rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent-primary transition-colors resize-none min-h-[160px] placeholder:text-text-muted/50"
                            ></textarea>
                        </div>

                        {/* SUBMIT BUTTON */}
                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="mt-2 group relative w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-accent-secondary to-accent-primary text-white font-black uppercase tracking-widest rounded-xl hover:shadow-[0_0_20px_rgba(157,92,250,0.4)] hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed overflow-hidden"
                        >
                            {isSubmitting ? (
                                <Spinner size="sm" />
                            ) : (
                                <>
                                    <span className="relative z-10">Send Transmission</span>
                                    <svg className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </>
                            )}
                            <div className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out z-0"></div>
                        </button>

                    </form>
                </div>

            </div>
        </div>
    );
};

export default ContactPage;