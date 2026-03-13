<div align="center">

# 🎵 YumeTunes
**Your Personal Anime Music Sanctuary**

[![Website](https://img.shields.io/website?url=https%3A%2F%2Fyumetunes.duckdns.org&up_message=online&up_color=success&down_message=offline&down_color=red&label=YumeTunes)](https://yumetunes.duckdns.org)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=white)](#)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=nodedotjs&logoColor=white)](#)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.x-4169E1?logo=postgresql&logoColor=white)](#)
[![Docker](https://img.shields.io/badge/Docker-Alpine-2496ED?logo=docker&logoColor=white)](#)

*Listen to iconic OSTs, sync lyrics, and vibe with the community.*<br>
**[Explore the Live App](https://yumetunes.duckdns.org)**

<br>

<img src="assets/carousal.png" alt="YumeTunes Hero Carousel" width="100%" style="border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);"/>

</div>

---

## ✨ Features & Architecture

YumeTunes is a highly modular, responsive, full-stack PERN application designed with performance, UX, and robust DevOps practices in mind.

### 🤖 Telemetry & Smart Discovery
YumeTunes doesn't just play music; it learns what you love.
* **Intelligent Recommendations:** A Node.js backend engine analyzes user telemetry (listening history, skip rates, and playback duration) to serve highly customized daily recommendations.
* **Continue Listening:** Instantly pick up where you left off with a dynamically generated feed based on your most recent active sessions.

<div align="center">
  <img src="assets/continue-recommended.png" alt="Smart Recommendations and Continue Listening Feed" width="100%" style="border-radius: 8px; margin-top: 10px;"/>
</div>

### 🎧 The Playback Engine
* **Modular Audio System:** Three distinct player views powered by a global React Playback Context (Utility Player, Bottom Player, and Fullscreen Theater Mode).
* **True Shuffle:** Custom implementation of the **Fisher-Yates algorithm** for completely unbiased, mathematical queue shuffling.
* **Optimized Rendering:** Built using heavily memoized React Hooks and Contexts to prevent audio stuttering and unnecessary DOM re-renders during playback.

<div align="center">
  <img src="assets/-with-lyrics.png" alt="Desktop Player with Lyrics" width="65%" style="border-radius: 8px;"/>
  <img src="assets/lyrics-in-player-sm.jpg" alt="Mobile Player with Lyrics" width="30%" style="border-radius: 8px; margin-left: 2%;"/>
</div>

### 🎨 Dynamic UI & Personalization
* **Mobile-First Responsive Design:** Flawlessly scales across desktop, tablet, and mobile devices with dedicated bottom navigation and responsive modals.
* **Multi-Theme Engine:** 10+ dynamically injected themes featuring 5 premium color palettes, each with meticulously mapped Light and Dark mode variants, managed via a global `ThemeContext` and CSS variables.
* **Interactive Library:** Curate Liked Songs, manage custom Playlists, and view your complete chronological Listening History.
* **Smart Image Cropping:** Users can upload custom Profile Pictures and Banners using an integrated React Cropper, directly piped into **Cloudinary** for on-the-fly edge CDN compression.

<div align="center">
  <img src="assets/user-page.png" alt="Custom User Profile Page" width="49%" style="border-radius: 8px;"/>
  <img src="assets/library.png" alt="User Library and Playlists" width="49%" style="border-radius: 8px;"/>
</div>
<br>
<div align="center">
  <img src="assets/usermenu-sm.jpg" alt="Mobile User Menu" width="31%" style="border-radius: 8px;"/>
  <img src="assets/userprofile-sm.jpg" alt="Mobile Profile" width="31%" style="border-radius: 8px; margin: 0 2%;"/>
  <img src="assets/settings-sm.jpg" alt="Mobile Settings" width="31%" style="border-radius: 8px;"/>
</div>

### 🛡️ Enterprise-Grade Security & Auth
* **Dual-Token Architecture:** Highly secure JWT authentication utilizing short-lived Access Tokens alongside long-lived, HttpOnly Refresh Tokens.
* **Silent Token Rotation:** Global Axios Interceptors automatically catch 401 Unauthorized errors, request a new access token in the background, and retry the failed request without interrupting the user's session.
* **Role-Based Access Control (RBAC):** Strict middleware protecting administrative routes, with granular read/write/delete permissions separated across `User`, `Moderator`, and `Admin` tiers.

### ⚙️ Content Management System (CMS)
* **Catalog Management:** Dedicated interfaces to manage the complex relational database of Artists, Animes, and Songs. Fully functional on both desktop and mobile.
* **Timed Lyrics Editor:** A specialized admin tool to perfectly sync `.lrc` formatted lyrics to audio timestamps.

<div align="center">
  <img src="assets/admin-page.png" alt="Admin Dashboard Desktop" width="65%" style="border-radius: 8px;"/>
  <img src="assets/admin-sm.jpg" alt="Admin Dashboard Mobile" width="30%" style="border-radius: 8px; margin-left: 2%;"/>
</div>
<br>
<div align="center">
  <img src="assets/admin-add-times-lyrics.png" alt="Timed Lyrics Editor" width="49%" style="border-radius: 8px;"/>
  <img src="assets/add-song.png" alt="Add Song Interface" width="49%" style="border-radius: 8px;"/>
</div>

### 📊 Admin Analytics
A comprehensive data visualization suite giving server administrators a bird's-eye view of platform health, user registration velocity, and global listening telemetry.

<div align="center">
  <img src="assets/analytics.png" alt="Analytics and Telemetry Dashboard" width="100%" style="border-radius: 8px;"/>
</div>

---

## 🛠️ Technology Stack

| Category | Technologies |
|---|---|
| **Frontend** | React, Vite, Tailwind CSS, Context API |
| **Backend** | Node.js, Express.js, RESTful APIs |
| **Database** | PostgreSQL |
| **Network/API** | Axios (Global Interceptors for Auth/Token Refresh) |
| **Media Hosting** | Cloudinary CDN (On-the-fly WebP optimization) |
| **DevOps & Cloud** | Docker (Alpine), AWS EC2, Nginx, DuckDNS, GitHub Actions |
| **Security** | Let's Encrypt (Certbot HTTPS), CORS, JWT Dual-Token |

---

## 🚀 DevOps & CI/CD Pipeline

The infrastructure of YumeTunes is built for production, heavily utilizing Docker and automated workflows to ensure zero-downtime deployments on an AWS Free Tier instance.

1. **Dockerized Environment:** The entire application runs on ultra-lightweight **Alpine Linux Docker images**, orchestrated via `docker-compose.yml`.
2. **Nginx Reverse Proxy:** Nginx acts as the gatekeeper, automatically routing API requests to the Node backend while efficiently caching and serving assets.
3. **Automated CI/CD:** Powered by **GitHub Actions**. Every push to the `main` branch triggers an automated sequence that connects to the AWS EC2 instance via SSH keys, pulls the latest code, and rebuilds the Docker containers.
4. **Memory Management:** Configured with Linux Swap Files to ensure stable builds on low-memory cloud instances without locking up the server.

---

<div align="center">
  <b>Built with <span style="color:#F87171">♥</span> for Anime Fans</b><br>
  <sub>Designed and developed by Staggered95</sub>
</div>