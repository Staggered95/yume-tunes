export const parseLRC = (lrcString) => {
  if (!lrcString) return [];
  
  const lines = lrcString.split('\n');
  const lyrics = [];
  // Regex to match [mm:ss.xx] or [mm:ss.xxx]
  const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/;

  lines.forEach(line => {
    const match = line.match(timeRegex);
    if (match) {
      const minutes = parseInt(match[1]);
      const seconds = parseInt(match[2]);
      const ms = parseInt(match[3]);
      const text = match[4].trim();

      // Convert to total seconds: (min * 60) + sec + (ms / 100 or 1000)
      const time = minutes * 60 + seconds + ms / (match[3].length === 3 ? 1000 : 100);
      
      if (text) {
        lyrics.push({ time, text });
      }
    }
  });

  return lyrics.sort((a, b) => a.time - b.time);
};