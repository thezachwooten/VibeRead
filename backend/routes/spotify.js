import axios from 'axios'
import express from 'express'

const router = express.Router()

// MIDDLWARE
// grab token when redirected from frontend
const requireToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ error: 'Access token required' })
    req.accessToken = token
    next()
}

// Acquire user profile data: GET -> /me
router.get('/me', requireToken, async (req, res) => {
    const PROFILE_URL = 'https://api.spotify.com/v1/me'

    const token = req.accessToken; // Acquire the token from the req placed by the requireToken Middleware

    try {
        const { data } = await axios.get(PROFILE_URL, {
            headers: {
                'Authorization' : `Bearer ${token}`
            }
        })

        res.json(data)
    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(500).json({ error: 'Failed to fetch profile' })
    }

});

// Acquire user's top tracks: GET -> /top-tracks
router.get('/top-tracks', requireToken, async (req, res) => {
    const TOP_TRACKS_URL = 'https://api.spotify.com/v1/me/top/tracks';

    const token = req.accessToken;
    const { time_range = 'medium_term', limit = 50 } = req.query;

    try {
        const { data } = await axios.get(TOP_TRACKS_URL, {
            headers: {
                'Authorization' : `Bearer ${token}`
            },
            params: {time_range, limit}
        })

        res.json(data);
    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(500).json({ error: 'Failed to fetch top tracks' })
    }
});

export default router