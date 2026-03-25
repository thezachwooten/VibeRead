import express from 'express'
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai'
import createAnalysisRouter from './routes/analysis.js'

dotenv.config();

// ROUTE IMPORTS
import AuthRoute from './routes/auth.js'
import SpotifyRoute from './routes/spotify.js'

const app = express();

const PORT = process.env.PORT || 3001;


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

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
app.use('/analysis', createAnalysisRouter(model));


app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`)  
})