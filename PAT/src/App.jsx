import { useState } from "react";
import "./App.css";
import HomePage from "./pages/HomePage";
import InfoPage from "./pages/InfoPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import StudentDashboard from "./pages/StudentDashboard";
import CoordinatorDashboard from "./pages/CoordinatorDashboard";
import TpoDashboard from "./pages/TpoDashboard";

export default function App() {
  const [page, setPage] = useState("home");
  const [loginRole, setLoginRole] = useState("Student");
  const [infoKey, setInfoKey] = useState("announcements");
  const [user, setUser] = useState(null);

  function goHome() { setPage("home"); }

  function handleLoginSuccess(data) {
    setUser(data);
    if (data.role === "STUDENT") setPage("student");
    else if (data.role === "COORDINATOR") setPage("coordinator");
    else if (data.role === "TPO") setPage("tpo");
    else alert("Login successful! Role: " + data.role + "\n(Dashboard for this role coming soon)");
  }

  return (
    <>
      {page === "home" && (
        <HomePage
          onGoToInfo={key => { setInfoKey(key); setPage("info"); }}
          onGoToLogin={role => { setLoginRole(role); setPage("login"); }}
        />
      )}
      {page === "info" && <InfoPage infoKey={infoKey} onGoHome={goHome} />}
      {page === "login" && (
        <LoginPage
          role={loginRole}
          onGoHome={goHome}
          onGoSignup={() => setPage("signup")}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      {page === "signup" && (
        <SignupPage
          onGoHome={goHome}
          onGoLogin={() => setPage("login")}
        />
      )}
      {page === "student" && user && <StudentDashboard user={user} onLogout={goHome} />}
      {page === "coordinator" && user && <CoordinatorDashboard user={user} onLogout={goHome} />}
      {page === "tpo" && user && <TpoDashboard user={user} onLogout={goHome} />}
    </>
  );
}
