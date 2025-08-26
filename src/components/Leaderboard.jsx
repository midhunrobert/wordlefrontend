import { useEffect, useState } from "react";
import API from "../api/api";
import './Leaderboard.css';

export default function Leaderboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    API.get("/users/leaderboard").then((res) => setUsers(res.data));
  }, []);

  return (
    <div className="wl-leaderboard-container">
      <h2 className="wl-leaderboard-title">Leaderboard</h2>
      <ul className="wl-leaderboard-list">
        {users.map((u) => (
          <li key={u._id} className="wl-leaderboard-item">
            <span className="wl-leaderboard-username">{u.username}</span>
            <span className="wl-leaderboard-score">{u.score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
