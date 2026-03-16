import { useState, useEffect } from "react";

const inputMap = {
  announcements: { titleId:'ann-title', bodyId:'ann-body', label:'Announcement' },
  companies:     { titleId:'comp-title', bodyId:'comp-body', label:'Company' },
  drives:        { titleId:'drive-title', bodyId:'drive-body', label:'Drive' },
  partnerships:  { titleId:'part-title', bodyId:'part-body', label:'Partnership' },
  global:        { titleId:'global-title', bodyId:'global-body', label:'Entry' },
};

function ContentSection({ type, coordUserId }) {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const m = inputMap[type];

  useEffect(() => {
    fetch(`http://localhost:8080/api/content/${type}`)
      .then(r => r.json())
      .then(data => setItems(data.map(i => ({ id:i.id, title:i.title, body:i.body }))))
      .catch(() => {});
  }, [type]);

  async function addItem() {
    if (!title.trim()) return;
    try {
      const res = await fetch("http://localhost:8080/api/content", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ type, title, body, coordinatorUserId: coordUserId || "0" })
      });
      const data = await res.json();
      setItems(prev => [...prev, { id: data.id, title, body }]);
      setTitle(""); setBody("");
    } catch { alert("Cannot connect to server."); }
  }

  async function removeItem(id, idx) {
    if (id) await fetch(`http://localhost:8080/api/content/${id}`, { method:"DELETE" }).catch(()=>{});
    setItems(prev => prev.filter((_,i) => i !== idx));
  }

  return (
    <div>
      <div className="add-content-form">
        <h4>Add {m.label}</h4>
        <input type="text" value={title} onChange={e=>setTitle(e.target.value)} placeholder={`${m.label} title`} />
        <textarea value={body} onChange={e=>setBody(e.target.value)} placeholder={`${m.label} details...`}></textarea>
        <button onClick={addItem}>Post {m.label}</button>
      </div>
      {items.length === 0
        ? <div className="empty-state"><div className="e-icon">📭</div><p>No items added yet.</p></div>
        : items.map((item, i) => (
          <div className="content-item" key={item.id || i}>
            <div className="ci-text"><h4>{item.title}</h4><p>{item.body||''}</p></div>
            <div className="ci-actions">
              <button className="action-btn btn-delete" onClick={() => removeItem(item.id, i)}>Remove</button>
            </div>
          </div>
        ))
      }
    </div>
  );
}

