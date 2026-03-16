import { useState } from "react";

export default function LoginPage({ role, onGoHome, onGoSignup, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin() {
    setError("");
    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        onLoginSuccess(data);
      } else {
        setError("Invalid email or password.");
      }
    } catch {
      setError("Cannot connect to server. Make sure backend is running.");
    }
  }

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="portal-name">Placement Automation Tool</div>
        <div className="portal-sub">{role} Portal</div>
        <h2>Welcome back</h2>
        <p className="subtitle">Enter your credentials to access your account</p>
        <div className="field">
          <label>Email</label>
          <input type="text" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" autoComplete="off" />
        </div>
        <div className="field">
          <div className="field-row">
            <label>Password</label>
            <a className="forgot">Forgot password?</a>
          </div>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" autoComplete="new-password" />
        </div>
        {error && <div style={{ color: 'red', fontSize: 13, marginBottom: 8 }}>{error}</div>}
        <button className="submit-btn" onClick={handleLogin}>Sign in as {role}</button>
        <div className="bottom-links">
          <span>Don't have an account? <a onClick={onGoSignup}>Sign up</a></span>
          <button className="back-btn" onClick={onGoHome}>Go to home page</button>
        </div>
      </div>
      <div className="login-right">
        <img src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=900&q=80" alt="Campus" />
        <div className="overlay"></div>
        <div className="overlay-text">
          <h2>Your career journey starts here.</h2>
          <p>Manage placements, connect with companies, and track your progress — all in one platform.</p>
        </div>
      </div>
    </div>
  );
}
