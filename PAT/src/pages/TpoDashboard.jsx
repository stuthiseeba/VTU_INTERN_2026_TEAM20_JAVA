import { useState, useEffect } from "react";

const DEPARTMENTS = ["CSE", "ISE", "ECE", "EEE", "MECH", "CIVIL", "AIML", "DS"];
const PROCESS_ROUNDS = ["Aptitude Test", "Coding Round", "Technical Interview", "Managerial Interview", "HR Interview", "Group Discussion"];

function latestStudents(studentRows) {
  const latestByEmail = new Map();

  for (const student of studentRows) {
    const existing = latestByEmail.get(student.email);
    if (!existing || student.roundIndex > existing.roundIndex || (student.roundIndex === existing.roundIndex && student.id > existing.id)) {
      latestByEmail.set(student.email, student);
    }
  }

  return Array.from(latestByEmail.values());
}

export default function TpoDashboard({ user, onLogout }) {
  const [tab, setTab] = useState("tpo-overview");
  const [drives, setDrives] = useState([]);
  const [funnelDriveId, setFunnelDriveId] = useState(null);
  const [applications, setApplications] = useState([]);

  // Initialized with all the new structured fields
  const [form, setForm] = useState({
    company: '', role: '', jobType: 'Full-time', ctc: '', stipend: '', location: '', companyType: 'Product-based',
    driveDate: '', driveTime: '', venue: '', driveMode: 'Offline',
    minCgpa: '', maxBacklogs: '0', tenthPercent: '', twelfthPercent: '', gapYears: '0',
    eligibleBranches: [], graduationYear: new Date().getFullYear(), yearAllowed: '4th year',
    rounds: [], registrationDeadline: '', resultDate: '', jdLink: '', applyLink: '', companyWebsite: '', bondDetails: '',
    status: 'Open', numberOfPositions: '', autoShortlist: false, sendEmailAlert: false
  });

  useEffect(() => { loadDrives(); }, []);

  async function loadDrives() {
    if (!user.userId) return;
    try {
      const res = await fetch(`http://localhost:8080/api/tpo/drives/${user.userId}`);
      const data = await res.json();

      if (!Array.isArray(data)) {
        setDrives([]);
        return;
      }
      const loaded = [];
      for (const d of data) {
        console.log("API DRIVE DATA:", d);

        const sr = await fetch(`http://localhost:8080/api/tpo/drive/${d.id}/students`);
        const students = await sr.json();
        const studentList = Array.isArray(students) ? students : [];

        loaded.push({
          id: d.id,
          company: d.company,
          role: d.role,
          date: d.driveDate,
          time: d.driveTime,
          venue: d.venue,
          status: d.status || 'Open',
          rounds: "Aptitude Test," + d.rounds,
          students: latestStudents(studentList.map(s => ({
            id: s.id,
            name: s.studentName,
            email: s.studentEmail,
            roundIndex: s.roundIndex,
            status: s.status
          })))
        });
      }
      setDrives(loaded);
    } catch { }
  }

  async function loadApplications(driveId) {
    try {
      const res = await fetch(`http://localhost:8080/applications/drive/${driveId}`);
      const data = await res.json();
      setApplications(Array.isArray(data) ? data : []);
    } catch { }
  }

  async function refreshDriveViews() {
    await loadDrives();
    if (funnelDriveId) {
      await loadApplications(funnelDriveId);
    }
  }

  async function addDrive() {
    if (!form.company || !form.driveDate) { alert("Company name and date are required."); return; }
    try {
      const res = await fetch("http://localhost:8080/api/tpo/drive", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tpoUserId: user.userId,
          ...form,
          eligibleBranches: (form.eligibleBranches || []).join(','),
          rounds: (form.rounds || []).join(',')
        })
      });
      if (!res.ok) throw new Error();

      // Reset form on success
      setForm({
        company: '', role: '', jobType: 'Full-time', ctc: '', stipend: '', location: '', companyType: 'Product-based',
        driveDate: '', driveTime: '', venue: '', driveMode: 'Offline',
        minCgpa: '', maxBacklogs: '0', tenthPercent: '', twelfthPercent: '', gapYears: '0',
        eligibleBranches: [], graduationYear: new Date().getFullYear(), yearAllowed: '4th year',
        rounds: [], registrationDeadline: '', resultDate: '', jdLink: '', applyLink: '', companyWebsite: '', bondDetails: '',
        status: 'Open', numberOfPositions: '', autoShortlist: false, sendEmailAlert: false
      });
      await loadDrives();
      alert("Drive added successfully!");
    } catch { alert("Cannot connect to server."); }
  }

  async function removeDrive(idx) {
    const d = drives[idx];
    try {
      if (d.id) {
        const res = await fetch(`http://localhost:8080/api/tpo/drive/${d.id}`, { method: "DELETE" });
        if (!res.ok) throw new Error();
      }
      if (funnelDriveId === d.id) {
        setFunnelDriveId(null);
        setTab("tpo-drives");
      }
      setApplications(prev => prev.filter(app => app.driveId !== d.id));
      await loadDrives();
    } catch {
      alert("Failed to delete drive.");
    }
  }

  async function advanceStudent(studentId) {
    try {
      const res = await fetch("http://localhost:8080/api/tpo/drive/student/promote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId })
      });
      if (!res.ok) throw new Error();
      await refreshDriveViews();
    } catch {
      alert("Failed to advance student.");
    }
  }

  async function rejectStudent(studentId) {
    try {
      const res = await fetch(`http://localhost:8080/api/tpo/drive/student/${studentId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Rejected" })
      });
      if (!res.ok) throw new Error();
      await refreshDriveViews();
    } catch {
      alert("Failed to update student status.");
    }
  }

  function openFunnel(driveId) { setFunnelDriveId(driveId); setTab("tpo-funnel"); }

  const selectedDrive = drives.find(d => d.id === funnelDriveId);
  const driveRounds =
    typeof selectedDrive?.rounds === "string"
      ? selectedDrive.rounds.split(",").map(r => r.trim())
      : Array.isArray(selectedDrive?.rounds)
        ? selectedDrive.rounds
        : [];

  const allStudents = drives.flatMap(d => d.students.map(s => ({ ...s, driveCompany: d.company })));
  const totalApplications = allStudents.length;


  return (
    <div className="dash-layout">
      <div className="dash-sidebar">
        <div className="s-logo">Placement<span>Portal</span></div>
        <div className="s-user">
          <div className="s-avatar">{(user.name || 'T').toUpperCase()}</div>
          <div className="s-name">{user.name}</div>
          <div className="s-role">TPO</div>
        </div>
        <div className="dash-nav">
          {[['tpo-overview', '📊', 'Overview'], ['tpo-drives', '🏢', 'Manage Drives'], ['tpo-students', '👥', 'All Students'], ['tpo-funnel', '🔄', 'Recruitment Funnel'], ['tpo-applications', '📄', 'Applications']].map(([id, icon, label]) => (
            <a key={id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)}><span className="nav-icon">{icon}</span> {label}</a>
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
              <div className="stat-card"><div className="stat-val">{totalApplications}</div><div className="stat-label">Total Applications</div></div>
              <div className="stat-card"><div className="stat-val">{allStudents.filter(s => s.status === 'Selected').length}</div><div className="stat-label">Selections</div></div>
              <div className="stat-card"><div className="stat-val">{allStudents.filter(s => s.status === 'Rejected').length}</div><div className="stat-label">Rejections</div></div>
            </div>
            <div className="profile-card">
              <h3>Recent Drives</h3>
              {drives.reverse().slice(0, 5).map((d, i) => (
                <div className="content-item" key={i}>
                  <div className="ci-text">
                    <h4>{d.company} — {d.role}</h4>
                    <p>📅 {d.date} • {d.students.length} applicants</p>
                  </div>
                  <div className="ci-actions">
                    <button className="action-btn btn-view" onClick={() => openFunnel(d.id)}>View Funnel</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'tpo-drives' && (
          <div>
            <div className="dash-topbar"><div><h1>Manage Drives</h1><p>Create and manage placement drives</p></div></div>

            <div className="add-content-form" style={{ padding: '20px', borderRadius: '10px', marginBottom: '30px' }}>
              <h3 style={{ marginBottom: '20px', color: '#e8651a' }}> Create New Placement Drive</h3>

              {/* SECTION 1: Basic Info */}
              <h5 style={{ borderBottom: '2px solid var(--border-color, #eee)', paddingBottom: '10px', marginBottom: '15px', color: '#e8651a' }}>Basic Information</h5>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px' }}>
                <input type="text" placeholder="Company Name" value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} style={{ padding: '10px', borderRadius: '5px' }} />
                <input type="text" placeholder="Role (e.g. SDE)" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} style={{ padding: '10px', borderRadius: '5px' }} />
                <div>
                  <select value={form.jobType} onChange={e => setForm(p => ({ ...p, jobType: e.target.value }))} style={{ padding: '10px', borderRadius: '5px', width: '100%', boxSizing: 'border-box' }}>
                    <option value="Full-time">Full-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Internship + PPO">Internship + PPO</option>
                  </select>
                </div>



                <div><select value={form.companyType} onChange={e => setForm(p => ({ ...p, companyType: e.target.value }))} style={{ padding: '10px', borderRadius: '5px', width: '100%', boxSizing: 'border-box' }}>
                  <option value="Product-based">Product-based</option>
                  <option value="Service-based">Service-based</option>
                  <option value="Startup">Startup</option>
                </select>
                </div>

                <input type="number" placeholder="CTC (LPA)" step="0.1" value={form.ctc} onChange={e => setForm(p => ({ ...p, ctc: e.target.value }))} style={{ padding: '10px', borderRadius: '5px' }} />
                <input type="number" placeholder="Stipend (per month)" value={form.stipend} onChange={e => setForm(p => ({ ...p, stipend: e.target.value }))} style={{ padding: '10px', borderRadius: '5px' }} />
                <input type="text" placeholder="Location (City)" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} style={{ padding: '10px', borderRadius: '5px' }} />
              </div>

              {/* SECTION 2: Drive Details */}
              <h5 style={{ borderBottom: '2px solid var(--border-color, #eee)', paddingBottom: '10px', marginBottom: '15px', color: '#e8651a' }}>Drive Details</h5>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: 'inherit', opacity: '0.7', display: 'block', marginBottom: '5px' }}>Drive Date</label>
                  <input type="date" value={form.driveDate} onChange={e => setForm(p => ({ ...p, driveDate: e.target.value }))} style={{ padding: '10px', borderRadius: '5px', width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: 'inherit', opacity: '0.7', display: 'block', marginBottom: '5px' }}>Time</label>
                  <input type="time" value={form.driveTime} onChange={e => setForm(p => ({ ...p, driveTime: e.target.value }))} style={{ padding: '10px', borderRadius: '5px', width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: 'inherit', opacity: '0.7', display: 'block', marginBottom: '5px' }}>Mode of Drive</label>
                  <select value={form.driveMode} onChange={e => setForm(p => ({ ...p, driveMode: e.target.value }))} style={{ padding: '10px', borderRadius: '5px', width: '100%' }}>
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: 'inherit', opacity: '0.7', display: 'block', marginBottom: '5px' }}>Venue / Link</label>
                  <input type="text" placeholder="Venue or Meet Link" value={form.venue} onChange={e => setForm(p => ({ ...p, venue: e.target.value }))} style={{ padding: '10px', borderRadius: '5px', width: '100%' }} />
                </div>
              </div>

              {/* SECTION 3: Eligibility */}
              <h5 style={{ borderBottom: '2px solid var(--border-color, #eee)', paddingBottom: '10px', marginBottom: '15px', color: '#e8651a' }}>3. Eligibility & Auto-Filtering</h5>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <input type="number" placeholder="Min CGPA (e.g. 7.5)" step="0.1" value={form.minCgpa} onChange={e => setForm(p => ({ ...p, minCgpa: e.target.value }))} style={{ padding: '10px', borderRadius: '5px', width: '100%', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <input type="number" placeholder="Max Backlogs Allowed" min="0" value={form.maxBacklogs} onChange={e => setForm(p => ({ ...p, maxBacklogs: e.target.value }))} style={{ padding: '10px', borderRadius: '5px', width: '100%', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <input type="number" placeholder="10th % (Optional)" step="0.1" value={form.tenthPercent} onChange={e => setForm(p => ({ ...p, tenthPercent: e.target.value }))} style={{ padding: '10px', borderRadius: '5px', width: '100%', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <input type="number" placeholder="12th/Diploma % (Optional)" step="0.1" value={form.twelfthPercent} onChange={e => setForm(p => ({ ...p, twelfthPercent: e.target.value }))} style={{ padding: '10px', borderRadius: '5px', width: '100%', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <input type="number" placeholder="Allowed Gap Years" min="0" value={form.gapYears} onChange={e => setForm(p => ({ ...p, gapYears: e.target.value }))} style={{ padding: '10px', borderRadius: '5px', width: '100%', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <select value={form.yearAllowed} onChange={e => setForm(p => ({ ...p, yearAllowed: e.target.value }))} style={{ padding: '10px', borderRadius: '5px', width: '100%', boxSizing: 'border-box' }}>
                    <option value="3rd year">3rd year</option>
                    <option value="4th year">4th year</option>
                    <option value="Both">Both (3rd & 4th)</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: '#e8651a' }}>Branches Allowed:</label>
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                  {DEPARTMENTS.map(dept => (
                    <label key={dept} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={form.eligibleBranches?.includes(dept)}
                        onChange={(e) => {
                          if (e.target.checked) setForm(p => ({ ...p, eligibleBranches: [...(p.eligibleBranches || []), dept] }));
                          else setForm(p => ({ ...p, eligibleBranches: (p.eligibleBranches || []).filter(d => d !== dept) }));
                        }}
                      />
                      {dept}
                    </label>
                  ))}
                </div>
              </div>

              {/* SECTION 4: Process */}
              <h5 style={{ borderBottom: '2px solid var(--border-color, #eee)', paddingBottom: '10px', marginBottom: '15px', color: '#e8651a' }}>4. Selection Process</h5>
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '25px' }}>
                {PROCESS_ROUNDS.map(round => (
                  <label key={round} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', cursor: 'pointer', background: 'var(--pill-bg, #f5f7fb)', padding: '8px 12px', borderRadius: '20px' }}>
                    <input
                      type="checkbox"
                      checked={form.rounds?.includes(round)}
                      onChange={(e) => {
                        if (e.target.checked) setForm(p => ({ ...p, rounds: [...(p.rounds || []), round] }));
                        else setForm(p => ({ ...p, rounds: (p.rounds || []).filter(r => r !== round) }));
                      }}
                    />
                    {round}
                  </label>
                ))}
              </div>

              {/* SECTION 5 & 6: Deadlines and Extras */}
              <h5 style={{ borderBottom: '2px solid var(--border-color, #eee)', paddingBottom: '10px', marginBottom: '15px', color: '#e8651a' }}>5. Deadlines & Links</h5>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: 'inherit', opacity: '0.7', display: 'block', marginBottom: '5px' }}>Registration Deadline</label>
                  <input type="date" value={form.registrationDeadline} onChange={e => setForm(p => ({ ...p, registrationDeadline: e.target.value }))} style={{ padding: '10px', borderRadius: '5px', width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: 'inherit', opacity: '0.7', display: 'block', marginBottom: '5px' }}>Result Date (Expected)</label>
                  <input type="date" value={form.resultDate} onChange={e => setForm(p => ({ ...p, resultDate: e.target.value }))} style={{ padding: '10px', borderRadius: '5px', width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: 'inherit', opacity: '0.7', display: 'block', marginBottom: '5px' }}>Bond Details</label>
                  <input type="text" placeholder="e.g. Yes - 2 Years" value={form.bondDetails} onChange={e => setForm(p => ({ ...p, bondDetails: e.target.value }))} style={{ padding: '10px', borderRadius: '5px', width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: 'inherit', opacity: '0.7', display: 'block', marginBottom: '5px' }}>JD / Apply Link</label>
                  <input type="url" placeholder="https://..." value={form.jdLink} onChange={e => setForm(p => ({ ...p, jdLink: e.target.value }))} style={{ padding: '10px', borderRadius: '5px', width: '100%' }} />
                </div>
              </div>

              {/* SECTION 7: Smart Automation */}
              <h5 style={{ borderBottom: '2px solid var(--border-color, #eee)', paddingBottom: '10px', marginBottom: '15px', color: '#e8651a' }}>6. Smart Automation</h5>
              <div style={{ display: 'flex', gap: '25px', marginBottom: '25px', padding: '15px', background: 'var(--pill-bg, #f9fafc)', borderRadius: '8px', border: '1px solid var(--border-color, #eee)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                  <input type="checkbox" checked={form.autoShortlist} onChange={e => setForm(p => ({ ...p, autoShortlist: e.target.checked }))} style={{ width: '18px', height: '18px' }} />
                  🤖 Auto-Shortlist Students
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                  <input type="checkbox" checked={form.sendEmailAlert} onChange={e => setForm(p => ({ ...p, sendEmailAlert: e.target.checked }))} style={{ width: '18px', height: '18px' }} />
                  📧 Send Email to Eligible Students
                </label>
              </div>

              <button onClick={addDrive} style={{ width: '100%', padding: '15px', fontSize: '16px', fontWeight: 'bold', background: '#2c3e50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                Save & Create Drive
              </button>
            </div>

            <div className="profile-card">
              <h3>Existing Drives</h3>
              {drives.map((d, i) => (
                <div className="content-item" key={i}>
                  <div className="ci-text">
                    <h4>{d.company} — {d.role}</h4>
                    <p>📅 {d.date} • {d.students.length} applicants • Status: <span style={{ fontWeight: 'bold', color: d.status === 'Closed' ? 'red' : 'green' }}>{d.status}</span></p>
                  </div>
                  <div className="ci-actions">
                    <button className="action-btn btn-view" onClick={() => openFunnel(d.id)}>View Funnel</button>
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
                    {allStudents.map((s, i) => (
                      <tr key={i}>
                        <td>{s.name}</td>
                        <td>{s.email}</td>
                        <td>{s.driveCompany}</td>


                        <td>
                          {drives.find(d => d.company === s.driveCompany)?.rounds
                            ?.split(',')
                            ?.[s.roundIndex] || "Completed"}
                        </td>
                        <td><span className={`badge badge-${s.status.toLowerCase()}`}>{s.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {tab === 'tpo-funnel' && selectedDrive?.students && (
          <div>
            <div className="dash-topbar">
              <div>
                <h1>Recruitment Funnel — {selectedDrive.company}</h1>
                <p>Track student progress through rounds</p>
              </div>
              <button
                className="action-btn btn-view"
                onClick={() => {
                  setFunnelDriveId(null);
                  setTab("tpo-drives");
                }}
              >
                ← Back
              </button>
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
                    {(selectedDrive?.students || []).map((s, i) => {
                      console.log("ROUND INDEX RAW:", s.roundIndex);

                      // ✅ FIXED INDEX (handles 1-based backend)
                      const index = Number(s.roundIndex ?? 1) - 1;

                      return (
                        <tr key={i}>
                          <td>{s.name}</td>
                          <td>{s.email}</td>

                          <td>
                            {driveRounds.includes(s.currentRound)
                              ? s.currentRound
                              : driveRounds[s.roundIndex] || "Aptitude Test"}
                          </td>

                          <td>
                            <span className={`badge badge-${s.status.toLowerCase()}`}>
                              {s.status}
                            </span>
                          </td>

                          <td>
                            <button
                              className="action-btn btn-verify"
                              onClick={() => advanceStudent(s.id)}
                            >
                              Advance
                            </button>

                            <button
                              className="action-btn btn-delete"
                              onClick={() => rejectStudent(s.id)}
                            >
                              Reject
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>

                </table>
              </div>
            </div>
          </div>
        )}

        {tab === 'tpo-applications' && (
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