export default function CoordinatorDashboard({ user, onLogout }) {
  const [tab, setTab] = useState("c-overview");
  const [students, setStudents] = useState([]);

  useEffect(() => { loadStudents(); }, []);

  async function loadStudents() {
    try {
      const res = await fetch("http://localhost:8080/api/auth/students");
      setStudents(await res.json());
    } catch {}
  }

  async function deleteStudent(id) {
    if (!confirm("Are you sure you want to delete this student?")) return;
    try {
      const res = await fetch(`http://localhost:8080/api/auth/students/${id}`, { method:"DELETE" });
      if (res.ok) loadStudents();
      else alert("Failed to delete student.");
    } catch { alert("Cannot connect to server."); }
  }

  async function viewProfile(userId) {
    try {
      const res = await fetch(`http://localhost:8080/api/student/profile/${userId}`);
      const d = await res.json();
      if (!d.userId) { alert("This student has not filled their profile yet."); return; }
      alert(`Student Profile:\n\nPhone: ${d.phone||'-'}\nLinkedIn: ${d.linkedin||'-'}\nAddress: ${d.address||'-'}\nGrad Year: ${d.gradYear||'-'}\nCGPA: ${d.cgpa||'-'}\nDepartment: ${d.department||'-'}\nCollege: ${d.college||'-'}\n10th: ${d.score10||'-'} (${d.year10||'-'})\n12th: ${d.score12||'-'} (${d.year12||'-'})\nDegree: ${d.degreeName||'-'} - ${d.specialization||'-'}\nSoft Skills: ${d.softSkills||'-'}\nTech Skills: ${d.techSkills||'-'}`);
    } catch { alert("Cannot connect to server."); }
  }

  const tabs = [
    ['c-overview','🏠','Overview'],['c-students','👥','Students'],
    ['c-announcements','📢','Announcements'],['c-companies','🏢','About Companies'],
    ['c-drives','📅','Drive Schedules'],['c-partnerships','🤝','Partnerships'],['c-global','🌍','Global Footprints']
  ];

  return (
    <div className="dash-layout">
      <div className="dash-sidebar">
        <div className="s-logo">Placement<span>Portal</span></div>
        <div className="s-user">
          <div className="s-avatar">{(user.name||'C')[0].toUpperCase()}</div>
          <div className="s-name">{user.name}</div>
          <div className="s-role">Coordinator</div>
        </div>
        <div className="dash-nav">
          {tabs.map(([id,icon,label]) => (
            <a key={id} className={tab===id?'active':''} onClick={() => setTab(id)}><span className="nav-icon">{icon}</span> {label}</a>
          ))}
        </div>
        <div className="dash-logout"><button onClick={onLogout}>← Logout</button></div>
      </div>

      <div className="dash-main">
        {tab === 'c-overview' && (
          <div>
            <div className="dash-topbar"><div><h1>Coordinator Dashboard</h1><p>Manage students and homepage content</p></div></div>
            <div className="stat-cards">
              <div className="stat-card"><div className="stat-val">{students.length}</div><div className="stat-label">Total Students</div></div>
              <div className="stat-card"><div className="stat-val">{students.filter(s=>!s.name).length}</div><div className="stat-label">Pending Verifications</div></div>
              <div className="stat-card"><div className="stat-val">{students.filter(s=>s.name).length}</div><div className="stat-label">Verified Students</div></div>
            </div>
            <div className="profile-card">
              <h3>Quick Actions</h3>
              <div style={{display:'flex',gap:12,flexWrap:'wrap',marginTop:8}}>
                <button className="action-btn btn-view" style={{padding:'10px 20px',fontSize:14}} onClick={()=>setTab('c-students')}>View All Students</button>
                <button className="action-btn btn-verify" style={{padding:'10px 20px',fontSize:14}} onClick={()=>setTab('c-announcements')}>Post Announcement</button>
              </div>
            </div>
          </div>
        )}

        {tab === 'c-students' && (
          <div>
            <div className="dash-topbar"><div><h1>Students</h1><p>All registered students</p></div></div>
            <div className="profile-card" style={{padding:0,overflow:'hidden'}}>
              <table className="coord-table">
                <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {students.length === 0
                    ? <tr><td colSpan={5} style={{textAlign:'center',color:'#bbb',padding:40}}>No students registered yet.</td></tr>
                    : students.map((s,i) => (
                      <tr key={s.id}>
                        <td>{i+1}</td>
                        <td>{s.name||'-'}</td>
                        <td>{s.email}</td>
                        <td><span className="badge badge-active">Active</span></td>
                        <td>
                          <button className="action-btn btn-view" onClick={()=>viewProfile(s.id)}>View Profile</button>
                          <button className="action-btn btn-delete" onClick={()=>deleteStudent(s.id)}>Delete</button>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'c-announcements' && <div><div className="dash-topbar"><div><h1>Announcements</h1></div></div><ContentSection type="announcements" coordUserId={user.userId} /></div>}
        {tab === 'c-companies' && <div><div className="dash-topbar"><div><h1>About Companies</h1></div></div><ContentSection type="companies" coordUserId={user.userId} /></div>}
        {tab === 'c-drives' && <div><div className="dash-topbar"><div><h1>Drive Schedules</h1></div></div><ContentSection type="drives" coordUserId={user.userId} /></div>}
        {tab === 'c-partnerships' && <div><div className="dash-topbar"><div><h1>Partnerships</h1></div></div><ContentSection type="partnerships" coordUserId={user.userId} /></div>}
        {tab === 'c-global' && <div><div className="dash-topbar"><div><h1>Global Footprints</h1></div></div><ContentSection type="global" coordUserId={user.userId} /></div>}
      </div>
    </div>
  );
}
