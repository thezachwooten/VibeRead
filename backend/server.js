import express from 'express'
import cors from 'cors';
import dotenv from 'dotenv';
import AuthRoute from './routes/auth.js'

dotenv.config();

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


app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`)  
})