import { useState } from "react";

export default function SignupPage({ onGoHome, onGoLogin }) {

  // step 1 = signup form, step 2 = OTP verification
  const [step,      setStep]      = useState(1);

  // Step 1 state
  const [name,      setName]      = useState("");
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [role,      setRole]      = useState("");
  const [error,     setError]     = useState("");
  const [loading,   setLoading]   = useState(false);

  // Step 2 state
  const [otp,       setOtp]       = useState("");
  const [resendMsg, setResendMsg] = useState("");

  // ── Step 1: Signup → sends OTP ────────────────────────────────────────────
  async function handleSignup() {
    setError("");
    if (!name || !email || !password || !role) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: name, email, password, role })
      });
      const data = await res.json();
      if (res.ok) {
        setStep(2); // move to OTP screen
      } else {
        setError(data.message || "Registration failed.");
      }
    } catch {
      setError("Cannot connect to server. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  }

  // ── Step 2: Verify OTP ────────────────────────────────────────────────────
  async function handleVerifyOtp() {
    setError("");
    if (!otp || otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Email verified successfully! You can now sign in.");
        onGoLogin();
      } else {
        setError(data.message || "Invalid OTP. Please try again.");
      }
    } catch {
      setError("Cannot connect to server. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  }

  // ── Step 2: Resend OTP ────────────────────────────────────────────────────
  async function handleResendOtp() {
    setError("");
    setResendMsg("");
    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        setResendMsg("New OTP sent to " + email);
      } else {
        setError(data.message || "Failed to resend OTP.");
      }
    } catch {
      setError("Cannot connect to server.");
    }
  }

  // ── Render Step 2: OTP Verification ──────────────────────────────────────
  if (step === 2) {
    return (
      <div className="login-page">
        <div className="login-left">

          <div className="portal-name">Placement Automation Tool</div>
          <div className="portal-sub">Email Verification</div>

          <div style={{ fontSize: 40, marginBottom: 8 }}>📧</div>
          <h2>Verify Your Email</h2>
          <p className="subtitle">
            We sent a 6-digit OTP to<br />
            <strong>{email}</strong>
          </p>
          <p style={{ fontSize: 12, color: '#888', marginBottom: 16 }}>
            Check your inbox. If email is not configured, check the Eclipse console.
          </p>

          {error     && <div style={{ color: 'red',   fontSize: 13, marginBottom: 8 }}>{error}</div>}
          {resendMsg && <div style={{ color: 'green', fontSize: 13, marginBottom: 8 }}>{resendMsg}</div>}

          <div className="field">
            <label>Enter OTP</label>
            <input
              type="text"
              value={otp}
              maxLength={6}
              onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="6-digit OTP"
              style={{ textAlign: 'center', fontSize: 24, letterSpacing: 8, fontWeight: 'bold' }}
              autoComplete="off"
            />
          </div>

          <button className="submit-btn" onClick={handleVerifyOtp} disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <div className="bottom-links" style={{ marginTop: 12 }}>
            <a onClick={handleResendOtp} style={{ cursor: 'pointer' }}>
              Resend OTP
            </a>
            <a onClick={() => { setStep(1); setOtp(""); setError(""); setResendMsg(""); }}
               style={{ cursor: 'pointer', marginLeft: 16 }}>
              ← Change Email
            </a>
          </div>

          <div className="bottom-links" style={{ marginTop: 8 }}>
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

  // ── Render Step 1: Signup Form ────────────────────────────────────────────
  return (
    <div className="login-page">
      <div className="login-left">

        <div className="portal-name">Placement Automation Tool</div>
        <div className="portal-sub">Create your account</div>
        <h2>Sign Up</h2>
        <p className="subtitle">An OTP will be sent to your email to verify your account.</p>

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
          <select value={role} onChange={e => setRole(e.target.value)}
            style={{ padding:'12px 14px', border:'1.5px solid #e8e8e8', borderRadius:8, fontSize:15, color:'#2d1a0e', background:'#fafafa', width:'100%' }}>
            <option value="">Select your role</option>
            <option value="STUDENT">Student</option>
            <option value="COORDINATOR">Coordinator</option>
            <option value="TPO">TPO</option>
            <option value="ADMIN">Admin</option>
            <option value="HR">HR</option>
          </select>
        </div>

        {error && <div style={{ color:'red', fontSize:13, marginBottom:8 }}>{error}</div>}

        <button className="submit-btn" onClick={handleSignup} disabled={loading}>
          {loading ? "Sending OTP..." : "Create Account & Send OTP"}
        </button>

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