export default function App() {
  const handleLogin = () => {
    window.location.href = 'http://127.0.0.1:3001/auth/login'
  };

  return (
    <div>
      <h1>VibeRead</h1>
      <p>Connect your Spotify and discover what your music says about you.</p>
      <button onClick={handleLogin}>Connect Spotify</button>
    </div>
  );
}