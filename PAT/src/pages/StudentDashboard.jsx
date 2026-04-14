import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const DEPARTMENTS = ["CSE", "ISE", "ECE", "EEE", "MECH", "CIVIL", "AIML", "DS"];

function calculateProfileCompletion(profile, softSkills, techSkills) {
  const requiredFields = [
    'phone', 'address', 'resumeLink',
    'cgpa', 'department', 'college',
    'school10', 'score10', 'year10',
    'school12', 'score12', 'year12',
    'degreeName', 'specialization', 'yearDegree',
    'aadharNumber'
  ];
  const filledCount = requiredFields.filter(f => profile[f] && String(profile[f]).trim() !== '').length;
  const softOk = softSkills.length > 0 ? 1 : 0;
  const techOk = techSkills.length > 0 ? 1 : 0;
  const total = requiredFields.length + 2;
  const filled = filledCount + softOk + techOk;
  return Math.round((filled / total) * 100);
}

function AppliedDrives({ userId, reloadTick }) {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8080/applications/student/${userId}/applied`)
      .then(r => r.json())
      .then(data => setApplications(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [userId, reloadTick]);

  async function deleteApplication(app) {
    if (!window.confirm(`Delete your application to ${app.company}? This cannot be undone.`)) return;
    try {
      const res = await fetch(`http://localhost:8080/applications/${app.applicationId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setApplications(prev => prev.filter(a => a.applicationId !== app.applicationId));
    } catch { alert("Failed to delete application."); }
  }

  return (
    <div>
      <div className="dash-topbar"><div><h1>Applied Drives</h1><p>Your placement drive applications</p></div></div>
      {applications.length === 0
        ? <div className="profile-card"><div className="empty-state"><div className="e-icon">📋</div><p>You haven't applied to any drives yet.</p></div></div>
        : applications.map((a, i) => (
          <div className="content-item" key={a.applicationId || i} style={{ flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
              <div>
                <h4 style={{ fontSize: 18, fontWeight: 800, color: '#1a0e06', marginBottom: 6 }}>{a.company}{a.role ? ' — ' + a.role : ''}</h4>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '8px', fontSize: '13px', fontWeight: 'bold' }}>
                  {a.jobType && <span style={{ color: '#0056b3', background: '#e2eef9', padding: '4px 8px', borderRadius: '4px' }}>💼 {a.jobType}</span>}
                  {a.ctc && <span style={{ color: '#155724', background: '#d4edda', padding: '4px 8px', borderRadius: '4px' }}>💰 {a.ctc} LPA</span>}
                </div>
                <p style={{ fontSize: 13, color: '#6b5a4e', marginBottom: 5 }}>📅 {a.driveDate}{a.driveTime ? '  ⏰ ' + a.driveTime : ''}{a.venue ? '  📍 ' + a.venue : ''}</p>
                <p style={{ fontSize: 13, color: '#6b5a4e', marginBottom: 0 }}>
                  {a.minCgpa && <span style={{ marginRight: '15px' }}>🎓 Min CGPA: {a.minCgpa}</span>}
                  {a.rounds && <span>🔄 Rounds: {a.rounds}</span>}
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                <span className={`badge badge-${(a.applicationStatus || "applied").toLowerCase()}`}>{a.applicationStatus || "Applied"}</span>
                <button className="action-btn btn-delete" onClick={() => deleteApplication(a)}>Delete</button>
              </div>
            </div>
          </div>
        ))
      }
    </div>
  );
}

