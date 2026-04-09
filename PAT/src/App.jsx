import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import InfoPage from "./pages/InfoPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import StudentDashboard from "./pages/StudentDashboard";
import CoordinatorDashboard from "./pages/CoordinatorDashboard";
import TpoDashboard from "./pages/TpoDashboard";

function normalizeUser(rawUser) {
  if (!rawUser) return null;

  const userId = rawUser.userId ?? rawUser.id ?? null;
  const name = rawUser.name ?? rawUser.fullName ?? "";

  return {
    ...rawUser,
    id: rawUser.id ?? userId,
    userId,
    name,
    fullName: rawUser.fullName ?? name,
  };
}

function loadUser() {
  try { return normalizeUser(JSON.parse(localStorage.getItem("pat_user"))); }
  catch { return null; }
}
function saveUser(user) {
  const normalizedUser = normalizeUser(user);
  if (normalizedUser) localStorage.setItem("pat_user", JSON.stringify(normalizedUser));
  else localStorage.removeItem("pat_user");
}

function Protected({ user, role, children }) {
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

function HomePageWrapper({ onGoToInfo }) {
  const navigate = useNavigate();
  return (
    <HomePage
      onGoToInfo={(key) => { onGoToInfo(key); navigate(`/info/${key}`); }}
      onGoToLogin={(role) => navigate(`/login?role=${role}`)}
      onGoToSignup={() => navigate("/signup")}
    />
  );
}

function InfoPageWrapper() {
  const { key } = useParams();
  const navigate = useNavigate();
  return <InfoPage infoKey={key} onGoHome={() => navigate("/")} />;
}

function LoginPageWrapper({ onLoginSuccess }) {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const role = params.get("role") || "Student";
  return (
    <LoginPage
      role={role}
      onGoHome={() => navigate("/")}
      onGoSignup={() => navigate("/signup")}
      onLoginSuccess={(data) => {
        onLoginSuccess(data);
        if (data.role === "STUDENT")          navigate("/student");
        else if (data.role === "COORDINATOR") navigate("/coordinator");
        else if (data.role === "TPO")         navigate("/tpo");
        else alert("Login successful! Role: " + data.role + "\n(Dashboard coming soon)");
      }}
    />
  );
}

function SignupPageWrapper() {
  const navigate = useNavigate();
  return (
    <SignupPage
      onGoHome={() => navigate("/")}
      onGoLogin={() => navigate("/login")}
    />
  );
}

function StudentWrapper({ user, onLogout }) {
  const navigate = useNavigate();
  return (
    <Protected user={user} role="STUDENT">
      <StudentDashboard user={user} onLogout={() => { onLogout(); navigate("/"); }} />
    </Protected>
  );
}

function CoordinatorWrapper({ user, onLogout }) {
  const navigate = useNavigate();
  return (
    <Protected user={user} role="COORDINATOR">
      <CoordinatorDashboard user={user} onLogout={() => { onLogout(); navigate("/"); }} />
    </Protected>
  );
}

function TpoWrapper({ user, onLogout }) {
  const navigate = useNavigate();
  return (
    <Protected user={user} role="TPO">
      <TpoDashboard user={user} onLogout={() => { onLogout(); navigate("/"); }} />
    </Protected>
  );
}

export default function App() {
  const [user, setUser] = useState(loadUser);
  const [infoKey, setInfoKey] = useState("announcements");
  const [dark, setDark] = useState(() => localStorage.getItem("pat_theme") === "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    localStorage.setItem("pat_theme", dark ? "dark" : "light");
  }, [dark]);

  function handleLoginSuccess(data) {
    const normalizedUser = normalizeUser(data);
    setUser(normalizedUser);
    saveUser(normalizedUser);
  }
  function handleLogout()           { setUser(null); saveUser(null); }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"            element={<HomePageWrapper onGoToInfo={setInfoKey} />} />
        <Route path="/info/:key"   element={<InfoPageWrapper />} />
        <Route path="/login"       element={<LoginPageWrapper onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/signup"      element={<SignupPageWrapper />} />
        <Route path="/student"     element={<StudentWrapper     user={user} onLogout={handleLogout} />} />
        <Route path="/coordinator" element={<CoordinatorWrapper user={user} onLogout={handleLogout} />} />
        <Route path="/tpo"         element={<TpoWrapper         user={user} onLogout={handleLogout} />} />
        <Route path="*"            element={<Navigate to="/" replace />} />
      </Routes>

      {/* 🌙 / ☀️ floating theme toggle — visible on every page */}
      <button className="theme-toggle" onClick={() => setDark(d => !d)} title="Toggle theme">
        {dark ? "☀️" : "🌙"}
      </button>
    </BrowserRouter>
  );
}
