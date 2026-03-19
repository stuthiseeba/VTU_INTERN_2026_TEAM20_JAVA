import { useState, useEffect } from "react";

export default function TpoDashboard({ user, onLogout }) {
  const [tab, setTab] = useState("tpo-overview");
  const [drives, setDrives] = useState([]);
  const [funnelIdx, setFunnelIdx] = useState(null);
  const [applications, setApplications] = useState([]);  // New state for applications
  const [form, setForm] = useState({ company:'', role:'', driveDate:'', driveTime:'', venue:'', eligibility:'', rounds:'' });

  useEffect(() => { loadDrives(); }, []);

  async function loadDrives() {
    if (!user.userId) return;
    try {
      const res = await fetch(`http://localhost:8080/api/tpo/drives/${user.userId}`);
      const data = await res.json();
      const loaded = [];
      for (const d of data) {
        const sr = await fetch(`http://localhost:8080/api/tpo/drive/${d.id}/students`);
        const students = await sr.json();
        loaded.push({ id:d.id, company:d.company, role:d.role, date:d.driveDate, time:d.driveTime, venue:d.venue, eligibility:d.eligibility, rounds:d.rounds, status:d.status, students: students.map(s=>({ id:s.id, name:s.studentName, email:s.studentEmail, roundIdx:s.roundIndex, status:s.status })) });
      }
      setDrives(loaded);
    } catch {}
  }

  async function loadApplications(driveId) {
    try {
      const res = await fetch(`http://localhost:8080/applications/drive/${driveId}`);
      const data = await res.json();
      setApplications(data);
    } catch {}
  }

  async function addDrive() {
    if (!form.company || !form.driveDate) { alert("Company name and date are required."); return; }
    try {
      const res = await fetch("http://localhost:8080/api/tpo/drive", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ tpoUserId: user.userId, ...form })
      });
      const data = await res.json();
      setDrives(prev => [...prev, { id:data.driveId, ...form, status:"Upcoming", students:[] }]);
      setForm({ company:'', role:'', driveDate:'', driveTime:'', venue:'', eligibility:'', rounds:'' });
    } catch { alert("Cannot connect to server."); }
  }

  async function removeDrive(idx) {
    const d = drives[idx];
    if (d.id) await fetch(`http://localhost:8080/api/tpo/drive/${d.id}`, { method:"DELETE" }).catch(()=> {});
    setDrives(prev => prev.filter((_,i)=>i!==idx));
    if (funnelIdx === idx) setFunnelIdx(null);
  }

  function openFunnel(idx) { setFunnelIdx(idx); setTab("tpo-funnel"); }

  const allStudents = drives.flatMap(d => d.students);

  return (
    <div className="dash-layout">
      <div className="dash-sidebar">
        <div className="s-logo">Placement<span>Portal</span></div>
        <div className="s-user">
          <div className="s-avatar">{(user.name||'T')[0].toUpperCase()}</div>
          <div className="s-name">{user.name}</div>
          <div className="s-role">TPO</div>
        </div>
        <div className="dash-nav">
          {[['tpo-overview','📊','Overview'],['tpo-drives','🏢','Manage Drives'],['tpo-students','👥','All Students'],['tpo-funnel','🔄','Recruitment Funnel'],['tpo-applications','📄','Applications']].map(([id,icon,label]) => (  // Added Applications tab
            <a key={id} className={tab===id?'active':''} onClick={() => setTab(id)}><span className="nav-icon">{icon}</span> {label}</a>
          ))}
        </div>
        <div className="dash-logout"><button onClick={onLogout}>← Logout</button></div>
      </div>

      <div className="dash-main">
        {tab === 'tpo-overview' && (
          <div>
            <div className="dash-topbar"><div><h1>TPO Dashboard Overview</h1><p>Manage placement drives and track progress</p></div></div>
            <div className="stat-cards">
              <div className="stat-card"><div className="stat-val">{drives.length}</div><div className="stat-label">Total Drives</div></div>
              <div className="stat-card"><div className="stat-val">{allStudents.length}</div><div className="stat-label">Total Applications</div></div>
              <div className="stat-card"><div className="stat-val">{allStudents.filter(s => s.status === 'Selected').length}</div><div className="stat-label">Selections</div></div>
              <div className="stat-card"><div className="stat-val">{allStudents.filter(s => s.status === 'Rejected').length}</div><div className="stat-label">Rejections</div></div>
            </div>
            <div className="profile-card">
              <h3>Recent Drives</h3>
              {drives.slice(0,3).map((d,i) => (
                <div className="content-item" key={i}>
                  <div className="ci-text">
                    <h4>{d.company} — {d.role}</h4>
                    <p>📅 {d.date} • {d.students.length} applicants</p>
                  </div>
                  <div className="ci-actions">
                    <button className="action-btn btn-view" onClick={() => openFunnel(i)}>View Funnel</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'tpo-drives' && (
          <div>
            <div className="dash-topbar"><div><h1>Manage Drives</h1><p>Create and manage placement drives</p></div></div>
            <div className="add-content-form">
              <h4>Add New Drive</h4>
              <input type="text" placeholder="Company Name" value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} />
              <input type="text" placeholder="Role (e.g. SDE)" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} />
              <input type="date" placeholder="Drive Date" value={form.driveDate} onChange={e => setForm(p => ({ ...p, driveDate: e.target.value }))} />
              <input type="text" placeholder="Drive Time (e.g. 10:00 AM)" value={form.driveTime} onChange={e => setForm(p => ({ ...p, driveTime: e.target.value }))} />
              <input type="text" placeholder="Venue" value={form.venue} onChange={e => setForm(p => ({ ...p, venue: e.target.value }))} />
              <input type="text" placeholder="Eligibility (e.g. CGPA > 8.0)" value={form.eligibility} onChange={e => setForm(p => ({ ...p, eligibility: e.target.value }))} />
              <input type="text" placeholder="Rounds (e.g. Written, Technical, HR)" value={form.rounds} onChange={e => setForm(p => ({ ...p, rounds: e.target.value }))} />
              <button onClick={addDrive}>Add Drive</button>
            </div>
            <div className="profile-card">
              <h3>Existing Drives</h3>
              {drives.map((d,i) => (
                <div className="content-item" key={i}>
                  <div className="ci-text">
                    <h4>{d.company} — {d.role}</h4>
                    <p>📅 {d.date} • {d.students.length} applicants • Status: {d.status}</p>
                  </div>
                  <div className="ci-actions">
                    <button className="action-btn btn-view" onClick={() => openFunnel(i)}>View Funnel</button>
                    <button className="action-btn btn-delete" onClick={() => removeDrive(i)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'tpo-students' && (
          <div>
            <div className="dash-topbar"><div><h1>All Students</h1><p>View all students who have applied</p></div></div>
            <div className="profile-card">
              <h3>Student List</h3>
              <div className="coord-table">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Drive</th>
                      <th>Round</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allStudents.map((s,i) => (
                      <tr key={i}>
                        <td>{s.name}</td>
                        <td>{s.email}</td>
                        <td>{drives.find(d => d.students.includes(s))?.company}</td>
                        <td>{s.roundIdx}</td>
                        <td><span className={`badge badge-${s.status.toLowerCase()}`}>{s.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {tab === 'tpo-funnel' && funnelIdx !== null && (
          <div>
            <div className="dash-topbar">
              <div><h1>Recruitment Funnel — {drives[funnelIdx].company}</h1><p>Track student progress through rounds</p></div>
              <button className="action-btn btn-view" onClick={() => { setFunnelIdx(null); setTab("tpo-drives"); }}>← Back</button>
            </div>
            <div className="profile-card">
              <h3>Student Progress</h3>
              <div className="coord-table">
                <table>
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Email</th>
                      <th>Current Round</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {drives[funnelIdx].students.map((s,i) => (
                      <tr key={i}>
                        <td>{s.name}</td>
                        <td>{s.email}</td>
                        <td>{s.roundIdx}</td>
                        <td><span className={`badge badge-${s.status.toLowerCase()}`}>{s.status}</span></td>
                        <td>
                          <button className="action-btn btn-verify" onClick={() => {/* Move to next round */}}>Advance</button>
                          <button className="action-btn btn-delete" onClick={() => {/* Reject */}}>Reject</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {tab === 'tpo-applications' && (  // New Applications tab
          <div>
            <div className="dash-topbar"><h1>Student Applications</h1><p>Review applications for your drives</p></div>
            {applications.length === 0 ? (
              <div className="profile-card"><div className="empty-state"><div className="e-icon">📄</div><p>No applications yet. Select a drive to view.</p></div></div>
            ) : (
              applications.map((app, i) => (
                <div className="content-item" key={i}>
                  <div className="ci-text">
                    <h4>Application #{app.applicationId}</h4>
                    <p>Student ID: {app.studentId} | Drive ID: {app.driveId} | Stage: {app.stage} | Status: {app.status}</p>
                  </div>
                  <div className="ci-actions">
                    <button className="action-btn btn-view">View Details</button>
                  </div>
                </div>
              ))
            )}
            <div className="profile-card">
              <h3>Select Drive to View Applications</h3>
              {drives.map((d, i) => (
                <button key={i} className="action-btn btn-view" onClick={() => loadApplications(d.id)}>View Applications for {d.company}</button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}