import { useState } from "react";
import API from "../api/api";
import './Login.css';

export default function Login({ onAuth, onSwitchToRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // NEW


  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // start loading

    try {
      const res = await API.post("/auth/login", { username, password });
      localStorage.setItem("token", res.data.token);
      onAuth(res.data.user);
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }finally {
      setLoading(false); // stop loading no matter what
    }
  };

  return (
    <div className="fsl-container">
      <form className="fsl-form" onSubmit={handleLogin}>
        <h2 className="fsl-title">
          <span className="fsl-title-facts">FACTS</span>
          <span className="fsl-title-wordle">wordle</span>
        </h2>

        <input
          className="fsl-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          disabled={loading}  // prevent multiple clicks
          required
        />
        <input
          className="fsl-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          disabled={loading}  // prevent multiple clicks
          required
        />
        <button 
          type="submit" 
          className="fsl-button" 
          disabled={loading}  // prevent multiple clicks
        >
          {loading ? "Logging in..." : "Login"}
        </button>


        <p className="fsl-switch">
          Not registered?{" "}
          <span className="fsl-link" onClick={onSwitchToRegister}>
            Sign up
          </span>
        </p>
      </form>
    </div>
  );
}
