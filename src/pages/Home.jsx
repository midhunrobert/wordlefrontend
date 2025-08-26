import { useState, useEffect } from "react";
import Login from "../components/Login";
import Register from "../components/Register";
import Game from "./Game";
import Leaderboard from "../components/Leaderboard";
import API from "../api/api";
import './Home.css';

export default function Home() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false); // toggle form
  const [refreshLeaderboard, setRefreshLeaderboard] = useState(false);

  const handleLeaderboardUpdate = () => setRefreshLeaderboard(prev => !prev);

  // Load user from token on app start
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      API.getCurrentUser().then((data) => {
        if (data) setUser(data);
        else localStorage.removeItem("token"); // invalid token
      });
    }
  }, []);

  // If not logged in, show either Login or Register
  if (!user) {
    return (
      <div className="wl-auth-container">
        {showRegister ? (
          <Register onAuth={setUser} onSwitchToLogin={() => setShowRegister(false)} />
        ) : (
          <Login onAuth={setUser} onSwitchToRegister={() => setShowRegister(true)} />
        )}
      </div>
    );
  }

  // Logged-in view
  return (
    <div className="wl-home-container">
      <header className="wl-home-header">
        <h1 className="wl-home-welcome">Welcome, {user.username}</h1>
        <button className="wl-home-logout" onClick={() => { localStorage.removeItem("token"); setUser(null); }}>
          Logout
        </button>
      </header>
      <main className="wl-home-main">
        <div className="wl-home-game">
          <Game onLeaderboardUpdate={handleLeaderboardUpdate} />
        </div>
        <div className="wl-home-leaderboard">
          <Leaderboard key={refreshLeaderboard} />
        </div>
      </main>
    </div>
  );
}
