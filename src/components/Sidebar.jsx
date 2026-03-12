import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from '../api/axios'; 
import { useAuth } from '../context/AuthContext';

/* ---------- Theme-Aware Icons ---------- */
const HamburgerIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M3 6h18v2H3zM3 11h18v2H3zM3 16h18v2H3z" /></svg>
);
const CloseIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={className}><path d="M6 6l12 12M6 18L18 6" /></svg>
);
const HomeIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
);
const LibraryIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15" /><path d="M10 10h6M10 14h6M10 6h6" /></svg>
);
const AnimeIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><path d="M8 21h8M12 17v4" /><path d="M10 8l6 3.5-6 3.5V8z" fill="currentColor" stroke="none" /></svg>
);
const ArtistIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /></svg>
);
const SongIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /><path d="M9 18V5l12-2v13" /></svg>
);
const SettingsIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
);

/* ---------- Sidebar Item ---------- */
const SidebarItem = ({ icon: Icon, label, isOpen, onClick, active }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-4 px-5 py-3 cursor-pointer transition-all duration-300 group overflow-hidden rounded-xl mx-2
      ${active 
        ? "bg-background-active text-accent-primary" 
        : "text-text-secondary hover:text-text-primary hover:bg-background-hover"
      }`}
    title={!isOpen ? label : ""}
  >
    <Icon className={`w-6 h-6 shrink-0 transition-transform duration-300 group-hover:scale-110 ${active ? "text-accent-primary" : "text-text-secondary group-hover:text-text-primary"}`} />
    <span className={`whitespace-nowrap transition-all duration-500 font-bold tracking-tight text-sm
        ${isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10 pointer-events-none"}`}>
      {label}
    </span>
  </div>
);

/* ---------- Main Component ---------- */
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const { isLoggedIn } = useAuth();
  const [userPlaylists, setUserPlaylists] = useState([]);

  useEffect(() => {
    if (!isLoggedIn) {
        setUserPlaylists([]);
        return;
    }
    const fetchPlaylists = async () => {
        try {
            const { data } = await api.get('/playlists');
            if (data.success) {
                setUserPlaylists(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch sidebar playlists", error);
        }
    };
    fetchPlaylists();
  }, [isLoggedIn]);

  return (
    <aside 
      // THE FIX: Added mouse events and rounded-br-3xl
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      className={`hidden md:block fixed top-20 left-0 h-[calc(100vh-11rem)] bg-background-primary border-r border-b border-border z-30
        transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-2xl rounded-br-3xl
        ${isOpen ? "w-64" : "w-20"}`}
    >
      {/* Header & Toggle (Now just a visual indicator since hover controls it) */}
      <div className="p-4 h-20 flex items-center justify-center">
        <div className="relative w-10 h-10 text-text-primary flex items-center justify-center bg-background-secondary rounded-xl border border-border">
          <span className={`absolute transition-all duration-500 ${isOpen ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"}`}>
            <HamburgerIcon className="w-6 h-6" />
          </span>
          <span className={`absolute transition-all duration-500 ${isOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"}`}>
            <CloseIcon className="w-6 h-6" />
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-4 space-y-2">
        <SidebarItem icon={HomeIcon} label="Home" isOpen={isOpen} active={location.pathname === '/'} onClick={() => navigate('/')} />
        <SidebarItem icon={LibraryIcon} label="Library" isOpen={isOpen} active={location.pathname === '/library'} onClick={() => navigate('/library')} />
        <SidebarItem icon={AnimeIcon} label="Animes" isOpen={isOpen} active={location.pathname === '/animes'} onClick={() => navigate('/animes')}/>
        <SidebarItem icon={ArtistIcon} label="Artists" isOpen={isOpen} active={location.pathname === '/artists'} onClick={() => navigate('/artists')} />

        <hr className={`mx-6 my-6 border-border transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0"}`} />

        {/* Playlists Section */}
        <div className="relative">
          <SidebarItem icon={SongIcon} label="Playlists" isOpen={isOpen} active={location.pathname.includes('/playlists')} onClick={() => navigate('/playlists')} />

          {isOpen && (
            <div className="ml-16 mt-3 space-y-4 text-sm text-text-secondary custom-scrollbar overflow-y-auto max-h-[30vh] pr-4 animate-in fade-in slide-in-from-left-4 duration-500">
              <div 
                onClick={() => navigate('/likedsongs')} 
                className={`truncate transition-all duration-300 cursor-pointer font-bold flex items-center gap-2 hover:text-accent-secondary
                  ${location.pathname === '/likedsongs' ? 'text-accent-secondary' : 'text-text-primary'}`}
              >
                Liked Songs <span className="text-xs">💖</span>
              </div>

              {userPlaylists.length === 0 ? (
                  <div className="text-text-muted italic text-xs">No playlists yet</div>
              ) : (
                  userPlaylists.map(p => (
                    <div 
                        key={p.id} 
                        onClick={() => navigate(`/playlists/${p.id}`)}
                        className={`truncate transition-all duration-300 cursor-pointer hover:text-text-primary text-xs font-medium
                          ${location.pathname === `/playlists/${p.id}` ? 'text-accent-primary' : 'text-text-secondary'}`}
                    >
                      {p.name}
                    </div>
                  ))
              )}
            </div>
          )}
        </div>
      </nav>
        
      {/* Footer Settings */}
      <div className="absolute bottom-6 w-full">
        <SidebarItem icon={SettingsIcon} label="Settings" isOpen={isOpen} active={location.pathname === '/settings'} onClick={() => navigate('/settings')} />
      </div>
    </aside>
  );
};

export default Sidebar;