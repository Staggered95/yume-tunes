import { useNavigate } from "react-router-dom";
import { GENRES } from "../utils/constants";

export default function TagChips() {
  const navigate = useNavigate();

  return (
    <div className="flex gap-3 overflow-x-auto scrollbar-none py-2 px-6">
      {GENRES.map((genre) => (
        <button 
          key={genre}
          onClick={() => navigate(`/genre/${encodeURIComponent(genre)}`)}
          className="px-5 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm font-medium hover:bg-accent-primary hover:border-accent-primary transition-all whitespace-nowrap text-text-primary"
        >
          {genre}
        </button>
      ))}
      <button 
        onClick={() => navigate('/genres')}
        className="px-5 py-1.5 text-sm font-bold text-accent-primary hover:underline whitespace-nowrap"
      >
        Show all
      </button>
    </div>
  );
}