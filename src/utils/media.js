export const getMediaUrl = (path, type = 'image') => {
    if (!path) return type === 'image' ? '/default-cover.png' : '';

    // --- 1. HANDLE EXTERNAL URLs (Like Cloudinary) ---
    if (path.startsWith('http://') || path.startsWith('https://')) {
        
        // THE SMART CLOUDINARY INTERCEPTOR
        if (type === 'image' && path.includes('cloudinary.com')) {
            
            // THE SHIELD: If it's a NEW upload (already .webp) or already has transformation flags, leave it alone.
            if (path.endsWith('.webp') || path.includes('/upload/f_auto') || path.includes('/upload/q_auto')) {
                return path;
            }
            
            // It passed the shield! It must be an OLD, heavy .png or .jpg.
            // Inject the optimization flags right after '/upload/'
            return path.replace('/upload/', '/upload/f_auto,q_auto,w_800,c_limit/');
        }

        // If it's external audio or a non-Cloudinary image, just return it as-is
        return path;
    }

    // Ensure relative paths start with a slash
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    // --- 2. EXPLICIT ENV VARIABLES (If defined in .env) ---
    if (type === 'audio' && import.meta.env.VITE_AUDIO_BASE_URL) {
        return `${import.meta.env.VITE_AUDIO_BASE_URL}${cleanPath}`;
    }
    if (type === 'image' && import.meta.env.VITE_IMAGE_BASE_URL) {
        return `${import.meta.env.VITE_IMAGE_BASE_URL}${cleanPath}`;
    }

    // --- 3. THE SMART PRODUCTION CHECK ---
    // If the site is loaded over HTTPS, Nginx handles the routing directly!
    // We just return the relative path, and the browser does the rest securely.
    if (window.location.protocol === 'https:' || window.location.hostname.includes('duckdns.org')) {
        return cleanPath; 
    }

    // --- 4. THE LOCAL DEV FALLBACK ---
    // If you are coding on your Arch laptop (http://localhost), keep using port 5000
    const currentHost = window.location.hostname;
    return `http://${currentHost}:5000${cleanPath}`;
};