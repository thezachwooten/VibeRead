import { useState } from 'react'

export function useSpotifyAuth() {
    const [accessToken, setAccessToken] = useState(null);

    useEffect(() => {
        // grab token from URL
        // store in sessionStorage
        // setAccessToken
        const params = new URLSearchParams(window.location.search);
        const token = params.get('access_token');

        if (token){
            setAccessToken(token);

            console.log(`Access token: ${accessToken}`);

            sessionStorage.setItem('spotify_access_token', token)

            window.history.replaceState(null, "", window.location.pathname);
        } else {
            const stored = sessionStorage.getItem('spotify_access_token')
            if (stored) setAccessToken(stored)
        }
    }, [])

    return { accessToken }
}