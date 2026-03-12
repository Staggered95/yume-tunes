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
    if (authModalView === 'register' && formData.password.length < 8) {
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
      setError(err.response?.data?.error || 'Network error. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    // The Backdrop: Smooth fade and heavy blur for focus
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background-primary/80 backdrop-blur-lg animate-in fade-in duration-300 px-4"
      onClick={closeAuthModal}
    >
      {/* The Modal Container: Expanded to max-w-4xl for the split layout */}
      <div 
        className="bg-background-secondary border border-border rounded-3xl w-full max-w-4xl shadow-2xl shadow-accent-primary/20 relative overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 slide-in-from-bottom-8 duration-500"
        onClick={(e) => e.stopPropagation()} 
      >
        {/* Close Button: Absolute to the whole card so it stays in the top right */}
        <button 
          onClick={closeAuthModal}
          className="absolute top-5 right-5 text-text-secondary hover:text-error hover:rotate-90 transition-all duration-300 z-50 bg-background-secondary/50 backdrop-blur-md rounded-full p-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* =========================================
            LEFT COLUMN: THE MASCOT PANE
            ========================================= */}
        <div className="hidden md:flex md:w-1/2 relative bg-gradient-to-t from-accent-primary/10 to-transparent items-end justify-center overflow-hidden border-r border-border/50">
            {/* Ambient background glow specifically for the mascot */}
            <div className="absolute top-20 left-10 w-64 h-64 bg-accent-tertiary/20 rounded-full blur-3xl pointer-events-none"></div>
            
            {/* The Mascot: Anchored to the bottom, dropshadow for depth */}
            <img 
              src="https://res.cloudinary.com/ddc6silap/image/upload/mascot_ipgjzj" 
              alt="YumeTunes Mascot" 
              className="relative z-10 w-auto h-[100%] object-contain object-center drop-shadow-[0_0_25px_rgba(157,92,250,0.3)] hover:scale-[1.03] transition-transform duration-700 ease-out"
            />
        </div>

        {/* =========================================
            RIGHT COLUMN: THE FORM PANE
            ========================================= */}
        <div className="w-full md:w-1/2 p-8 md:p-10 relative flex flex-col justify-center">
            
            {/* Original Ambient Glow Orbs behind the form */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent-primary/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-accent-tertiary/10 rounded-full blur-3xl pointer-events-none"></div>

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
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative w-full sm:w-1/2">
                            <input type="text" name="first_name" placeholder="First Name" onChange={handleChange} className="w-full p-4 pr-8 bg-background-primary border border-border hover:border-border-hover rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-tertiary focus:ring-1 focus:ring-accent-tertiary transition-all duration-300" required={authModalView === 'register'} />
                            {authModalView === 'register' && <span className="absolute top-4 right-4 text-error font-black pointer-events-none">*</span>}
                        </div>
                        <div className="relative w-full sm:w-1/2">
                            <input type="text" name="last_name" placeholder="Last Name" onChange={handleChange} className="w-full p-4 bg-background-primary border border-border hover:border-border-hover rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-tertiary focus:ring-1 focus:ring-accent-tertiary transition-all duration-300" />
                        </div>
                    </div>

                    <div className="relative w-full">
                        <input type="email" name="email" placeholder="Email Address" onChange={handleChange} className="w-full p-4 pr-8 bg-background-primary border border-border hover:border-border-hover rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-tertiary focus:ring-1 focus:ring-accent-tertiary transition-all duration-300" required={authModalView === 'register'} />
                        {authModalView === 'register' && <span className="absolute top-4 right-4 text-error font-black pointer-events-none">*</span>}
                    </div>
                </div>
        
                <div className="relative w-full">
                    <input type="text" name="username" placeholder="Username" onChange={handleChange} className="w-full p-4 pr-8 bg-background-primary border border-border hover:border-border-hover rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-tertiary focus:ring-1 focus:ring-accent-tertiary transition-all duration-300" required />
                    <span className="absolute top-4 right-4 text-error font-black pointer-events-none">*</span>
                </div>

                <div className="relative w-full">
                    <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full p-4 pr-8 bg-background-primary border border-border hover:border-border-hover rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-tertiary focus:ring-1 focus:ring-accent-tertiary transition-all duration-300" required />
                    <span className="absolute top-4 right-4 text-error font-black pointer-events-none">*</span>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full mt-4 py-4 bg-gradient-to-r from-accent-secondary to-accent-primary hover:from-accent-primary hover:to-accent-tertiary text-text-primary font-black rounded-xl uppercase tracking-widest shadow-lg shadow-accent-secondary/30 hover:shadow-xl hover:shadow-accent-tertiary/50 transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {loading ? 'Processing...' : (authModalView === 'login' ? 'Log In' : 'Sign Up')}
                </button>
            </form>

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
    </div>
  );
};

export default AuthModal;