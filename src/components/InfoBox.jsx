import f2 from '../assets/f2.png'

const InfoBox = () => {
    return (
        // Added 'flex flex-col gap-4' to space out the image, info, and buttons
        <div className="fixed right-4 top-24 w-[382px] bg-background-secondary hover:bg-background-hover p-4 rounded-xl transition-colors duration-300 flex flex-col gap-4 shadow-xl z-10">
            
            {/* Image Container */}
            <div className="w-full aspect-square rounded-lg overflow-hidden shadow-lg">
                <img 
                    className='w-full h-full object-cover'
                    src={f2} 
                    alt="current song"
                />        
            </div>

            {/* Track Info */}
            <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-2">
                    <span className="text-text-secondary text-sm font-medium">Title:</span>
                    <span className="text-text-primary text-xl font-bold truncate">Title content</span>
                </div>
                <div className="text-accent-primary font-medium">Artist Name</div>
            </div>

            {/* Controls */}
            <div className="flex gap-3">
                <button className="flex-1 bg-text-primary text-background-primary py-2 rounded-full font-bold hover:scale-105 transition-transform">
                    Play
                </button>
                <button className="flex-1 border border-text-secondary text-text-primary py-2 rounded-full font-bold hover:bg-background-active transition-colors">
                    Shuffle
                </button>
            </div>

            {/* Suggested Tracks Placeholder */}
            <div className="mt-2">
                <h3 className="text-text-secondary text-xs uppercase tracking-widest font-bold mb-3">Suggested tracks</h3>
                <div className="space-y-2">
                    {/* We'll populate this with real data later */}
                    <div className="h-12 w-full bg-background-active rounded-md animate-pulse"></div>
                    <div className="h-12 w-full bg-background-active rounded-md animate-pulse"></div>
                </div>
            </div>
        </div>
    );
}

export default InfoBox;