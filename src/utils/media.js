export const getMediaUrl = (path, type = 'image') => {
    if (!path) return type === 'image' ? '/default-cover.png' : '';

    // If it's already a full external URL, leave it alone
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }

    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    // 1. If you explicitly set variables in your .env, honor them
    if (type === 'audio' && import.meta.env.VITE_AUDIO_BASE_URL) {
        return `${import.meta.env.VITE_AUDIO_BASE_URL}${cleanPath}`;
    }
    if (type === 'image' && import.meta.env.VITE_IMAGE_BASE_URL) {
        return `${import.meta.env.VITE_IMAGE_BASE_URL}${cleanPath}`;
    }

    // 2. THE SMART PRODUCTION CHECK
    // If the site is loaded over HTTPS, Nginx handles the routing directly!
    // We just return the relative path, and the browser does the rest securely.
    if (window.location.protocol === 'https:' || window.location.hostname.includes('duckdns.org')) {
        return cleanPath; 
    }

    // 3. THE LOCAL DEV FALLBACK
    // If you are coding on your Arch laptop (http://localhost), keep using port 5000
    const currentHost = window.location.hostname;
    return `http://${currentHost}:5000${cleanPath}`;
};