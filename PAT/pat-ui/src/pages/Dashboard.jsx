import { useEffect, useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function Dashboard() {

  const [user,         setUser]         = useState(null);
  const [drives,       setDrives]       = useState([]);
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    // ✅ FIXED: Changed from /auth/profile → /api/users/profile (Spring Boot endpoint)
    api.get("/api/users/profile")
      .then(res => setUser(res.data))
      .catch(() => {
        alert("Session expired. Please login again.");
        localStorage.clear();
        navigate("/");
      });

    // ✅ Load drives from Team 2 module
    api.get("/drives")
      .then(res => setDrives(res.data))
      .catch(() => setDrives([]));

    // ✅ Load applications from Team 2 module
    api.get("/applications")
      .then(res => setApplications(res.data))
      .catch(() => setApplications([]));

  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (!user) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading...</p>;

  return (
    <div className="container">

      <h1 className="title">Placement Automation Tool</h1>

      {/* ── User Profile Card ── */}
      <div className="card">

        {/* ✅ FIXED: was user.name — Spring Boot returns fullName */}
        <h2>Welcome, {user.fullName}</h2>

        <p><b>Email:</b> {user.email}</p>
        <p><b>Role:</b> {user.role}</p>
        <p><b>Phone:</b> {user.phoneNumber || "Not provided"}</p>
        <p>
          <b>Verification: </b>
          {user.isVerified ? "✔ Verified" : "❌ Not Verified"}
        </p>
        <p>
          <b>Account Status: </b>
          {user.isActive ? "✔ Active" : "❌ Inactive"}
        </p>

        <button onClick={logout} style={{ marginTop: "10px", background: "#e53e3e" }}>
          Logout
        </button>

      </div>

      {/* ── Recruitment Drives Card ── */}
      <div className="card-wide">

        <h2>Recruitment Drives</h2>

        {drives.length === 0 ? (
          <p>No drives available.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#edf2f7" }}>
                <th style={th}>Company</th>
                <th style={th}>Role</th>
                <th style={th}>Package (LPA)</th>
                <th style={th}>Location</th>
              </tr>
            </thead>
            <tbody>
              {drives.map(d => (
                <tr key={d.driveId}>
                  <td style={td}>{d.companyName}</td>
                  <td style={td}>{d.role}</td>
                  <td style={td}>{d.packageAmount}</td>
                  <td style={td}>{d.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>

      {/* ── Applications Card ── */}
      <div className="card-wide">

        <h2>Applications</h2>

        {applications.length === 0 ? (
          <p>No applications yet.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#edf2f7" }}>
                <th style={th}>Application ID</th>
                <th style={th}>Student ID</th>
                <th style={th}>Drive ID</th>
                <th style={th}>Stage</th>
                <th style={th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(a => (
                <tr key={a.applicationId}>
                  <td style={td}>{a.applicationId}</td>
                  <td style={td}>{a.studentId}</td>
                  <td style={td}>{a.driveId}</td>
                  <td style={td}>{a.stage}</td>
                  <td style={{ ...td, color: statusColor(a.status), fontWeight: "bold" }}>
                    {a.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>

    </div>
  );
}

// ── Helpers ─────────────────────────────────────────────────
const th = {
  padding: "8px 12px",
  textAlign: "left",
  borderBottom: "1px solid #cbd5e0"
};

const td = {
  padding: "8px 12px",
  borderBottom: "1px solid #e2e8f0"
};

const statusColor = (status) => {
  if (status === "Selected")    return "#38a169";
  if (status === "Rejected")    return "#e53e3e";
  if (status === "Pending")     return "#d69e2e";
  return "#3182ce";
};