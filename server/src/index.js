import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import songRoutes from './routes/songRoutes.js';
import animeRoutes from './routes/animeRoute.js'
import artistRoutes from './routes/artistRoute.js'
import genreRoutes from './routes/genreRoute.js'

const app = express();

const port = 5000;
const __file_url_path = import.meta.url;
const __filepath = fileURLToPath(__file_url_path);
const __dirpath = path.dirname(__filepath);

//MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use('/images/covers', express.static(path.join(__dirpath, '../../public/images/covers')));
app.use('/audio', express.static(path.join(__dirpath, '../../public/audio')));

//ROUTES
app.use('/songs', songRoutes);
app.use('/animes', animeRoutes);
app.use('/artists', artistRoutes);
app.use('/genres', genreRoutes);

app.listen(5000, () => {
  console.log(`Server running on port ${port}`);
})