import { useState } from "react";

export default function SignupPage({ onGoHome, onGoLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSignup() {
    setError(""); setSuccess("");
    if (!name || !email || !password || !role) { setError("Please fill in all fields."); return; }
    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Account created! You can now sign in.");
        setTimeout(() => onGoLogin(), 1500);
      } else {
        setError(data.message || "Registration failed.");
      }
    } catch {
      setError("Cannot connect to server. Make sure backend is running.");
    }
  }

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="portal-name">Placement Automation Tool</div>
        <div className="portal-sub">Create your account</div>
        <h2>Sign Up</h2>
        <p className="subtitle">Fill in your details to register</p>
        <div className="field">
          <label>Full Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" autoComplete="off" />
        </div>
        <div className="field">
          <label>Email</label>
          <input type="text" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" autoComplete="off" />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Create a password" autoComplete="new-password" />
        </div>
        <div className="field">
          <label>Role</label>
          <select value={role} onChange={e => setRole(e.target.value)} style={{ padding:'12px 14px', border:'1.5px solid #e8e8e8', borderRadius:8, fontSize:15, color:'#2d1a0e', background:'#fafafa', width:'100%' }}>
            <option value="">Select your role</option>
            <option value="STUDENT">Student</option>
            <option value="COORDINATOR">Coordinator</option>
            <option value="TPO">TPO</option>
            <option value="ADMIN">Admin</option>
            <option value="HR">HR</option>
          </select>
        </div>
        {error && <div style={{ color:'red', fontSize:13, marginBottom:8 }}>{error}</div>}
        {success && <div style={{ color:'green', fontSize:13, marginBottom:8 }}>{success}</div>}
        <button className="submit-btn" onClick={handleSignup}>Create Account</button>
        <div className="bottom-links">
          <span>Already have an account? <a onClick={onGoLogin}>Sign in</a></span>
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
