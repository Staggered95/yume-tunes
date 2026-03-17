import express from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import cron from 'node-cron';
import { fileURLToPath } from 'url';
import { generateRecommendations } from './services/recommendationEngine.js'
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
import contactRoutes from './routes/contactRoutes.js';

const app = express();
app.set('trust proxy', 1);

const port = 5000;
// i will be removing this in future because files are being served by nginx now
const __file_url_path = import.meta.url;
const __filepath = fileURLToPath(__file_url_path);
const __dirpath = path.dirname(__filepath);




const allowedOrigins = [
    'http://localhost:5173',       
    'https://yumetunes.duckdns.org',      
    'https://www.yumetunes.duckdns.org'   
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin && process.env.NODE_ENV !== 'production') {
            return callback(null, true);
        }
        
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        
        console.warn(`Blocked CORS request from origin: ${origin}`); 
        return callback(new Error('Not allowed by CORS'), false);
    },
    credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());
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
app.use('/contact', contactRoutes);

cron.schedule('0 3 * * *', () => {
    console.log('🌙 Running Nightly Recommendation Engine...');
    generateRecommendations();
});

// FOR TESTING: Uncomment the line below to run it every 1 minute!
//cron.schedule('* * * * *', () => { console.log('Testing Engine...'); generateRecommendations(); });

app.listen(5000, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
})