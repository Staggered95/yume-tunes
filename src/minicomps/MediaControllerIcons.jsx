import MorphingPlayPauseButton from './MorphingPlayPauseButton'
import { useSongs } from '../context/SongContext';
import { usePlayback } from '../context/PlaybackContext';

const MediaControllers = () => {
    const { nextSong, prevSong}  = useSongs(); 
    const { isPlaying, togglePlay } = usePlayback();

    return (
        <div className='flex gap-4 items-center justify-center text-text-primary'>
                    <div onClick={prevSong}>
                        <svg 
                          width="28" 
                          height="28" 
                          viewBox="0 0 24 24" 
                          fill="currentColor" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M18 6l-8.5 6 8.5 6V6zM6 6v12h2V6H6z" />
                        </svg>
                    </div>
                    <div className="border-2 md:border-3 border-accent-primary group-hover:border-accent-active rounded-full">
                        <MorphingPlayPauseButton
                          isPlaying={isPlaying}
                          onToggle={togglePlay}
                        />
                    </div>
                    <div onClick={nextSong}>
                        <svg 
                          width="28" 
                          height="28" 
                          viewBox="0 0 24 24" 
                          fill="currentColor" 
                          xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                        </svg>
                    </div>
                </div>
    );
}

export default MediaControllers;