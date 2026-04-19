import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const inputMap = {
  announcements: { label: 'Announcement' },
  partnerships:  { label: 'Partnership' },
};

function ContentSection({ type, coordUserId }) {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const m = inputMap[type];

  useEffect(() => {
    fetch(`http://localhost:8080/api/content/${type}`)
      .then(r => r.json())
      .then(data => setItems(Array.isArray(data) ? data.map(i => ({ id: i.id, title: i.title, body: i.body })) : []))
      .catch(() => {});
  }, [type]);

  async function addItem() {
    if (!title.trim()) return;
    try {
      const res = await fetch("http://localhost:8080/api/content", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, title, body, coordinatorUserId: coordUserId || "0" })
      });
      const data = await res.json();
      setItems(prev => [...prev, { id: data.id, title, body }]);
      setTitle(""); setBody("");
    } catch { alert("Cannot connect to server."); }
  }

  async function removeItem(id, idx) {
    if (id) await fetch(`http://localhost:8080/api/content/${id}`, { method: "DELETE" }).catch(() => {});
    setItems(prev => prev.filter((_, i) => i !== idx));
  }

  return (
    <div>
      <div className="add-content-form">
        <h4>Add {m.label}</h4>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder={`${m.label} title`} />
        <textarea value={body} onChange={e => setBody(e.target.value)} placeholder={`${m.label} details...`}></textarea>
        <button onClick={addItem}>Post {m.label}</button>
      </div>
      {items.length === 0
        ? <div className="empty-state"><div className="e-icon">📭</div><p>No items added yet.</p></div>
        : items.map((item, i) => (
          <div className="content-item" key={item.id || i}>
            <div className="ci-text"><h4>{item.title}</h4><p>{item.body || ''}</p></div>
            <div className="ci-actions"><button className="action-btn btn-delete" onClick={() => removeItem(item.id, i)}>Remove</button></div>
          </div>
        ))
      }
    </div>
  );
}

