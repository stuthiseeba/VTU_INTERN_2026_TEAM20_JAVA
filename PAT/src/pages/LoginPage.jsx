import { useState } from "react";


export default function LoginPage({ role, onGoHome, onGoSignup, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notVerified, setNotVerified] = useState(false);

  const [showForgot, setShowForgot] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);

  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [forgotPassword, setForgotPassword] = useState("");

  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ── Login ────────────────────────────────────────────────────────────────
  async function handleLogin() {
    setError("");
    setNotVerified(false);

    try {
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

        if (msg.toLowerCase().includes("not verified")) {
          setNotVerified(true);
        }
      }
    } catch {
      setError("Cannot connect to server.");
    }
  }

  // ── Step 1: Send OTP ─────────────────────────────────────────────────────
  async function handleSendOtp() {
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
        setForgotSuccess("OTP sent to your email");
        setForgotStep(2);
      } else {
        setForgotError(data.message || "Failed to send OTP");
      }
    } catch {
      setForgotError("Cannot connect to server.");
    }
  }

  // ── Step 2: Reset Password using OTP ─────────────────────────────────────
  async function handleResetPassword() {
    setForgotError("");
    setForgotSuccess("");

    if (!forgotOtp || !forgotPassword) {
      setForgotError("Please enter OTP and new password.");
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: forgotEmail,
          otp: forgotOtp,
          newPassword: forgotPassword
        })
      });

      const data = await res.json();

      if (res.ok) {
        setForgotSuccess("Password reset successful!");

        setTimeout(() => {
          setShowForgot(false);
          setForgotStep(1);
          setForgotEmail("");
          setForgotOtp("");
          setForgotPassword("");
          setForgotError("");
          setForgotSuccess("");
        }, 2500);
      } else {
        setForgotError(data.message || "Reset failed");
      }
    } catch {
      setForgotError("Cannot connect to server.");
    }
  }

  // ── Forgot Password UI ───────────────────────────────────────────────────
  if (showForgot) {
    return (
      <div className="login-page">
        <div className="login-left">
          <div className="portal-name">Placement Automation Tool</div>
          <div className="portal-sub">{role} Portal</div>

          <h2>{forgotStep === 1 ? "Forgot Password" : "Reset Password"}</h2>

          <p className="subtitle">
            {forgotStep === 1
              ? "Enter your email to receive OTP"
              : "Enter OTP and new password"}
          </p>

          {forgotStep === 1 ? (
            <>
              <div className="field">
                <label>Email</label>
                <input
                  type="text"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  placeholder="name@example.com"
                />
              </div>

              <button className="submit-btn" onClick={handleSendOtp}>
                Send OTP
              </button>
            </>
          ) : (
            <>
              <div className="field">
                <label>OTP</label>
                <input
                  type="text"
                  value={forgotOtp}
                  onChange={e => setForgotOtp(e.target.value)}
                  placeholder="Enter OTP"
                />
              </div>

              <div className="field">
                <label>New Password</label>
                {/* <input
                  type="password"
                  value={forgotPassword}
                  onChange={e => setForgotPassword(e.target.value)}
                  placeholder="Enter new password"
                /> */}
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={forgotPassword}
                    onChange={e => setForgotPassword(e.target.value)}
                    placeholder="Enter new password"
                    style={{ width: "100%", paddingRight: "40px" }}
                  />

                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer"
                    }}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </span>
                </div>
              </div>

              <button className="submit-btn" onClick={handleResetPassword}>
                Reset Password
              </button>
            </>
          )}

          {forgotError && <div style={{ color: "red" }}>{forgotError}</div>}
          {forgotSuccess && <div style={{ color: "green" }}>{forgotSuccess}</div>}

          <div className="bottom-links">
            <a onClick={() => setShowForgot(false)}>Back to login</a>
          </div>
        </div>

        {/* RIGHT PANEL — now consistent with the rest of the app */}
        <div className="login-right">
          <img
            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=900&q=80"
            alt="Campus"
          />
          <div className="overlay"></div>
          <div className="overlay-text">
            <h2>Your career journey starts here.</h2>
            <p>
              Manage placements, connect with companies, and track your progress —
              all in one platform.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Login UI ─────────────────────────────────────────────────────────────
  return (
    <div className="login-page">

      {/* LEFT PANEL */}
      <div className="login-left">
        <div className="portal-name">Placement Automation Tool</div>
        <div className="portal-sub">{role} Portal</div>

        <h2>Welcome back</h2>
        <p className="subtitle">Enter your credentials to access your account</p>

        <div className="field">
          <label>Email</label>
          <input
            type="text"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="name@example.com"
          />
        </div>

        <div className="field">
          <div className="field-row">
            <label>Password</label>
            <a className="forgot" onClick={() => setShowForgot(true)}>
              Forgot password?
            </a>
          </div>

          {/* <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter your password"
          /> */}
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={{ width: "100%", paddingRight: "40px" }}
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer"
              }}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
          
        </div>

        {error && (
          <div style={{ color: "red", fontSize: 13, marginBottom: 8 }}>
            {error}
          </div>
        )}

        <button className="submit-btn" onClick={handleLogin}>
          Sign in as {role}
        </button>

        <div className="bottom-links">
          <span>
            Don't have an account?{" "}
            <a onClick={onGoSignup}>Sign up</a>
          </span>
          <button className="back-btn" onClick={onGoHome}>
            Go to home page
          </button>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="login-right">
        <img
          src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=900&q=80"
          alt="Campus"
        />
        <div className="overlay"></div>
        <div className="overlay-text">
          <h2>Your career journey starts here.</h2>
          <p>
            Manage placements, connect with companies, and track your progress —
            all in one platform.
          </p>
        </div>
      </div>

    </div>
  );
}
