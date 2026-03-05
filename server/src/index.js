import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import songRoutes from './routes/songRoutes.js';
import animeRoutes from './routes/animeRoutes.js'
import artistRoutes from './routes/artistRoutes.js'
import genreRoutes from './routes/genreRoutes.js'
import authRoutes from './routes/authRoutes.js'
import playlistRoutes from './routes/playlistRoutes.js'
import userRoutes from './routes/userRoutes.js'
import searchRoutes from './routes/searchRoutes.js'
import homeRoutes from './routes/homeRoutes.js'
import adminRoutes from './routes/adminRoutes.js'

const app = express();

const port = 5000;
const __file_url_path = import.meta.url;
const __filepath = fileURLToPath(__file_url_path);
const __dirpath = path.dirname(__filepath);

//MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use('/images/covers', express.static(path.join(__dirpath, '../../public/images/covers')));
app.use('/images/users', express.static(path.join(__dirpath, '../../public/images/users')));
app.use('/images/banners', express.static(path.join(__dirpath, '../../public/images/banners')));
app.use('/audio', express.static(path.join(__dirpath, '../../public/audio')));

//ROUTES
app.use('/songs', songRoutes);
app.use('/animes', animeRoutes);
app.use('/artists', artistRoutes);
app.use('/genres', genreRoutes);
app.use('/auth', authRoutes);
app.use('/playlists', playlistRoutes);
app.use('/user', userRoutes);
app.use('/search', searchRoutes);
app.use('/home', homeRoutes);
app.use('/admin', adminRoutes);

app.listen(5000, () => {
  console.log(`Server running on port ${port}`);
})