export default function CoordinatorDashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState("");
const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);

  const pathParts = location.pathname.split('/');
  const activeTab = pathParts[2] || 'overview';

  useEffect(() => { if (errorMessage) { setTimeout(() => setErrorMessage(""), 3000); } }, [errorMessage])

  useEffect(() => {
    if (location.pathname === '/coordinator' || location.pathname === '/coordinator/') {
      navigate('/coordinator/overview', { replace: true });
    }
  }, [location.pathname]);

  useEffect(() => { loadStudents(); }, []);

  async function loadStudents() {
    try {
      const res = await fetch("http://localhost:8080/api/auth/students");
      const data = await res.json();
      setStudents(Array.isArray(data) ? data : []);
    } catch { }
  }

  async function deleteStudent(id) {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      const res = await fetch(`http://localhost:8080/api/auth/students/${id}`, { method: "DELETE" });
      if (res.ok) loadStudents();
      else setErrorMessage("❌ Failed to delete student.");
    } catch { setErrorMessage("❌ Cannot connect to server."); }
  }

  async function viewProfile(userId) {
    try {
      const res = await fetch(`http://localhost:8080/api/student/profile/${userId}`);
      const d = await res.json();
      if (!d.userId) {
  setErrorMessage("⚠️ This student has not filled their profile yet.");
  return;
}

setSelectedStudent(d);
    } catch {
  setErrorMessage("❌ Cannot connect to server.");
}
  }

  const navItems = [
    ['overview',       '🏠', 'Overview'],
    ['students',       '👥', 'Students'],
    ['announcements',  '📢', 'Announcements'],
    ['partnerships',   '🤝', 'Partnerships'],
  ];

  return (
    <div className="dash-layout">
      {errorMessage && (
  <div style={{
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "#f8d7da",
    color: "#721c24",
    padding: "20px",
    borderRadius: "10px",
    zIndex: 9999
  }}>
    {errorMessage}
  </div>
)}
{selectedStudent && (
  <div style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backdropFilter: "blur(8px)",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999
  }}>
    <div style={{
      background: "linear-gradient(135deg, #ffffff, #f8f9ff)",
      borderRadius: "18px",
      width: "500px",
      maxHeight: "85vh",
      overflowY: "auto",
      padding: "25px 30px",
      boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
      animation: "popupScale 0.3s ease"
    }}>

      {/* HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
        borderBottom: "2px solid #eee",
        paddingBottom: "10px"
      }}>
        <h2 style={{
          margin: 0,
          fontSize: "22px",
          color: "#2c3e50"
        }}>
          👤 Student Profile
        </h2>

        <span
          onClick={() => setSelectedStudent(null)}
          style={{
            cursor: "pointer",
            fontSize: "20px",
            fontWeight: "bold",
            color: "#999",
            transition: "0.2s"
          }}
        >
          ✖
        </span>
      </div>

      {/* CONTACT */}
      <div style={{ marginBottom: "18px" }}>
        <h4 style={{ color: "#6c5ce7", marginBottom: "6px" }}>📞 Contact</h4>
        <p><b>Phone:</b> {selectedStudent.phone || "-"}</p>
        <p><b>LinkedIn:</b> {selectedStudent.linkedin || "-"}</p>
        <p><b>Address:</b> {selectedStudent.address || "-"}</p>
      </div>

      {/* ACADEMIC */}
      <div style={{ marginBottom: "18px" }}>
        <h4 style={{ color: "#00b894", marginBottom: "6px" }}>🎓 Academic</h4>
        <p><b>CGPA:</b> {selectedStudent.cgpa || "-"}</p>
        <p><b>Department:</b> {selectedStudent.department || "-"}</p>
        <p><b>College:</b> {selectedStudent.college || "-"}</p>
        <p><b>10th:</b> {selectedStudent.score10 || "-"} ({selectedStudent.year10 || "-"})</p>
        <p><b>12th:</b> {selectedStudent.score12 || "-"} ({selectedStudent.year12 || "-"})</p>
      </div>

      {/* SKILLS */}
      <div>
        <h4 style={{ color: "#fd79a8", marginBottom: "6px" }}>💼 Skills</h4>
        <p><b>Soft:</b> {selectedStudent.softSkills || "-"}</p>
        <p><b>Tech:</b> {selectedStudent.techSkills || "-"}</p>
      </div>

    </div>
  </div>
)}
      <div className="dash-sidebar">
        <div className="s-logo">Placement<span>Portal</span></div>
        <div className="s-user">
          <div className="s-avatar">{(user.name || 'C')[0].toUpperCase()}</div>
          <div className="s-name">{user.name}</div>
          <div className="s-role">Coordinator</div>
        </div>
        <div className="dash-nav">
          {navItems.map(([id, icon, label]) => (
            <a key={id} className={activeTab === id ? 'active' : ''} onClick={() => navigate(`/coordinator/${id}`)}>
              <span className="nav-icon">{icon}</span> {label}
            </a>
          ))}
        </div>
        <div className="dash-logout"><button onClick={onLogout}>← Logout</button></div>
      </div>

      <div className="dash-main">
        {activeTab === 'overview' && (
          <div>
            <div className="dash-topbar"><div><h1>Coordinator Dashboard</h1><p>Manage students and homepage content</p></div></div>
            <div className="stat-cards">
              <div className="stat-card"><div className="stat-val">{students.length}</div><div className="stat-label">Total Students</div></div>
              <div className="stat-card"><div className="stat-val">{students.filter(s => !s.isVerified).length}</div><div className="stat-label">Pending Verifications</div></div>
              <div className="stat-card"><div className="stat-val">{students.filter(s => s.isVerified).length}</div><div className="stat-label">Verified Students</div></div>
            </div>
            <div className="profile-card">
              <h3>Quick Actions</h3>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
                <button className="action-btn btn-view" style={{ padding: '10px 20px', fontSize: 14 }} onClick={() => navigate('/coordinator/students')}>View All Students</button>
                <button className="action-btn btn-verify" style={{ padding: '10px 20px', fontSize: 14 }} onClick={() => navigate('/coordinator/announcements')}>Post Announcement</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div>
            <div className="dash-topbar"><div><h1>Students</h1><p>All registered students</p></div></div>
            <div className="profile-card" style={{ padding: 0, overflow: 'hidden' }}>
              <table className="coord-table">
                <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {students.length === 0
                    ? <tr><td colSpan={5} style={{ textAlign: 'center', color: '#bbb', padding: 40 }}>No students registered yet.</td></tr>
                    : students.map((s, i) => (
                      <tr key={s.id}>
                        <td>{i + 1}</td>
                        <td>{s.name || '-'}</td>
                        <td>{s.email}</td>
                        <td><span className={`badge ${s.isVerified ? 'badge-active' : 'badge-pending'}`}>{s.isVerified ? 'Verified' : 'Pending'}</span></td>
                        <td>
                          <button className="action-btn btn-view" onClick={() => viewProfile(s.id)}>View Profile</button>
                          <button className="action-btn btn-delete" onClick={() => deleteStudent(s.id)}>Delete</button>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'announcements' && (
          <div>
            <div className="dash-topbar"><div><h1>Announcements</h1></div></div>
            <ContentSection type="announcements" coordUserId={user.userId} />
          </div>
        )}

        {activeTab === 'partnerships' && (
          <div>
            <div className="dash-topbar"><div><h1>Partnerships</h1></div></div>
            <ContentSection type="partnerships" coordUserId={user.userId} />
          </div>
        )}
      </div>
    </div>
  );
}