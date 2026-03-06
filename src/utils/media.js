export const getMediaUrl = (path, type = 'image') => {
    if (!path) return type === 'image' ? '/default-cover.png' : '';

    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }

    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    // THE MAGIC TRICK: Dynamically grab the current host (localhost or your IP)
    const currentHost = window.location.hostname;
    const dynamicLocalUrl = `http://${currentHost}:5000`;

    if (type === 'audio') {
        // Use .env if it exists (for production), otherwise use the dynamic local URL
        const audioBase = import.meta.env.VITE_AUDIO_BASE_URL || dynamicLocalUrl;
        return `${audioBase}${cleanPath}`;
    }

    const imageBase = import.meta.env.VITE_IMAGE_BASE_URL || dynamicLocalUrl;
    return `${imageBase}${cleanPath}`;
};