function AvailableDrives({ userId, userName, userEmail, profile, softSkills, techSkills, onApplicationSuccess, onGoToProfile }) {
  const [drives, setDrives] = useState([]);
  const [applying, setApplying] = useState(null);
  const [appData, setAppData] = useState(null);
  const [reloadTick, setReloadTick] = useState(0);

  const profilePct = calculateProfileCompletion(profile, softSkills, techSkills);
  const profileComplete = profilePct === 100;

  useEffect(() => {
    fetch(`http://localhost:8080/applications/student/${userId}/available`)
      .then(r => r.json())
      .then(data => setDrives(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [userId, reloadTick]);

  function openApply(drive) {
    if (!profileComplete) {
      alert("Your profile is only " + profilePct + "% complete.\nPlease complete your profile before applying for drives.");
      if (onGoToProfile) onGoToProfile();
      return;
    }
    fetch(`http://localhost:8080/api/student/profile/${userId}`)
      .then(r => r.json())
      .then(d => {
        setAppData({ name: d.name || userName || '', email: d.email || userEmail || '', phone: d.phone || '', linkedin: d.linkedin || '', address: d.address || '', resumeLink: d.resumeLink || '', cgpa: d.cgpa || '', department: d.department || '', college: d.college || '', degreeName: d.degreeName || '', specialization: d.specialization || '', yearDegree: d.yearDegree || '', softSkills: d.softSkills || '', techSkills: d.techSkills || '' });
        setApplying(drive);
      })
      .catch(() => alert("Failed to load profile. Please complete your profile first."));
  }

  function f(field) { return { value: appData[field], onChange: e => setAppData(p => ({ ...p, [field]: e.target.value })) }; }

  async function submitApplication() {
    try {
      const res = await fetch("http://localhost:8080/applications", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: userId, driveId: applying.id, stage: 'Applied', status: 'Pending' })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to submit application.");
      alert(`Application submitted to ${applying.company}! Good luck!`);
      setApplying(null); setAppData(null);
      setReloadTick(prev => prev + 1);
      if (onApplicationSuccess) onApplicationSuccess();
    } catch (error) { alert(error.message || "Failed to submit application. Please try again."); }
  }

  if (applying && appData) {
    return (
      <div>
        <div className="dash-topbar">
          <div><h1>Apply — {applying.company}{applying.role ? ' (' + applying.role + ')' : ''}</h1><p>Review and edit your details for this application.</p></div>
          <button className="action-btn btn-view" style={{ padding: '10px 20px', fontSize: 13 }} onClick={() => setApplying(null)}>← Back</button>
        </div>
        <div className="profile-card" style={{ background: '#f8fafc', borderLeft: '4px solid #2c3e50' }}>
          <h3 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', marginBottom: '15px' }}>Job & Drive Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '14px', color: '#334155' }}>
            <div><strong>🏢 Type:</strong> {applying.companyType || 'N/A'}</div>
            <div><strong>💼 Role:</strong> {applying.jobType || 'N/A'}</div>
            <div><strong>💰 CTC:</strong> {applying.ctc ? applying.ctc + ' LPA' : 'N/A'} {applying.stipend ? `(Stipend: ₹${applying.stipend}/mo)` : ''}</div>
            <div><strong>📍 Location:</strong> {applying.location || 'N/A'}</div>
            <div><strong>📅 Date:</strong> {applying.driveDate || 'N/A'} {applying.driveTime ? `at ${applying.driveTime}` : ''}</div>
            <div><strong>💻 Mode:</strong> {applying.driveMode || 'N/A'} {applying.venue ? `(${applying.venue})` : ''}</div>
            <div><strong>🎓 Min CGPA:</strong> {applying.minCgpa || 'No Limit'}</div>
            <div><strong>📝 Rounds:</strong> {applying.rounds || 'N/A'}</div>
            <div><strong>⏳ Deadline:</strong> <span style={{ color: '#e11d48', fontWeight: 'bold' }}>{applying.registrationDeadline || 'N/A'}</span></div>
            <div><strong>📜 Bond:</strong> {applying.bondDetails || 'None'}</div>
          </div>
          {applying.jdLink && (<div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px dashed #cbd5e1' }}><a href={applying.jdLink} target="_blank" rel="noreferrer" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 'bold' }}>🔗 View Detailed Job Description</a></div>)}
        </div>
        <div className="profile-card">
          <h3>Personal Information</h3>
          <div className="form-grid">
            <div className="form-field"><label>Full Name</label><input type="text" {...f('name')} /></div>
            <div className="form-field"><label>Email</label><input type="text" {...f('email')} /></div>
            <div className="form-field"><label>Phone</label><input type="text" {...f('phone')} placeholder="+91 XXXXX XXXXX" /></div>
            <div className="form-field"><label>LinkedIn</label><input type="text" {...f('linkedin')} placeholder="linkedin.com/in/yourname" /></div>
            <div className="form-field"><label>Resume Link (Google Drive)</label><input type="text" {...f('resumeLink')} placeholder="https://drive.google.com/your-resume-folder" /></div>
            <div className="form-field full"><label>Address</label><textarea {...f('address')} placeholder="Your address" /></div>
          </div>
        </div>
        <div className="profile-card">
          <h3>Academic Details</h3>
          <div className="form-grid three">
            <div className="form-field"><label>CGPA</label><input type="text" {...f('cgpa')} placeholder="e.g. 8.5" /></div>
            <div className="form-field"><label>Department</label><input type="text" value={appData.department || ''} readOnly style={{ backgroundColor: '#e9ecef', color: '#6c757d', cursor: 'not-allowed' }} /></div>
            <div className="form-field"><label>College</label><input type="text" {...f('college')} placeholder="College name" /></div>
            <div className="form-field"><label>Degree</label><input type="text" {...f('degreeName')} placeholder="e.g. B.Tech" /></div>
            <div className="form-field"><label>Specialization</label><input type="text" {...f('specialization')} placeholder="e.g. Computer Science" /></div>
            <div className="form-field"><label>Year of Passing</label><input type="text" {...f('yearDegree')} placeholder="e.g. 2025" /></div>
          </div>
        </div>
        <div className="profile-card">
          <h3>Skills</h3>
          <div className="form-grid">
            <div className="form-field"><label>Soft Skills</label><input type="text" {...f('softSkills')} placeholder="e.g. Communication, Leadership" /></div>
            <div className="form-field"><label>Technical Skills</label><input type="text" {...f('techSkills')} placeholder="e.g. Java, React, MySQL" /></div>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <button className="save-btn" style={{ padding: '14px 48px', fontSize: 16 }} onClick={submitApplication}>Submit Application to {applying.company}</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="dash-topbar">
        <div><h1>Available Drives</h1><p>Placement drives open for students</p></div>
        <button className="action-btn btn-view" onClick={() => setReloadTick(prev => prev + 1)}>Refresh</button>
      </div>
      {!profileComplete && (
        <div style={{ background: 'rgba(255, 243, 205, 0.97)', border: '1.5px solid #ffc107', borderLeft: '5px solid #e6a800', borderRadius: 14, padding: '18px 24px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: '#7a4f00', marginBottom: 6 }}>⚠️ Your profile is only {profilePct}% complete</div>
            <div style={{ fontSize: 13, color: '#5a3a00' }}>You must have a 100% complete profile to apply for any drive.</div>
            <div style={{ marginTop: 10, background: '#ffe8a0', borderRadius: 6, height: 8, width: 280, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${profilePct}%`, background: 'linear-gradient(90deg,#ff9800,#ffc107)', borderRadius: 6, transition: 'width 0.4s' }} />
            </div>
            <div style={{ fontSize: 11, color: '#7a4f00', marginTop: 4 }}>{profilePct}% — need 100% to apply</div>
          </div>
          <button onClick={() => { if (onGoToProfile) onGoToProfile(); }} style={{ whiteSpace: 'nowrap', padding: '11px 22px', background: 'linear-gradient(135deg, #ff9800, #ffc107)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            Complete Profile →
          </button>
        </div>
      )}
      {drives.length === 0
        ? <div className="profile-card"><div className="empty-state"><div className="e-icon">🏢</div><p>No drives available right now.</p></div></div>
        : drives.map(d => (
          <div className="content-item" key={d.id} style={{ flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
              <div>
                <h4 style={{ fontSize: 18, fontWeight: 800, color: '#1a0e06', marginBottom: 6 }}>{d.company}{d.role ? ' — ' + d.role : ''}</h4>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px', fontSize: '12px', fontWeight: 'bold' }}>
                  {d.jobType && <span style={{ background: '#f0f4f8', color: '#0056b3', padding: '4px 8px', borderRadius: '6px' }}>💼 {d.jobType}</span>}
                  {d.ctc && <span style={{ background: '#e6f4ea', color: '#155724', padding: '4px 8px', borderRadius: '6px' }}>💰 {d.ctc} LPA</span>}
                  {d.driveMode && <span style={{ background: '#fef5e5', color: '#856404', padding: '4px 8px', borderRadius: '6px' }}>💻 Mode: {d.driveMode}</span>}
                  {d.registrationDeadline && <span style={{ background: '#fce8e6', color: '#c5221f', padding: '4px 8px', borderRadius: '6px' }}>⏳ Deadline: {d.registrationDeadline}</span>}
                </div>
                <p style={{ fontSize: 13, color: '#6b5a4e', marginBottom: 3 }}>📅 Date: {d.driveDate}{d.driveTime ? '  ⏰ ' + d.driveTime : ''}{d.venue ? '  📍 ' + d.venue : ''}</p>
                <p style={{ fontSize: 13, color: '#6b5a4e', marginBottom: 0 }}>
                  {d.minCgpa && <span style={{ marginRight: '15px' }}>🎓 Min CGPA: {d.minCgpa}</span>}
                  {d.eligibleBranches && <span style={{ marginRight: '15px' }}>📚 Branches: {d.eligibleBranches}</span>}
                </p>
              </div>
              {profileComplete ? (
                <button className="save-btn" style={{ marginTop: 0, padding: '10px 24px', fontSize: 14 }} onClick={() => openApply(d)}>View &amp; Apply</button>
              ) : (
                <button onClick={() => { if (onGoToProfile) onGoToProfile(); }} style={{ marginTop: 0, padding: '10px 20px', fontSize: 13, fontWeight: 700, background: 'linear-gradient(135deg, #ff9800, #ffc107)', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer' }}>
                  ✏️ Complete Profile &amp; Apply
                </button>
              )}
            </div>
          </div>
        ))
      }
    </div>
  );
}

export default function StudentDashboard({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [profile, setProfile] = useState({ phone: '', linkedin: '', address: '', resumeLink: '', cgpa: '', department: '', college: '', school10: '', score10: '', year10: '', school12: '', score12: '', year12: '', degreeName: '', specialization: '', yearDegree: '', aadharNumber: '' });
  const [softSkills, setSoftSkills] = useState([]);
  const [techSkills, setTechSkills] = useState([]);
  const [softInput, setSoftInput] = useState("");
  const [techInput, setTechInput] = useState("");
  const [overviewApps, setOverviewApps] = useState([]);
  const [reloadTick, setReloadTick] = useState(0);

  const pathParts = location.pathname.split('/');
  const activeTab = pathParts[2] || 'overview';

  useEffect(() => {
    if (location.pathname === '/student' || location.pathname === '/student/') {
      navigate('/student/overview', { replace: true });
    }
  }, [location.pathname]);

  useEffect(() => {
    fetch(`http://localhost:8080/api/student/profile/${user.userId}`)
      .then(r => r.json())
      .then(d => {
        if (!d.userId) return;
        setProfile({ phone: d.phone || '', linkedin: d.linkedin || '', address: d.address || '', resumeLink: d.resumeLink || '', cgpa: d.cgpa || '', department: d.department || '', college: d.college || '', school10: d.school10 || '', score10: d.score10 || '', year10: d.year10 || '', school12: d.school12 || '', score12: d.score12 || '', year12: d.year12 || '', degreeName: d.degreeName || '', specialization: d.specialization || '', yearDegree: d.yearDegree || '', aadharNumber: d.aadharNumber || '' });
        if (d.softSkills) setSoftSkills(d.softSkills.split(",").filter(Boolean));
        if (d.techSkills) setTechSkills(d.techSkills.split(",").filter(Boolean));
      }).catch(() => {});

    fetch(`http://localhost:8080/applications/student/${user.userId}/applied`)
      .then(r => r.json())
      .then(data => setOverviewApps(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [user.userId, reloadTick]);

  async function saveProfile() {
    const body = { userId: user.userId, ...profile, softSkills: softSkills.join(","), techSkills: techSkills.join(",") };
    try {
      const res = await fetch("http://localhost:8080/api/student/profile", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (res.ok) { alert("Profile saved successfully!"); setReloadTick(t => t + 1); }
      else alert("Failed to save profile.");
    } catch { alert("Cannot connect to server."); }
  }

  function p(field) { return { value: profile[field], onChange: e => setProfile(prev => ({ ...prev, [field]: e.target.value })) }; }

  const profilePct = calculateProfileCompletion(profile, softSkills, techSkills);

  const navItems = [
    ['overview',       '🏠', 'Overview'],
    ['profile',        '👤', 'My Profile'],
    ['academic',       '🎓', 'Academic Records'],
    ['identification', '🪪', 'Identification'],
    ['skills',         '💡', 'Skills & Certificates'],
    ['drives',         '📋', 'Applied Drives'],
    ['available',      '🏢', 'Available Drives'],
  ];

  return (
    <div className="dash-layout">
      <div className="dash-sidebar">
        <div className="s-logo">Placement<span>Portal</span></div>
        <div className="s-user">
          <div className="s-avatar">{(user.name || 'S')[0].toUpperCase()}</div>
          <div className="s-name">{user.name}</div>
          <div className="s-role">Student</div>
        </div>
        <div className="dash-nav">
          {navItems.map(([id, icon, label]) => (
            <a key={id} className={activeTab === id ? 'active' : ''} onClick={() => navigate(`/student/${id}`)}>
              <span className="nav-icon">{icon}</span> {label}
            </a>
          ))}
        </div>
        <div className="dash-logout"><button onClick={onLogout}>← Logout</button></div>
      </div>

      <div className="dash-main">
        {activeTab === 'overview' && (
          <div>
            <div className="dash-topbar"><div><h1>Welcome back, {user.name?.split(' ')[0]}</h1><p>Here's your placement activity summary</p></div></div>
            {profilePct < 100 && (
              <div className="profile-card" style={{ borderLeft: '4px solid #ffc107', background: 'rgba(255,248,225,0.97)' }}>
                <h3 style={{ color: '#7a4f00' }}>⚠️ Complete Your Profile</h3>
                <p style={{ fontSize: 14, color: '#5a3a00', marginBottom: 14 }}>Your profile is <strong>{profilePct}%</strong> complete. You need 100% to apply for drives.</p>
                <div style={{ background: '#ffe8a0', borderRadius: 8, height: 10, overflow: 'hidden', marginBottom: 10 }}>
                  <div style={{ height: '100%', width: `${profilePct}%`, background: 'linear-gradient(90deg,#ff9800,#ffc107)', borderRadius: 8 }} />
                </div>
                <button className="save-btn" style={{ marginTop: 0, padding: '10px 24px', fontSize: 14 }} onClick={() => navigate('/student/profile')}>Go to My Profile →</button>
              </div>
            )}
            <div className="stat-cards">
              <div className="stat-card"><div className="stat-val">{overviewApps.length}</div><div className="stat-label">Drives Applied</div></div>
              <div className="stat-card"><div className="stat-val">{overviewApps.filter(a => a.stage && a.stage !== 'Applied').length}</div><div className="stat-label">Interviews Scheduled</div></div>
              <div className="stat-card"><div className="stat-val">{overviewApps.filter(a => a.applicationStatus === 'Selected').length}</div><div className="stat-label">Offers Received</div></div>
              <div className="stat-card"><div className="stat-val">{overviewApps.filter(a => a.applicationStatus === 'Pending').length}</div><div className="stat-label">Feedback Pending</div></div>
            </div>
            <div className="profile-card">
              <h3>Recent Activity</h3>
              {overviewApps.length === 0 ? (
                <div className="empty-state"><div className="e-icon">📭</div><p>No recent applications yet. Go to "Available Drives" to start applying!</p></div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
                  {overviewApps.slice(0, 4).map((app, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #eee' }}>
                      <div>
                        <strong>You applied for {app.company}</strong>
                        <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>{app.role || 'Placement Drive'}</div>
                      </div>
                      <span className={`badge badge-${(app.applicationStatus || "applied").toLowerCase()}`}>{app.applicationStatus || "Applied"}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div>
            <div className="dash-topbar"><div><h1>My Profile</h1><p>Personal and contact information</p></div></div>
            <div className="profile-card">
              <h3>Personal Information</h3>
              <div className="form-grid">
                <div className="form-field"><label>Full Name</label><input type="text" value={user.name} readOnly /></div>
                <div className="form-field"><label>Email</label><input type="text" value={user.email} readOnly /></div>
                <div className="form-field"><label>Phone Number</label><input type="text" {...p('phone')} placeholder="+91 XXXXX XXXXX" /></div>
                <div className="form-field"><label>LinkedIn Profile</label><input type="text" {...p('linkedin')} placeholder="linkedin.com/in/yourname" /></div>
                <div className="form-field"><label>Resume Link (Google Drive)</label><input type="url" {...p('resumeLink')} placeholder="https://drive.google.com/your-resume-folder" /></div>
                <div className="form-field full"><label>Address</label><textarea {...p('address')} placeholder="Your full address"></textarea></div>
              </div>
              <button className="save-btn" onClick={saveProfile}>Save Profile</button>
            </div>
          </div>
        )}

        {activeTab === 'academic' && (
          <div>
            <div className="dash-topbar"><div><h1>Academic Records</h1><p>Your educational qualifications</p></div></div>
            <div className="profile-card">
              <h3>CGPA / Percentage</h3>
              <div className="form-grid three">
                <div className="form-field"><label>Current CGPA</label><input type="text" {...p('cgpa')} placeholder="e.g. 8.5" /></div>
                <div className="form-field"><label>Department</label><select {...p('department')}><option value="">Select Department</option>{DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
                <div className="form-field"><label>College Name</label><input type="text" {...p('college')} placeholder="Your college name" /></div>
              </div>
            </div>
            <div className="profile-card">
              <h3>10th Standard</h3>
              <div className="form-grid">
                <div className="form-field"><label>School Name</label><input type="text" {...p('school10')} placeholder="School name" /></div>
                <div className="form-field"><label>Percentage / CGPA</label><input type="text" {...p('score10')} placeholder="e.g. 92%" /></div>
                <div className="form-field"><label>Year of Passing</label><input type="text" {...p('year10')} placeholder="e.g. 2019" /></div>
              </div>
            </div>
            <div className="profile-card">
              <h3>12th Standard</h3>
              <div className="form-grid">
                <div className="form-field"><label>School / College Name</label><input type="text" {...p('school12')} placeholder="School/College name" /></div>
                <div className="form-field"><label>Percentage / CGPA</label><input type="text" {...p('score12')} placeholder="e.g. 88%" /></div>
                <div className="form-field"><label>Year of Passing</label><input type="text" {...p('year12')} placeholder="e.g. 2021" /></div>
              </div>
            </div>
            <div className="profile-card">
              <h3>Degree</h3>
              <div className="form-grid">
                <div className="form-field"><label>Degree Name</label><input type="text" {...p('degreeName')} placeholder="e.g. B.Tech" /></div>
                <div className="form-field"><label>Specialization</label><input type="text" {...p('specialization')} placeholder="e.g. Computer Science" /></div>
                <div className="form-field"><label>Year of Passing</label><input type="text" {...p('yearDegree')} placeholder="e.g. 2025" /></div>
              </div>
            </div>
            <button className="save-btn" onClick={saveProfile}>Save Academic Records</button>
          </div>
        )}

        {activeTab === 'identification' && (
          <div>
            <div className="dash-topbar"><div><h1>Identification</h1><p>Your identity documents</p></div></div>
            <div className="profile-card">
              <h3>Aadhaar Details</h3>
              <div className="form-grid">
                <div className="form-field"><label>Aadhaar Number</label><input type="text" {...p('aadharNumber')} placeholder="XXXX XXXX XXXX" maxLength={14} /></div>
              </div>
              <button className="save-btn" onClick={saveProfile}>Save Identification</button>
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div>
            <div className="dash-topbar"><div><h1>Skills & Certificates</h1><p>Your technical and soft skills</p></div></div>
            <div className="profile-card">
              <h3>Soft Skills</h3>
              <div className="skills-wrap">{softSkills.map((s, i) => <div key={i} className="skill-tag">{s} <span className="remove" onClick={() => setSoftSkills(prev => prev.filter((_, j) => j !== i))}>×</span></div>)}</div>
              <div className="skill-add-row">
                <input type="text" value={softInput} onChange={e => setSoftInput(e.target.value)} placeholder="e.g. Communication, Leadership..." />
                <button onClick={() => { if (softInput.trim()) { setSoftSkills(prev => [...prev, softInput.trim()]); setSoftInput(""); } }}>Add</button>
              </div>
            </div>
            <div className="profile-card">
              <h3>Technical Skills</h3>
              <div className="skills-wrap">{techSkills.map((s, i) => <div key={i} className="skill-tag">{s} <span className="remove" onClick={() => setTechSkills(prev => prev.filter((_, j) => j !== i))}>×</span></div>)}</div>
              <div className="skill-add-row">
                <input type="text" value={techInput} onChange={e => setTechInput(e.target.value)} placeholder="e.g. Java, React, MySQL..." />
                <button onClick={() => { if (techInput.trim()) { setTechSkills(prev => [...prev, techInput.trim()]); setTechInput(""); } }}>Add</button>
              </div>
            </div>
            <button className="save-btn" onClick={saveProfile}>Save Skills</button>
          </div>
        )}

        {activeTab === 'drives' && <AppliedDrives userId={user.userId} userEmail={user.email} reloadTick={reloadTick} />}

        {activeTab === 'available' && (
          <AvailableDrives
            userId={user.userId} userName={user.name} userEmail={user.email}
            profile={profile} softSkills={softSkills} techSkills={techSkills}
            onApplicationSuccess={() => setReloadTick(t => t + 1)}
            onGoToProfile={() => navigate('/student/profile')}
          />
        )}
      </div>
    </div>
  );
}