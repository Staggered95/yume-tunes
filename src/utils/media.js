export const getMediaUrl = (path, type = 'image') => {
    if (!path) return type === 'image' ? '/default-cover.png' : '';

    if (path.startsWith('http://') || path.startsWith('https://')) {
        
        // THE SMART CLOUDINARY INTERCEPTOR
        if (type === 'image' && path.includes('cloudinary.com')) {
            
            if (path.endsWith('.webp') || path.includes('/upload/f_auto') || path.includes('/upload/q_auto')) {
                return path;
            }
            
            return path.replace('/upload/', '/upload/f_auto,q_auto,w_800,c_limit/');
        }

        return path;
    }

    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    if (type === 'audio' && import.meta.env.VITE_AUDIO_BASE_URL) {
        return `${import.meta.env.VITE_AUDIO_BASE_URL}${cleanPath}`;
    }
    if (type === 'image' && import.meta.env.VITE_IMAGE_BASE_URL) {
        return `${import.meta.env.VITE_IMAGE_BASE_URL}${cleanPath}`;
    }

    if (window.location.protocol === 'https:' || window.location.hostname.includes('duckdns.org')) {
        return cleanPath; 
    }

    const currentHost = window.location.hostname;
    return `http://${currentHost}:5000${cleanPath}`;
};