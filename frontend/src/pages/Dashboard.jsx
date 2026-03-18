import { useState, useEffect } from 'react'
import { useSpotifyAuth } from '../hooks/useSpotifyAuth'
import axios from 'axios'
import '../styles/Dashboard.css'

export default function Dashboard() {
    const [musicData, setMusicData] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [fetchStatus, setFetchStatus] = useState('idle');
    const { accessToken, status: authStatus } = useSpotifyAuth();

    
    useEffect(() => {
        const fetchData = async () => {
            try {
                setFetchStatus('loading');
                const fetchedMusicData = await axios.get('http://localhost:3001/spotify/summary', {headers : {Authorization: `Bearer ${accessToken}`}});
                if (fetchedMusicData) {
                    setMusicData(fetchedMusicData.data);
                    const fetchedAnalysis = await axios.post('http://localhost:3001/analysis/vibe', fetchedMusicData.data, {headers : {Authorization: `Bearer ${accessToken}`}});
                    setAnalysis(fetchedAnalysis.data);
                    console.log('musicData:', fetchedMusicData.data);
                    console.log('analysis:', fetchedAnalysis.data);
                    setFetchStatus('done');
                }
            } catch (err) {
                console.error(err);
                setFetchStatus('error');
            }
        }
        fetchData();
    }, [accessToken]);

    if (!accessToken) return <div>Not logged in</div>
    if (authStatus === 'loading') return <div>Loading...</div>
    if (authStatus === 'error') return <div>Not logged in</div>
    if (fetchStatus === 'loading') return <div>Loading your vibe...</div>
    if (fetchStatus === 'error') return <div>Something went wrong</div>


    return (
        <div className="dashboard">

            <div className="profile">
                <img src={musicData.profile.image} alt="profile" />
                <h2>{musicData.profile.name}</h2>
            </div>
            <div className="hero">
                <p className="listener-type">{analysis.listenerType}</p>
                <h1>{analysis.headline}</h1>
                <p>{analysis.summary}</p>
            </div>

            <div>
                <h3>Personality Traits</h3>
                <div className='traits-section>'>
                    {analysis.traits.map((trait, i) => (
                        <div key={i} className='trait'>
                            <div className='trait-header'>
                                <span className='trait-description'>{trait.label} </span>
                                <span>{Math.round(trait.score * 100)}</span>
                            </div>
                            <div className="trait-bar-bg">
                                <div 
                                    className="trait-bar-fill"
                                    style={{ width: `${trait.score * 100}%` }}
                                />
                                <p className="trait-description">{trait.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="deep-dive">
                <h3>Deep Dive</h3>
                <p>{analysis.deepDive}</p>
            </div>

            <div className="top-artists">
                <h3>Top Artists</h3>
                <div className='artist-grid'>
                    {musicData.topArtists.map((artist, i) => (
                        <div key={i} className="artist-card">
                            <img src={artist.image} alt={artist.name} />
                            <p>{artist.name}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className='top-tracks'>
                <h3>Top Tracks</h3>
                {musicData.topTracks.map((track, i) => (
                    <div key={i} className='track-card'>
                        <img src={track.image} alt={track.name} />
                        <div>
                            <p>{track.name}</p>
                            <p className='track-artist'>{track.artist}</p>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}