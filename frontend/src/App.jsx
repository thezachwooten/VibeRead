import styles from './styles/Login.module.css';

export default function App() {
  const handleDemo = () => {
    sessionStorage.setItem('mode', 'demo');
    window.location.href = '/dashboard';
  }

  const handleSpotifyLogin = () => {
    sessionStorage.setItem('mode', 'spotify');
    window.location.href = 'http://127.0.0.1:3001/auth/login'
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <h1>Welcome</h1>

        <div className={styles.spotifyLoginCard}>
          <p>Log in with Spotify (Not available due to spotify api rules, request a demo of this directly from me!)</p>
          <button onClick={handleSpotifyLogin}>Login</button>
        </div>

        <div className={styles.demoModeLoginCard}>
          <p>Try Demo Mode</p>
          <button onClick={handleDemo}>Demo</button>
        </div>
      </div>
    </div>
  );
}