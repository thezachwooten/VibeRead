import express from 'express'
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

// ROUTE IMPORTS
import AuthRoute from './routes/auth.js'
import SpotifyRoute from './routes/spotify.js'
import AnalysisRoute from './routes/analysis.js'

const app = express();

const PORT = process.env.PORT || 3001;

// MIDDLEWARE
app.use(express.json());
app.use(cors());

// HOME Page
app.get('/', (req, res) => {
    res.send('Hello World!')
});

// ROUTES
app.use('/auth', AuthRoute);
app.use('/spotify', SpotifyRoute);
app.use('/analysis', AnalysisRoute);


app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`)  
})