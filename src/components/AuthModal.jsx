import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios'; 
import { getMediaUrl } from '../utils/media';

const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal, login, authModalView, openAuthModal } = useAuth();
  
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', username: '', email: '', password: ''
  });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState(''); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthModalOpen) {
        setError('');
        setSuccessMsg('');
        setFormData({ first_name: '', last_name: '', username: '', email: '', password: '' });
    }
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccessMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (authModalView === 'register' && formData.password.length < 8) {
        return setError("Password must be at least 8 characters long.");
    }
    setLoading(true);
    setError('');
    setSuccessMsg('');

    let endpoint = '';
    if (authModalView === 'login') endpoint = '/auth/login';
    else if (authModalView === 'register') endpoint = '/auth/register';
    else if (authModalView === 'forgotPassword') endpoint = '/auth/forgot-password'; 
    
    try {
      const { data } = await api.post(endpoint, formData);

      if (data.success) {
        if (authModalView === 'forgotPassword') {
          setSuccessMsg(data.message);
          setFormData({...formData, email: ''}); 
        } else {
          login(data.token);
          closeAuthModal();
        }
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Network error. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (authModalView === 'login') return 'Welcome Back';
    if (authModalView === 'register') return 'Join the Club';
    return 'Reset Password';
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background-primary/80 backdrop-blur-lg animate-in fade-in duration-300 px-4"
      onClick={closeAuthModal}
    >
      <div 
        className="bg-background-secondary border border-border rounded-3xl w-full max-w-4xl shadow-2xl shadow-accent-primary/20 relative overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 slide-in-from-bottom-8 duration-500"
        onClick={(e) => e.stopPropagation()} 
      >
        <button 
          onClick={closeAuthModal}
          className="absolute top-5 right-5 text-text-secondary hover:text-error hover:rotate-90 transition-all duration-300 z-50 bg-background-secondary/50 backdrop-blur-md rounded-full p-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* LEFT COLUMN: MASCOT */}
        <div className="hidden md:flex md:w-1/2 relative bg-gradient-to-t from-accent-primary/10 to-transparent items-end justify-center overflow-hidden border-r border-border/50">
            <div className="absolute top-20 left-10 w-64 h-64 bg-accent-tertiary/20 rounded-full blur-3xl pointer-events-none"></div>
            <img 
              src={getMediaUrl("https://res.cloudinary.com/ddc6silap/image/upload/mascot_ipgjzj")} 
              alt="YumeTunes Mascot" 
              className="relative z-10 w-auto h-[100%] object-contain object-center drop-shadow-[0_0_25px_rgba(157,92,250,0.3)] hover:scale-[1.03] transition-transform duration-700 ease-out"
            />
        </div>

        {/* RIGHT COLUMN: FORM */}
        <div className="w-full md:w-1/2 p-8 md:p-10 relative flex flex-col justify-center">
            
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent-primary/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-accent-tertiary/10 rounded-full blur-3xl pointer-events-none"></div>

            <h2 className="text-3xl font-black mb-2 uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-text-primary to-text-secondary relative z-10">
              {getTitle()}
            </h2>
            
            {authModalView === 'forgotPassword' && (
               <p className="text-text-secondary mb-6 relative z-10 text-sm">Enter your email and we'll send you a secure link to reset your password.</p>
            )}

            {error && (
            <div className={`p-4 rounded-xl mb-6 text-sm font-bold border relative z-10 bg-error/10 border-error/30 text-error`}>
                {error}
            </div>
            )}

            {successMsg && (
            <div className={`p-4 rounded-xl mb-6 text-sm font-bold border relative z-10 bg-success/10 border-success/30 text-success`}>
                {successMsg}
            </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10">
            
                {/* Registration Only Fields */}
                <div className={`transition-all duration-500 overflow-hidden flex flex-col gap-4 ${authModalView === 'register' ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 hidden'}`}>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative w-full sm:w-1/2">
                            <input type="text" name="first_name" placeholder="First Name" onChange={handleChange} className="w-full p-4 pr-8 bg-background-primary border border-border rounded-xl text-text-primary focus:outline-none focus:border-accent-tertiary" required={authModalView === 'register'} />
                        </div>
                        <div className="relative w-full sm:w-1/2">
                            <input type="text" name="last_name" placeholder="Last Name" onChange={handleChange} className="w-full p-4 bg-background-primary border border-border rounded-xl text-text-primary focus:outline-none focus:border-accent-tertiary" />
                        </div>
                    </div>
                </div>

                {/* Email Field: Used in Register AND Forgot Password */}
                {(authModalView === 'register' || authModalView === 'forgotPassword') && (
                  <div className="relative w-full">
                      <input type="email" name="email" value={formData.email} placeholder="Email Address" onChange={handleChange} className="w-full p-4 pr-8 bg-background-primary border border-border rounded-xl text-text-primary focus:outline-none focus:border-accent-tertiary" required />
                  </div>
                )}
        
                {/* Username & Password: Used in Login and Register, Hidden in Forgot Password */}
                {authModalView !== 'forgotPassword' && (
                  <>
                    <div className="relative w-full">
                        <input type="text" name="username" placeholder="Username" onChange={handleChange} className="w-full p-4 pr-8 bg-background-primary border border-border rounded-xl text-text-primary focus:outline-none focus:border-accent-tertiary" required />
                    </div>

                    <div className="relative w-full flex flex-col">
                        <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full p-4 pr-8 bg-background-primary border border-border rounded-xl text-text-primary focus:outline-none focus:border-accent-tertiary" required />
                        
                        {/* FORGOT PASSWORD LINK */}
                        {authModalView === 'login' && (
                          <button 
                            type="button" 
                            onClick={() => { openAuthModal('forgotPassword'); setError(''); setSuccessMsg(''); }}
                            className="self-end mt-2 text-xs text-text-muted hover:text-accent-primary transition-colors"
                          >
                            Forgot Password?
                          </button>
                        )}
                    </div>
                  </>
                )}

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full mt-4 py-4 bg-gradient-to-r from-accent-secondary to-accent-primary hover:from-accent-primary hover:to-accent-tertiary text-white font-black rounded-xl uppercase tracking-widest transition-all duration-300 disabled:opacity-50"
                >
                    {loading ? 'Processing...' : (authModalView === 'login' ? 'Log In' : authModalView === 'register' ? 'Sign Up' : 'Send Reset Link')}
                </button>
            </form>

            {/* Bottom Toggle Footer */}
            <p className="text-center text-text-secondary mt-8 text-sm relative z-10">
              {authModalView === 'login' ? "Don't have an account?" : authModalView === 'register' ? "Already have an account?" : "Remembered your password?"}
              <button 
                  type="button"
                  onClick={() => { openAuthModal(authModalView === 'login' ? 'register' : 'login'); setError(''); setSuccessMsg(''); }} 
                  className="ml-2 text-accent-tertiary font-bold hover:text-accent-secondary transition-colors duration-300"
              >
                  {authModalView === 'login' ? 'Sign Up' : 'Log In'}
              </button>
            </p>

        </div>
      </div>
    </div>
  );
};

export default AuthModal;