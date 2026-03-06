import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios'; // Native Axios import

const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal, login, authModalView, openAuthModal } = useAuth();
  
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', username: '', email: '', password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthModalOpen) {
        setError('');
        setFormData({ first_name: '', last_name: '', username: '', email: '', password: '' });
    }
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 8) {
        return setError("Password must be at least 8 characters long.");
    }
    setLoading(true);
    setError('');

    const endpoint = authModalView === 'login' ? '/auth/login' : '/auth/register';
    
    try {
      // Axios handles headers and JSON serialization automatically
      const { data } = await api.post(endpoint, formData);

      if (data.success) {
        login(data.token);
        closeAuthModal();
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      // Axios wraps backend errors in err.response
      setError(err.data?.error || 'Network error. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    // The Backdrop: Smooth fade and heavy blur for focus
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-background-primary/80 backdrop-blur-lg animate-in fade-in duration-300 px-4"
      onClick={closeAuthModal}
    >
      {/* The Modal Container: Glowing shadow, slide-up animation, and custom secondary BG */}
      <div 
        className="bg-background-secondary border border-border p-8 md:p-10 rounded-3xl w-full max-w-md shadow-2xl shadow-accent-primary/20 relative overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500"
        onClick={(e) => e.stopPropagation()} 
      >
        {/* Ambient Glow Orbs for a premium feel */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent-primary/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-accent-tertiary/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button: Spins on hover */}
        <button 
          onClick={closeAuthModal}
          className="absolute top-5 right-5 text-text-secondary hover:text-error hover:rotate-90 transition-all duration-300 z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header: Gradient Text */}
        <h2 className="text-3xl font-black mb-6 uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-text-primary to-text-secondary relative z-10">
          {authModalView === 'login' ? 'Welcome Back' : 'Join the Club'}
        </h2>

        {error && (
          <div className={`p-4 rounded-xl mb-6 text-sm font-bold border relative z-10 ${error.includes('successful') ? 'bg-success/10 border-success/30 text-success' : 'bg-error/10 border-error/30 text-error'}`}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10">
          
          <div className={`transition-all duration-500 overflow-hidden flex flex-col gap-4 ${authModalView === 'login' ? 'max-h-0 opacity-0' : 'max-h-[500px] opacity-100'}`}>
            {/* Stacks to column on mobile, row on larger screens */}
            <div className="flex flex-col sm:flex-row gap-4">
      
              {/* First Name Wrapper */}
              <div className="relative w-full sm:w-1/2">
                <input type="text" name="first_name" placeholder="First Name" onChange={handleChange} className="w-full p-4 pr-8 bg-background-primary border border-border hover:border-border-hover rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-tertiary focus:ring-1 focus:ring-accent-tertiary transition-all duration-300" required={authModalView === 'register'} />
                {authModalView === 'register' && <span className="absolute top-4 right-4 text-error font-black pointer-events-none">*</span>}
              </div>

              {/* Last Name Wrapper (Optional, no asterisk) */}
              <div className="relative w-full sm:w-1/2">
                <input type="text" name="last_name" placeholder="Last Name" onChange={handleChange} className="w-full p-4 bg-background-primary border border-border hover:border-border-hover rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-tertiary focus:ring-1 focus:ring-accent-tertiary transition-all duration-300" />
              </div>

            </div>

            {/* Email Wrapper */}
            <div className="relative w-full">
                <input type="email" name="email" placeholder="Email Address" onChange={handleChange} className="w-full p-4 pr-8 bg-background-primary border border-border hover:border-border-hover rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-tertiary focus:ring-1 focus:ring-accent-tertiary transition-all duration-300" required={authModalView === 'register'} />
                {authModalView === 'register' && <span className="absolute top-4 right-4 text-error font-black pointer-events-none">*</span>}
            </div>
          </div>
  
            {/* Username Wrapper */}
            <div className="relative w-full">
                <input 
                  type="text" 
                  name="username" 
                  placeholder="Username" 
                  onChange={handleChange} 
                  className="w-full p-4 pr-8 bg-background-primary border border-border hover:border-border-hover rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-tertiary focus:ring-1 focus:ring-accent-tertiary transition-all duration-300" 
                  required 
                />
                <span className="absolute top-4 right-4 text-error font-black pointer-events-none">*</span>
              </div>

              {/* Password Wrapper */}
              <div className="relative w-full">
                <input 
                  type="password" 
                  name="password" 
                  placeholder="Password" 
                  onChange={handleChange} 
                  className="w-full p-4 pr-8 bg-background-primary border border-border hover:border-border-hover rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-tertiary focus:ring-1 focus:ring-accent-tertiary transition-all duration-300" 
                  required 
                />
                <span className="absolute top-4 right-4 text-error font-black pointer-events-none">*</span>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full mt-4 py-4 bg-gradient-to-r from-accent-secondary to-accent-primary hover:from-accent-primary hover:to-accent-tertiary text-text-primary font-black rounded-xl uppercase tracking-widest shadow-lg shadow-accent-secondary/30 hover:shadow-xl hover:shadow-accent-tertiary/50 transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? 'Processing...' : (authModalView === 'login' ? 'Log In' : 'Sign Up')}
              </button>
        </form>

        {/* View Toggle */}
        <p className="text-center text-text-secondary mt-8 text-sm relative z-10">
          {authModalView === 'login' ? "Don't have an account?" : "Already have an account?"}
          <button 
            type="button"
            onClick={() => { openAuthModal(prev => prev==='login' ? 'register' : 'login'); setError(''); }} 
            className="ml-2 text-accent-tertiary font-bold hover:text-accent-secondary transition-colors duration-300"
          >
            {authModalView==='login' ? 'Sign Up' : 'Log In'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;