import express from 'express';
import songRoutes from './routes/songRoutes.js';

const app = express();

app.use(express.json());
const port = 5000;

app.use('/songs', songRoutes);

app.listen(5000, () => {
  console.log(`Server running on port ${port}`);
})