import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const ResetPassword = () => {
    const { id, token } = useParams(); 
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password.length < 8) {
            return setError("Password must be at least 8 characters long.");
        }
        if (password !== confirmPassword) {
            return setError("Passwords do not match.");
        }

        setLoading(true);

        try {
            const { data } = await api.post(`/auth/reset-password/${id}/${token}`, { newPassword: password });
            
            if (data.success) {
                setSuccess(true);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred. Your link may have expired.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-background-primary text-text-primary flex items-center justify-center px-4">
            <div className="bg-background-secondary border border-border p-8 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden">
                
                {/* Ambient Orbs */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent-primary/20 rounded-full blur-3xl"></div>
                
                <h2 className="text-3xl font-black mb-2 uppercase text-center bg-clip-text text-transparent bg-gradient-to-r from-accent-primary to-accent-tertiary">
                    Reset Password
                </h2>

                {success ? (
                    <div className="text-center mt-6">
                        <div className="p-4 rounded-xl bg-success/10 border border-success/30 text-success font-bold mb-6">
                            Your password has been successfully reset!
                        </div>
                        <button 
                            onClick={() => navigate('/home')}
                            className="w-full py-4 bg-gradient-to-r from-accent-secondary to-accent-primary text-white font-black rounded-xl uppercase tracking-widest"
                        >
                            Go to Login
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
                        {error && (
                            <div className="p-4 rounded-xl text-sm font-bold bg-error/10 border border-error/30 text-error">
                                {error}
                            </div>
                        )}

                        <input 
                            type="password" 
                            placeholder="New Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-4 bg-background-primary border border-border rounded-xl text-text-primary focus:outline-none focus:border-accent-tertiary" 
                            required 
                        />
                        <input 
                            type="password" 
                            placeholder="Confirm New Password" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-4 bg-background-primary border border-border rounded-xl text-text-primary focus:outline-none focus:border-accent-tertiary" 
                            required 
                        />

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full mt-4 py-4 bg-gradient-to-r from-accent-secondary to-accent-primary hover:from-accent-primary hover:to-accent-tertiary text-white font-black rounded-xl uppercase tracking-widest disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : 'Save New Password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;