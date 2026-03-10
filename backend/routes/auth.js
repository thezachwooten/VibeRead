import express from 'express'
import querystring from 'querystring'
import axios from 'axios'

const router = express.Router()

// Login to Spotify Auth: GET -> /login
router.get('/login', (req, res) => {
    const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
    const REDIRECT_URI = process.env.REDIRECT_URI
    const SCOPES = 'user-top-read user-read-recently-played user-read-private'

    const params = querystring.stringify({
        response_type: 'code',
        client_id: CLIENT_ID,
        scope: SCOPES,
        redirect_uri: REDIRECT_URI
    })

    res.redirect(`https://accounts.spotify.com/authorize?${params}`)
})

router.get('/callback', async (req, res) => {
    const { code, error } = req.query;

    if (error) {
        return res.redirect(`${process.env.FRONTEND_URL}?error=access_denied`);
    }

    if (!code) {
        return res.redirect(`${process.env.FRONTEND_URL}?error=no_code`);
    }

    const reqCode = code;

    const REDIRECT_URI = process.env.REDIRECT_URI;
    const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
    const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

    const body = querystring.stringify({
        grant_type: 'authorization_code',
        code: reqCode,
        redirect_uri: REDIRECT_URI
    });

    try {
        // get access token
        const { data } = await axios.post('https://accounts.spotify.com/api/token', body, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`
            }
        });

        const { access_token, refresh_token, expires_in } = data;

        res.redirect(`${process.env.FRONTEND_URL}/dashboard?access_token=${access_token}&refresh_token=${refresh_token}&expires_in=${expires_in}`);
    } catch (err) {
        console.error(err.response?.data || err.message);
        res.redirect(`${process.env.FRONTEND_URL}?error=token_exchange_failed`);
    }
});

export default router