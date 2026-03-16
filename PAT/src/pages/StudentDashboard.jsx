import { useState, useEffect } from "react";

export default function StudentDashboard({ user, onLogout }) {
  const [tab, setTab] = useState("overview");
  const [profile, setProfile] = useState({ phone:'', linkedin:'', address:'', gradYear:'', cgpa:'', department:'', college:'', school10:'', score10:'', year10:'', school12:'', score12:'', year12:'', degreeName:'', specialization:'', yearDegree:'', aadharNumber:'' });
  const [softSkills, setSoftSkills] = useState([]);
  const [techSkills, setTechSkills] = useState([]);
  const [softInput, setSoftInput] = useState("");
  const [techInput, setTechInput] = useState("");

  useEffect(() => {
    fetch(`http://localhost:8080/api/student/profile/${user.userId}`)
      .then(r => r.json())
      .then(d => {
        if (!d.userId) return;
        setProfile({ phone:d.phone||'', linkedin:d.linkedin||'', address:d.address||'', gradYear:d.gradYear||'', cgpa:d.cgpa||'', department:d.department||'', college:d.college||'', school10:d.school10||'', score10:d.score10||'', year10:d.year10||'', school12:d.school12||'', score12:d.score12||'', year12:d.year12||'', degreeName:d.degreeName||'', specialization:d.specialization||'', yearDegree:d.yearDegree||'', aadharNumber:d.aadharNumber||'' });
        if (d.softSkills) setSoftSkills(d.softSkills.split(",").filter(Boolean));
        if (d.techSkills) setTechSkills(d.techSkills.split(",").filter(Boolean));
      }).catch(() => {});
  }, [user.userId]);

  async function saveProfile() {
    const body = { userId: user.userId, ...profile, softSkills: softSkills.join(","), techSkills: techSkills.join(",") };
    try {
      const res = await fetch("http://localhost:8080/api/student/profile", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(body) });
      if (res.ok) alert("Profile saved successfully!");
      else alert("Failed to save profile.");
    } catch { alert("Cannot connect to server."); }
  }

  function p(field) { return { value: profile[field], onChange: e => setProfile(prev => ({ ...prev, [field]: e.target.value })) }; }

  return (
    <div className="dash-layout">
      <div className="dash-sidebar">
        <div className="s-logo">Placement<span>Portal</span></div>
        <div className="s-user">
          <div className="s-avatar">{(user.name||'S')[0].toUpperCase()}</div>
          <div className="s-name">{user.name}</div>
          <div className="s-role">Student</div>
        </div>
        <div className="dash-nav">
          {[['overview','🏠','Overview'],['profile','👤','My Profile'],['academic','🎓','Academic Records'],['identification','🪪','Identification'],['skills','💡','Skills & Certificates'],['drives','📋','Applied Drives']].map(([id,icon,label]) => (
            <a key={id} className={tab===id?'active':''} onClick={() => setTab(id)}><span className="nav-icon">{icon}</span> {label}</a>
          ))}
        </div>
        <div className="dash-logout"><button onClick={onLogout}>← Logout</button></div>
      </div>

      <div className="dash-main">
        {tab === 'overview' && (
          <div>
            <div className="dash-topbar"><div><h1>Welcome back, {user.name?.split(' ')[0]}</h1><p>Here's your placement activity summary</p></div></div>
            <div className="stat-cards">
              <div className="stat-card"><div className="stat-val">0</div><div className="stat-label">Drives Applied</div></div>
              <div className="stat-card"><div className="stat-val">0</div><div className="stat-label">Interviews Scheduled</div></div>
              <div className="stat-card"><div className="stat-val">0</div><div className="stat-label">Offers Received</div></div>
              <div className="stat-card"><div className="stat-val">0</div><div className="stat-label">Feedback Pending</div></div>
            </div>
            <div className="profile-card"><h3>Recent Activity</h3><div className="empty-state"><div className="e-icon">📭</div><p>No recent activity yet. Start by completing your profile.</p></div></div>
          </div>
        )}

        {tab === 'profile' && (
          <div>
            <div className="dash-topbar"><div><h1>My Profile</h1><p>Personal and contact information</p></div></div>
            <div className="profile-card">
              <h3>Personal Information</h3>
              <div className="form-grid">
                <div className="form-field"><label>Full Name</label><input type="text" value={user.name} readOnly /></div>
                <div className="form-field"><label>Email</label><input type="text" value={user.email} readOnly /></div>
                <div className="form-field"><label>Phone Number</label><input type="text" {...p('phone')} placeholder="+91 XXXXX XXXXX" /></div>
                <div className="form-field"><label>LinkedIn Profile</label><input type="text" {...p('linkedin')} placeholder="linkedin.com/in/yourname" /></div>
                <div className="form-field"><label>Year of Graduation</label>
                  <select {...p('gradYear')}>
                    <option value="">Select year</option>
                    {['2024','2025','2026','2027','2028'].map(y => <option key={y}>{y}</option>)}
                  </select>
                </div>
                <div className="form-field full"><label>Address</label><textarea {...p('address')} placeholder="Your full address"></textarea></div>
              </div>
              <button className="save-btn" onClick={saveProfile}>Save Profile</button>
            </div>
          </div>
        )}

        {tab === 'academic' && (
          <div>
            <div className="dash-topbar"><div><h1>Academic Records</h1><p>Your educational qualifications</p></div></div>
            <div className="profile-card">
              <h3>CGPA / Percentage</h3>
              <div className="form-grid three">
                <div className="form-field"><label>Current CGPA</label><input type="text" {...p('cgpa')} placeholder="e.g. 8.5" /></div>
                <div className="form-field"><label>Department</label><input type="text" {...p('department')} placeholder="e.g. Computer Science" /></div>
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

        {tab === 'identification' && (
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

        {tab === 'skills' && (
          <div>
            <div className="dash-topbar"><div><h1>Skills & Certificates</h1><p>Your technical and soft skills</p></div></div>
            <div className="profile-card">
              <h3>Soft Skills</h3>
              <div className="skills-wrap">
                {softSkills.map((s,i) => <div key={i} className="skill-tag">{s} <span className="remove" onClick={() => setSoftSkills(prev => prev.filter((_,j)=>j!==i))}>×</span></div>)}
              </div>
              <div className="skill-add-row">
                <input type="text" value={softInput} onChange={e => setSoftInput(e.target.value)} placeholder="e.g. Communication, Leadership..." />
                <button onClick={() => { if(softInput.trim()){setSoftSkills(p=>[...p,softInput.trim()]);setSoftInput('');} }}>Add</button>
              </div>
            </div>
            <div className="profile-card">
              <h3>Technical Skills</h3>
              <div className="skills-wrap">
                {techSkills.map((s,i) => <div key={i} className="skill-tag">{s} <span className="remove" onClick={() => setTechSkills(prev => prev.filter((_,j)=>j!==i))}>×</span></div>)}
              </div>
              <div className="skill-add-row">
                <input type="text" value={techInput} onChange={e => setTechInput(e.target.value)} placeholder="e.g. Java, React, MySQL..." />
                <button onClick={() => { if(techInput.trim()){setTechSkills(p=>[...p,techInput.trim()]);setTechInput('');} }}>Add</button>
              </div>
            </div>
            <button className="save-btn" onClick={saveProfile}>Save Skills</button>
          </div>
        )}

        {tab === 'drives' && (
          <div>
            <div className="dash-topbar"><div><h1>Applied Drives</h1><p>Your placement drive applications</p></div></div>
            <div className="profile-card"><div className="empty-state"><div className="e-icon">📋</div><p>You haven't applied to any drives yet.</p></div></div>
          </div>
        )}
      </div>
    </div>
  );
}
