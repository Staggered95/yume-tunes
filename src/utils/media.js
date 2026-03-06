export const getMediaUrl = (path, type = 'image') => {
    if (!path) return type === 'image' ? '/default-cover.png' : '';

    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }

    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    if (type === 'audio') {
        // Matches your .env variable exactly
        const audioBase = import.meta.env.VITE_AUDIO_BASE_URL;
        return `${audioBase}${cleanPath}`;
    }

    // Matches your .env variable exactly
    const imageBase = import.meta.env.VITE_IMAGE_BASE_URL;
    return `${imageBase}${cleanPath}`;
};