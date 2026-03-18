import { useState } from "react";

export default function LoginPage({ role, onGoHome, onGoSignup, onLoginSuccess }) {
  const [email,         setEmail]         = useState("");
  const [password,      setPassword]      = useState("");
  const [error,         setError]         = useState("");
  const [notVerified,   setNotVerified]   = useState(false);
  const [showForgot,    setShowForgot]    = useState(false);
  const [forgotEmail,   setForgotEmail]   = useState("");
  const [forgotPassword,setForgotPassword]= useState("");
  const [forgotError,   setForgotError]   = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");

  // ── Login ─────────────────────────────────────────────────────────────────
  async function handleLogin() {
    setError("");
    setNotVerified(false);
    try {
      // ✅ Using relative URL — Vite proxy forwards to port 8080
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        onLoginSuccess(data);
      } else {
        const msg = data.message || "Invalid email or password.";
        setError(msg);
        // Show verify link if account not verified
        if (msg.toLowerCase().includes("not verified")) {
          setNotVerified(true);
        }
      }
    } catch {
      setError("Cannot connect to server. Make sure backend is running.");
    }
  }

  // ── Forgot Password ───────────────────────────────────────────────────────
  async function handleForgotPassword() {
    setForgotError("");
    setForgotSuccess("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail })
      });
      const data = await res.json();
      if (res.ok) {
        setForgotSuccess("Reset token generated. Check console or email: " + (data.message || ""));
      } else {
        setForgotError(data.message || "Failed to process request.");
      }
    } catch {
      setForgotError("Cannot connect to server. Make sure backend is running.");
    }
  }

  // ── Forgot Password Screen ────────────────────────────────────────────────
  if (showForgot) {
    return (
      <div className="login-page">
        <div className="login-left">
          <div className="portal-name">Placement Automation Tool</div>
          <div className="portal-sub">{role} Portal</div>
          <h2>Reset Password</h2>
          <p className="subtitle">Enter your registered email address</p>
          <div className="field">
            <label>Email</label>
            <input type="text" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} placeholder="name@example.com" autoComplete="off" />
          </div>
          <div className="field">
            <label>New Password</label>
            <input type="password" value={forgotPassword} onChange={e => setForgotPassword(e.target.value)} placeholder="Enter new password" autoComplete="new-password" />
          </div>
          {forgotError   && <div style={{ color: 'red',   fontSize: 13, marginBottom: 8 }}>{forgotError}</div>}
          {forgotSuccess && <div style={{ color: 'green', fontSize: 13, marginBottom: 8 }}>{forgotSuccess}</div>}
          <button className="submit-btn" onClick={handleForgotPassword}>Reset Password</button>
          <div className="bottom-links">
            <a onClick={() => { setShowForgot(false); setForgotEmail(""); setForgotPassword(""); setForgotError(""); setForgotSuccess(""); }}>
              Back to login
            </a>
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

  // ── Login Screen ──────────────────────────────────────────────────────────
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
            <a className="forgot" onClick={() => setShowForgot(true)}>Forgot password?</a>
          </div>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" autoComplete="new-password" />
        </div>

        {error && (
          <div style={{ color: 'red', fontSize: 13, marginBottom: 8 }}>
            {error}
            {/* ✅ Show verify link if account not verified */}
            {notVerified && (
              <div style={{ marginTop: 6 }}>
                <a onClick={onGoSignup} style={{ color: '#c33764', fontWeight: 'bold', cursor: 'pointer' }}>
                  Click here to verify your email →
                </a>
              </div>
            )}
          </div>
        )}

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