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

![YumeTunes Hero Banner](https://via.placeholder.com/1200x400/181828/9D5CFA?text=YumeTunes+-+Anime+Music+Sanctuary)

</div>

---

## ✨ Features & Architecture

YumeTunes is a highly modular, responsive, full-stack PERN application designed with performance, UX, and robust DevOps practices in mind.

### 🎧 The Playback Engine
* **Modular Audio System:** Three distinct player views powered by a global Playback Context:
  * **Utility Player:** Always accessible background playback.
  * **Bottom Player:** Visual indicator of the current track.
  * **Fullscreen Player:** A focused theater mode featuring **Pretty Timed Lyrics** synced to the audio.
* **Smart Queue & Shuffle:** Custom implementation of the **Fisher-Yates algorithm** for true, unbiased shuffling.
* **Optimized Rendering:** Built using React Hooks and Contexts (Audio, Song, Theme, Auth, User, Loading, Toast) to prevent unnecessary re-renders.

### 👤 Personalization & Telemetry
* **Intelligent Recommendations:** A Node.js `node-cron` job runs in the background, analyzing user telemetry (songs played, listen time, skip rate) to serve customized recommendations.
* **User Customization:** Users can upload custom Profile Pictures (PFP) and Banners using an integrated **Smart Image Cropper**, managed via Cloudinary upload middlewares.
* **Interactive Library:** Manage Liked Songs, custom Playlists, and view full Listening History.
* **Dynamic Theming:** Seamless switching between Light/Dark modes and multiple premium color palettes via global ThemeContext.

### 🛡️ Roles & Admin Dashboard
* **Role-Based Access Control (RBAC):**
  * `User`: Read access and personal library management.
  * `Moderator`: Read and update access for community curation.
  * `Admin`: Full CRUD access and deletion rights.
* **Admin Control Panel:** A dedicated portal with full data visualizations to manage users, site content, and the music catalog.

### ⚡ UI/UX Engineering
* **Smart UI Components:** Custom-built "Smart Box Auto Positioner" for dynamic dropdowns, and a modular `BaseModal` handling diverse components (PlaylistModal, UserMenu, Auth, etc.).
* **Performance:** Implemented frontend **Pagination** and search **Debouncing** to drastically reduce API load.
* **Responsive Design:** Flawlessly scales across `sm`, `md`, and `lg` devices using modern CSS.

---

## 🛠️ Technology Stack

| Category | Technologies |
|---|---|
| **Frontend** | React, Vite, Tailwind CSS, Context API |
| **Backend** | Node.js, Express.js, RESTful APIs |
| **Database** | PostgreSQL |
| **Network/API** | Axios (Global Interceptors for Auth/Token Refresh) |
| **Media Hosting** | Cloudinary |
| **DevOps & Cloud** | Docker (Alpine), AWS EC2, Nginx, DuckDNS, GitHub Actions |
| **Security** | Let's Encrypt (Certbot HTTPS), CORS, JWT |

---

## 🚀 DevOps & CI/CD Pipeline

The infrastructure of YumeTunes is built for production, heavily utilizing Docker and automated workflows.

![Architecture Diagram](https://via.placeholder.com/1000x300/22223a/58E1FA?text=GitHub+Actions+%E2%86%92+AWS+EC2+%E2%86%92+Docker+%E2%86%92+Nginx)

1. **Dockerized Environment:** The entire application runs on ultra-lightweight **Alpine Linux Docker images**, orchestrated via `docker-compose.yml`.
2. **Nginx Reverse Proxy:** Nginx acts as the gatekeeper, automatically routing API requests to the Node backend while efficiently serving static audio files directly from the mounted volume.
3. **Automated CI/CD:** Powered by **GitHub Actions**. Every push to the `main` branch triggers an automated sequence that connects to the AWS EC2 instance via SSH keys, pulls the latest code, and rebuilds the Docker containers with zero downtime using `rsync` and `scp`.
4. **SSL & Networking:** Bound to `yumetunes.duckdns.org` (Dynamic DNS) with automated HTTPS certificate generation and renewal via **Certbot**.

---

## 📸 Screenshots

*(Replace these placeholder links with screenshots of your actual app!)*

<div align="center">
  <img src="https://via.placeholder.com/800x450/181828/F2F2F5?text=Homepage+&+Discover+Feed" width="49%" alt="Home Page">
  <img src="https://via.placeholder.com/800x450/181828/F2F2F5?text=Fullscreen+Player+with+Timed+Lyrics" width="49%" alt="Fullscreen Player">
</div>
<br>
<div align="center">
  <img src="https://via.placeholder.com/800x450/181828/F2F2F5?text=Custom+Profile+&+Smart+Cropper" width="49%" alt="User Profile">
  <img src="https://via.placeholder.com/800x450/181828/F2F2F5?text=Admin+Data+Visualization+Dashboard" width="49%" alt="Admin Dashboard">
</div>

---

<div align="center">
  <b>Built with <span style="color:#F87171">♥</span> for Anime Fans</b><br>
  <sub>Designed and developed by Staggered95</sub>
</div>