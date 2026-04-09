export default function HomePage({ onGoToInfo, onGoToLogin, onGoToSignup }) {
  return (
    <div>
      <div className="navbar">
        <div className="logo">Placement<span>Portal</span></div>
        <nav>
          <a onClick={() => onGoToInfo('contact')}>Contact</a>

          {/* ✅ NEW SIGNUP BUTTON */}
          <button 
            className="nav-btn signup-btn"
            onClick={() => onGoToSignup()}
          >
            Sign Up
          </button>

          {/* EXISTING LOGIN DROPDOWN */}
          <div className="nav-login-wrap">
            <button className="nav-btn">Login ▾</button>
            <div className="login-dropdown">
              <a onClick={() => onGoToLogin('Student')}>Student</a>
              <a onClick={() => onGoToLogin('Coordinator')}>Coordinator</a>
              <a onClick={() => onGoToLogin('TPO')}>TPO</a>
              <a onClick={() => onGoToLogin('Admin')}>Admin</a>
              <a onClick={() => onGoToLogin('HR')}>HR</a>
            </div>
          </div>
        </nav>
      </div>

      <div className="hero">
        <div className="hero-bg"></div>
        <div className="hero-inner">
          <div className="hero-text">
            <div className="hero-tag">Campus Placement Platform</div>
            <h1>Empowering Students<br />Through <span>Smart Placement</span><br />Automation</h1>
            <p>Connect with top recruiters, track applications, and manage your entire campus placement journey on one unified platform.</p>
          </div>
        </div>
      </div>

      <div className="roles-section">
        <div className="section-header">
          <h2>What We Offer</h2>
          <p>Everything you need to manage campus placements in one place</p>
          <div className="line"></div>
        </div>
        <div className="role-cards">
          <div className="role-card" onClick={() => onGoToInfo('announcements')}>
            <div className="rc-icon">📢</div>
            <h3>Announcements</h3>
            <p>Stay updated with latest placement news and alerts</p>
          </div>
          
          <div className="role-card" onClick={() => onGoToInfo('partnerships')}>
            <div className="rc-icon">🤝</div>
            <h3>Our Partnerships</h3>
            <p>Companies we have partnered with</p>
          </div>

        </div>
      </div>
    </div>
  );
}
