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

// Acquire user's top artists: GET -> /top-artists
router.get('/top-artists', requireToken, async (req, res) => {
    const TOP_ARTISTS_URL = 'https://api.spotify.com/v1/me/top/artists';

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
        res.status(500).json({ error: 'Failed to fetch top artists' })
    }
});

// Acquire all users data and clean into one simple format for frontend: GET -> /summary
router.get('/summary', requireToken, async(req, res) => {
    const token = req.accessToken;

    const {time_range = 'medium_term', limit = 50} = req.query;

    try {
        const [profileRes, tracksRes, artistsRes] = await Promise.all([
            axios.get('https://api.spotify.com/v1/me', {headers : {authorization : `Bearer ${token}`}}),
            axios.get('https://api.spotify.com/v1/me/top/tracks', {headers : {authorization : `Bearer ${token}`},
            params: {time_range, limit}}),
            axios.get('https://api.spotify.com/v1/me/top/artists', {headers : {authorization : `Bearer ${token}`},
            params: {time_range, limit}})
        ])

        // Get the info from top track result we need
        const trackSummary = tracksRes.data.items.map(t => ({
            id: t.id,
            name: t.name,
            artist: t.artists[0].name,
            image: t.album.images[1]?.url,
            popularity: t.popularity
        }));

        // Get the info from top artists we need
        const artistsSummary = artistsRes.data.items.map(t => ({
            name: t.name,
            genres: t.genres || [],
            image: t.images[1]?.url
        }));

        // Get the tracksIds together
        const trackIds = trackSummary.map(t => t.id).join(',');

        const username = profileRes.data.display_name;
        const userImg = profileRes.data.images[0].url
        
        const summary = {
            profile : {name: username, image: userImg},
            topTracks: trackSummary,
            topArtists: artistsSummary,
            timeRange: time_range
        }

        res.json(summary);


    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(500).json({error : 'Failed to fetch summary'})
    }
});

export default router