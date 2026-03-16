import { useState, useEffect } from "react";

export default function TpoDashboard({ user, onLogout }) {
  const [tab, setTab] = useState("tpo-overview");
  const [drives, setDrives] = useState([]);
  const [funnelIdx, setFunnelIdx] = useState(null);
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
    if (d.id) await fetch(`http://localhost:8080/api/tpo/drive/${d.id}`, { method:"DELETE" }).catch(()=>{});
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
          {[['tpo-overview','🏠','Overview'],['tpo-create-drive','➕','Create Drive'],['tpo-all-drives','📋','All Drives'],['tpo-funnel','🔀','Drive Funnel']].map(([id,icon,label]) => (
            <a key={id} className={tab===id?'active':''} onClick={()=>setTab(id)}><span className="nav-icon">{icon}</span> {label}</a>
          ))}
        </div>
        <div className="dash-logout"><button onClick={onLogout}>← Logout</button></div>
      </div>

      <div className="dash-main">
        {tab === 'tpo-overview' && (
          <div>
            <div className="dash-topbar"><div><h1>TPO Dashboard</h1><p>Manage all placement drives and student progress</p></div></div>
            <div className="stat-cards">
              <div className="stat-card"><div className="stat-val">{drives.length}</div><div className="stat-label">Total Drives</div></div>
              <div className="stat-card"><div className="stat-val">{allStudents.length}</div><div className="stat-label">Students in Funnel</div></div>
              <div className="stat-card"><div className="stat-val">{allStudents.filter(s=>s.status==='Selected').length}</div><div className="stat-label">Selected</div></div>
              <div className="stat-card"><div className="stat-val">{allStudents.filter(s=>s.status==='Rejected').length}</div><div className="stat-label">Rejected</div></div>
            </div>
            <div className="profile-card">
              <h3>Quick Actions</h3>
              <div style={{display:'flex',gap:12,flexWrap:'wrap',marginTop:8}}>
                <button className="action-btn btn-verify" style={{padding:'10px 20px',fontSize:14}} onClick={()=>setTab('tpo-create-drive')}>Create New Drive</button>
                <button className="action-btn btn-view" style={{padding:'10px 20px',fontSize:14}} onClick={()=>setTab('tpo-all-drives')}>View All Drives</button>
              </div>
            </div>
          </div>
        )}

        {tab === 'tpo-create-drive' && (
          <div>
            <div className="dash-topbar"><div><h1>Create Drive</h1><p>Schedule a new placement drive</p></div></div>
            <div className="profile-card">
              <h3>Drive Details</h3>
              <div className="form-grid">
                {[['company','Company Name','e.g. TCS, Infosys','text'],['role','Job Role','e.g. Software Engineer','text'],['driveDate','Drive Date','','date'],['driveTime','Time','','time'],['venue','Venue','e.g. Seminar Hall A','text'],['eligibility','Eligibility Criteria','e.g. CGPA >= 7.0','text']].map(([field,label,ph,type]) => (
                  <div className="form-field" key={field}>
                    <label>{label}</label>
                    <input type={type} value={form[field]} onChange={e=>setForm(p=>({...p,[field]:e.target.value}))} placeholder={ph} />
                  </div>
                ))}
                <div className="form-field full">
                  <label>Rounds (comma separated)</label>
                  <input type="text" value={form.rounds} onChange={e=>setForm(p=>({...p,rounds:e.target.value}))} placeholder="e.g. Aptitude Test, Technical Round, HR Round" />
                </div>
              </div>
              <button className="save-btn" onClick={addDrive}>Create Drive</button>
            </div>
          </div>
        )}

        {tab === 'tpo-all-drives' && (
          <div>
            <div className="dash-topbar"><div><h1>All Drives</h1><p>View and manage all placement drives</p></div></div>
            {drives.length === 0
              ? <div className="empty-state"><div className="e-icon">📋</div><p>No drives created yet.</p></div>
              : drives.map((d,i) => (
                <div className="content-item" key={d.id||i} style={{flexDirection:'column',gap:14}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',width:'100%'}}>
                    <div>
                      <h4 style={{fontSize:16,fontWeight:800,color:'#2d1a0e'}}>{d.company}{d.role?' — '+d.role:''}</h4>
                      <p style={{fontSize:13,color:'#888',marginTop:4}}>📅 {d.date}{d.time?' | ⏰ '+d.time:''}{d.venue?' | 📍 '+d.venue:''}</p>
                      {d.eligibility && <p style={{fontSize:13,color:'#888'}}>Eligibility: {d.eligibility}</p>}
                      {d.rounds && <p style={{fontSize:13,color:'#888'}}>Rounds: {d.rounds}</p>}
                    </div>
                    <div style={{display:'flex',gap:8,alignItems:'center'}}>
                      <span className="badge badge-active">{d.status}</span>
                      <button className="action-btn btn-view" onClick={()=>openFunnel(i)}>Manage Funnel</button>
                      <button className="action-btn btn-delete" onClick={()=>removeDrive(i)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        )}

        {tab === 'tpo-funnel' && funnelIdx !== null && (
          <FunnelView drive={drives[funnelIdx]} driveIdx={funnelIdx} setDrives={setDrives} />
        )}
        {tab === 'tpo-funnel' && funnelIdx === null && (
          <div className="empty-state"><div className="e-icon">🔀</div><p>Select a drive from All Drives to manage its funnel.</p></div>
        )}
      </div>
    </div>
  );
}

function FunnelView({ drive, driveIdx, setDrives }) {
  const [nameInputs, setNameInputs] = useState({});
  const [emailInputs, setEmailInputs] = useState({});
  const rounds = drive.rounds ? drive.rounds.split(",").map(r=>r.trim()) : ["Round 1","Round 2","HR Round"];
  const lastRoundIdx = rounds.length - 1;

  async function addStudent(ri) {
    const name = (nameInputs[ri]||'').trim();
    const email = (emailInputs[ri]||'').trim();
    if (!name) return;
    try {
      const res = await fetch("http://localhost:8080/api/tpo/drive/student", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ driveId: drive.id.toString(), studentName:name, studentEmail:email, roundIndex:ri.toString() })
      });
      const data = await res.json();
      const entry = { id:parseInt(data.studentId), name, email, roundIdx:ri, status:"Appeared" };
      setDrives(prev => prev.map((d,i) => i===driveIdx ? {...d, students:[...d.students, entry]} : d));
      setNameInputs(p=>({...p,[ri]:''}));
      setEmailInputs(p=>({...p,[ri]:''}));
    } catch { alert("Cannot connect to server."); }
  }

  async function updateStatus(studentId, status) {
    await fetch(`http://localhost:8080/api/tpo/drive/student/${studentId}/status`, {
      method:"PUT", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ status })
    }).catch(()=>{});
    setDrives(prev => prev.map((d,i) => i===driveIdx ? {...d, students: d.students.map(s => s.id===studentId ? {...s,status} : s)} : d));
  }

  async function promote(studentId) {
    try {
      const res = await fetch("http://localhost:8080/api/tpo/drive/student/promote", {
        method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ studentId: studentId.toString() })
      });
      const data = await res.json();
      const student = drive.students.find(s=>s.id===studentId);
      if (!student) return;
      const newEntry = { id:parseInt(data.newStudentId), name:student.name, email:student.email, roundIdx:student.roundIdx+1, status:"Appeared" };
      setDrives(prev => prev.map((d,i) => i===driveIdx ? {...d, students: d.students.map(s=>s.id===studentId?{...s,status:"Selected"}:s).concat(newEntry)} : d));
    } catch { alert("Cannot connect to server."); }
  }

  const finalSelected = drive.students.filter(s => s.roundIdx===lastRoundIdx && s.status==="Selected");

  return (
    <div>
      <div className="dash-topbar"><div><h1>{drive.company}{drive.role?' — '+drive.role:''}</h1><p>Track students through each round</p></div></div>
      {rounds.map((round, ri) => {
        const roundStudents = drive.students.filter(s => s.roundIdx===ri);
        return (
          <div className="profile-card" key={ri} style={{marginBottom:16}}>
            <h3>{round}</h3>
            <table className="coord-table" style={{marginTop:12}}>
              <thead><tr><th>Student Name</th><th>Email</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {roundStudents.length === 0
                  ? <tr><td colSpan={4} style={{textAlign:'center',color:'#bbb',padding:20}}>No students added to this round.</td></tr>
                  : roundStudents.map(s => (
                    <tr key={s.id}>
                      <td>{s.name}</td>
                      <td>{s.email||'-'}</td>
                      <td><span className={`badge ${s.status==='Selected'?'badge-verified':s.status==='Rejected'?'badge-pending':'badge-active'}`}>{s.status}</span></td>
                      <td>
                        <button className="action-btn btn-verify" onClick={()=>updateStatus(s.id,'Selected')}>Select</button>
                        <button className="action-btn btn-delete" onClick={()=>updateStatus(s.id,'Rejected')}>Reject</button>
                        {ri < rounds.length-1 && <button className="action-btn" style={{background:'#e8f0fe',color:'#1a56db'}} onClick={()=>promote(s.id)}>→ Next Round</button>}
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
            <div style={{display:'flex',gap:10,marginTop:12}}>
              <input type="text" value={nameInputs[ri]||''} onChange={e=>setNameInputs(p=>({...p,[ri]:e.target.value}))} placeholder="Student name" style={{flex:1,padding:'9px 12px',border:'1.5px solid #e8e8e8',borderRadius:8,fontSize:14}} />
              <input type="text" value={emailInputs[ri]||''} onChange={e=>setEmailInputs(p=>({...p,[ri]:e.target.value}))} placeholder="Student email" style={{flex:1,padding:'9px 12px',border:'1.5px solid #e8e8e8',borderRadius:8,fontSize:14}} />
              <button className="action-btn btn-verify" style={{padding:'9px 16px'}} onClick={()=>addStudent(ri)}>Add</button>
            </div>
          </div>
        );
      })}
      <div className="profile-card" style={{borderLeft:'4px solid #1a7a3c'}}>
        <h3 style={{color:'#1a7a3c'}}>Finally Selected Students</h3>
        <table className="coord-table" style={{marginTop:12}}>
          <thead><tr><th>Student Name</th><th>Email</th><th>Final Round</th></tr></thead>
          <tbody>
            {finalSelected.length === 0
              ? <tr><td colSpan={3} style={{textAlign:'center',color:'#bbb',padding:20}}>No students finally selected yet.</td></tr>
              : finalSelected.map(s => (
                <tr key={s.id}>
                  <td style={{fontWeight:700,color:'#1a7a3c'}}>{s.name}</td>
                  <td>{s.email||'-'}</td>
                  <td>{rounds[s.roundIdx]}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}
