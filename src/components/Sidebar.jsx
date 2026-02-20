import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

/* ---------- Prop-Aware Icons ---------- */
// Every SVG now accepts a className prop to allow external styling.
const HamburgerIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M3 6h18v2H3zM3 11h18v2H3zM3 16h18v2H3z" />
  </svg>
);

const CloseIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M6 6l12 12M6 18L18 6" />
  </svg>
);

const HomeIcon = ({ className }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    {/* The House Structure */}
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    {/* The Doorway */}
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const LibraryIcon = ({ className }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    {/* Bottom layer */}
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20" />
    {/* Middle layer */}
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15" />
    {/* Top layer details */}
    <path d="M10 10h6" />
    <path d="M10 14h6" />
    <path d="M10 6h6" />
  </svg>
);

const ArtistIcon = ({ className }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
   LucideArtist
  >
    {/* The Head */}
    <circle cx="12" cy="7" r="4" />
    {/* The Shoulders/Torso - Using an arc for a modern look */}
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
  </svg>
);

const AnimeIcon = ({ className }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none"
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    {/* The Screen */}
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    {/* The Stand */}
    <path d="M8 21h8" />
    <path d="M12 17v4" />
    {/* The Play Button (Filled for contrast) */}
    <path d="M10 8l6 3.5-6 3.5V8z" fill="currentColor" stroke="none" />
  </svg>
);

const SongIcon = ({ className }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    {/* Note Heads */}
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
    {/* Stems and Beam */}
    <path d="M9 18V5l12-2v13" />
  </svg>
);

const SettingsIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 8a4 4 0 100 8 4 4 0 000-8z" />
    <path d="M2 12h2m16 0h2M12 2v2m0 16v2" />
  </svg>
);

/* ---------- Optimized Sidebar Item ---------- */

const SidebarItem = ({ icon: Icon, label, isOpen, onClick }) => (
  <div 
    onClick={onClick}
    className="flex items-center gap-4 px-5 py-3 text-zinc-300 hover:text-white hover:bg-white/5 cursor-pointer transition-colors overflow-hidden"
    title={!isOpen ? label : ""} // Tooltip for compact mode
  >
    {/* Explicit size and shrink-0 ensures icons remain visible at w-16 */}
    <Icon className="w-6 h-6 shrink-0" />

    <span
      className={`whitespace-nowrap transition-all duration-300 ease-in-out font-medium
        ${isOpen
          ? "opacity-100 translate-x-0"
          : "opacity-0 -translate-x-10 pointer-events-none"
        }`}
    >
      {label}
    </span>
  </div>
);





/* ---------- Main Sidebar Component ---------- */

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sideBarRef = useRef(null);
  const navigate = useNavigate();
  const playlists = ["Chill Anime", "OP Bangers", "Late Night"];

  useEffect(() => {
    const handleClickOutside = (event) => {
        if (isOpen && sideBarRef.current && !sideBarRef.current.contains(event.target)) {
          setIsOpen(prev => !prev);
        }
      }


      document.addEventListener('mousedown', handleClickOutside);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen]);

  return (
    
    <aside ref={sideBarRef}
      className={`fixed top-0 left-0 h-screen bg-zinc-950 border-r border-white/5 z-10
        transition-all duration-300 ease-in-out
        ${isOpen ? "w-64" : "w-16"}`} // Rail to Drawer transition
    >
      {/* 1. Header & Toggle */}
      <div className="p-4 h-16 flex items-center">
        <button
          onClick={() => setIsOpen(v => !v)}
          className="relative w-8 h-8 text-white hover:text-red-400 transition-colors"
        >
          <span
            className={`absolute inset-0 transition-all duration-300
              ${isOpen ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"}`}
          >
            <HamburgerIcon className="w-full h-full" />
          </span>

          <span
            className={`absolute inset-0 transition-all duration-300
              ${isOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"}`}
          >
            <CloseIcon className="w-full h-full" />
          </span>
        </button>
      </div>

      {/* 2. Primary Navigation */}
      <nav className="mt-4 space-y-1">
        <SidebarItem icon={HomeIcon} label="Home" isOpen={isOpen} onClick={() => navigate('/')} />
        <SidebarItem icon={LibraryIcon} label="Library" isOpen={isOpen} />
        <SidebarItem icon={AnimeIcon} label="Anime Osts" isOpen={isOpen} onClick={() => navigate('/animes')}/>
        <SidebarItem icon={ArtistIcon} label="Artists" isOpen={isOpen} onClick={() => navigate('/artists')} />

        <hr className={`mx-4 my-4 border-white/5 transition-opacity ${isOpen ? "opacity-100" : "opacity-0"}`} />

        {/* 3. Playlists Section */}
        <div className="relative">
          <SidebarItem icon={SongIcon} label="Playlists" isOpen={isOpen} />

          {isOpen && (
            <div className="ml-14 mt-2 space-y-3 text-sm text-zinc-400">
              {playlists.map(p => (
                <div key={p} className="truncate hover:text-white transition-colors cursor-pointer">
                  {p}
                </div>
              ))}
            </div>
          )}
        </div>
      </nav>
        {/*Recent playlists;*/}
      {/* 4. Footer Settings */}
      <div className="absolute bottom-4 w-full">
        <SidebarItem icon={SettingsIcon} label="Settings" isOpen={isOpen} />
      </div>
      {isOpen && (
  <div 
    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden" 
    aria-hidden="true"
  />
)}
    </aside>
    
  );
  
};

export default Sidebar;