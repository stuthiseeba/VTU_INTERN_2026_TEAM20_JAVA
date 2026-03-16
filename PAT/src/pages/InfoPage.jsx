import { useEffect, useState } from "react";

const infoData = {
  announcements: { title: "Announcements", subtitle: "Latest placement news and updates", icon: "📢" },
  companies:     { title: "About Companies", subtitle: "Profiles of recruiting companies", icon: "🏢" },
  drives:        { title: "Drive Schedules", subtitle: "Upcoming placement drive dates", icon: "📅" },
  partnerships:  { title: "Our Partnerships", subtitle: "Companies we have partnered with", icon: "🤝" },
  global:        { title: "Global Footprints", subtitle: "Our reach across industries and locations", icon: "🌍" },
};

export default function InfoPage({ infoKey, onGoHome }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const d = infoData[infoKey] || {};

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8080/api/content/${infoKey}`)
      .then(r => r.json())
      .then(data => { setItems(data); setLoading(false); })
      .catch(() => { setItems([]); setLoading(false); });
  }, [infoKey]);

  return (
    <div className="info-page">
      <div className="navbar">
        <div className="logo" onClick={onGoHome}>Placement<span>Portal</span></div>
        <nav><a onClick={onGoHome}>← Back to Home</a></nav>
      </div>
      <div className="info-header">
        <h1>{d.title}</h1>
        <p>{d.subtitle}</p>
      </div>
      <div className="info-body">
        {loading ? (
          <p style={{ color: '#aaa', textAlign: 'center', padding: '40px' }}>Loading...</p>
        ) : items.length === 0 ? (
          <div className="info-placeholder">
            <div className="big-icon">{d.icon}</div>
            <h3>No {d.title} yet</h3>
            <p>Nothing has been added here yet.</p>
            <button className="back-home-btn" onClick={onGoHome}>← Back to Home</button>
          </div>
        ) : (
          <>
            {items.map(item => (
              <div className="content-item" key={item.id} style={{ marginBottom: 16 }}>
                <div className="ci-text">
                  <h4>{item.title}</h4>
                  <p>{item.body || ''}</p>
                </div>
              </div>
            ))}
            <button className="back-home-btn" onClick={onGoHome} style={{ marginTop: 10 }}>← Back to Home</button>
          </>
        )}
      </div>
    </div>
  );
}
