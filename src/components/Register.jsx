import { useState } from "react";
import API from "../api/api";
import './Register.css';

export default function Register({ onAuth, onSwitchToLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // NEW


  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/auth/register", { username, password });
      localStorage.setItem("token", res.data.token);
      onAuth(res.data.user);
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fsr-container">
      <form className="fsr-form" onSubmit={handleRegister}>
        <h2 className="fsr-title">
          <span className="fsr-title-facts">FACTS</span>
          <span className="fsr-title-wordle">wordle</span>
        </h2>
        
        <input
          className="fsr-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          disabled={loading}
          required
        />
        <input
          className="fsr-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          disabled={loading}
          required
        />
        <button 
          type="submit" 
          className="fsr-button" 
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="fsr-switch">
          Already have an account?{" "}
          <span className="fsr-link" onClick={onSwitchToLogin}>
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
