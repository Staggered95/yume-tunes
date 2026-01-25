

// You can either import your SVG logo component or just use text
const Logo = () => {
    return (
        <svg
  className='w-14 h-14' viewBox="0 0 128 128"
  role="img" aria-label="YumeTunes logo"
>
  <defs>
    <linearGradient id="yt-grad" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stopColor="#6C63FF"/>
      <stop offset="100%" stopColor="#FF5D73"/>
    </linearGradient>
  </defs>

  <mask id="yt-cut">
    <rect width="128" height="128" fill="#fff"/>
    <circle cx="86" cy="58" r="40" fill="#000"/>
  </mask>

  <circle cx="64" cy="64" r="52" mask="url(#yt-cut)" fill="url(#yt-grad)" opacity="0.95"/>
  <path
    d="M78 36 v29 c-2.4-1.5-5.6-2.4-9.1-2.4 c-7.6 0-13.9 4.1-13.9 9.2 s6.3 9.2 13.9 9.2 s13.9-4.1 13.9-9.2 V51.5 l18 5.8 v11.7 c-2.4-1.5-5.6-2.4-9.1-2.4 c-7.6 0-13.9 4.1-13.9 9.2 s6.3 9.2 13.9 9.2 s13.9-4.1 13.9-9.2 V41 L78 36 z"
    fill="#ffffff" opacity="0.95"
  />
</svg>

    );
};



export default Logo;