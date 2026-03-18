import { useState, useEffect } from 'react'

export function useSpotifyAuth() {
    const [accessToken, setAccessToken] = useState(null);
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        // grab token from URL
        // store in sessionStorage
        // setAccessToken
        const params = new URLSearchParams(window.location.search);
        const token = params.get('access_token');

        if (token){
            setAccessToken(token);

            sessionStorage.setItem('spotify_access_token', token)

            window.history.replaceState(null, "", window.location.pathname);

            setStatus('done');
        } else {
            const stored = sessionStorage.getItem('spotify_access_token');
            if (stored) {
                setAccessToken(stored);
                setStatus('done');
            } else {
                setStatus('error');
            }
        }
    }, [])

    return { accessToken, status }
}