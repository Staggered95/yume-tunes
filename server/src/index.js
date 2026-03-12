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

const app = express();

const port = 5000;
const __file_url_path = import.meta.url;
const __filepath = fileURLToPath(__file_url_path);
const __dirpath = path.dirname(__filepath);

//MIDDLEWARES
//app.use(cors());


// A dynamic CORS setup that allows localhost AND your phone's IP!
app.use(cors({
    origin: function (origin, callback) {
        // 1. Allow requests with no origin (like Postman or curl)
        if (!origin) return callback(null, true);
        
        // 2. Allow localhost OR any local network IP (192.168.x.x)
        if (origin.startsWith('http://localhost') || 
            origin.startsWith('http://10.214.') || 
            origin.startsWith('http://192.168.') ||
            origin.startsWith('http://13.60.26.11') ||
            origin.startsWith('http://yumetunes') ||
            origin === 'https://yume-tunes.vercel.app') { // <-- Add your exact Vercel URL!
            return callback(null, true);
        }
        
        // 3. Block anyone else
        return callback(new Error('Not allowed by CORS'), false);
    },
    credentials: true, // STILL REQUIRED for the HTTP-Only cookies to work!
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

//RECOMMENDATION CRON
cron.schedule('0 3 * * *', () => {
    console.log('🌙 Running Nightly Recommendation Engine...');
    generateRecommendations();
});

// FOR TESTING RIGHT NOW: Uncomment the line below to run it every 1 minute!
//cron.schedule('* * * * *', () => { console.log('Testing Engine...'); generateRecommendations(); });

app.listen(5000, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
})