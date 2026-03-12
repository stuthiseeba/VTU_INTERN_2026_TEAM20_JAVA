import { useState } from "react";
import { api } from "../api";
import { useNavigate, Link } from "react-router-dom";
import "../App.css";

export default function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName:    "",   
    email:       "",
    password:    "",
    phoneNumber: "",
    role:        "STUDENT"  // ✅ FIXED: Spring Boot Role enum values are uppercase
  });

  const register = async () => {
    try {
      // ✅ FIXED: Changed from /auth/register → /api/auth/signup (Spring Boot endpoint)
      await api.post("/api/auth/signup", form);

      alert("Registration successful! Please login.");
      navigate("/");

    } catch (err) {
      const msg = err.response?.data?.message
        || Object.values(err.response?.data || {}).join(", ")
        || "Registration failed";
      alert(msg);
    }
  };

  return (
    <div className="container">

      <h1 className="title">Placement Automation Tool</h1>

      <div className="card">

        <h2>Register</h2>

        {/* ✅ FIXED: field is fullName, not name */}
        <input
          placeholder="Full Name"
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        />

        <input
          placeholder="Email"
          type="email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password (min 6 characters)"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <input
          placeholder="Phone Number"
          onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
        />

        {/* ✅ FIXED: Role values match Spring Boot Role enum exactly */}
        <select onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="STUDENT">Student</option>
          <option value="ADMIN">Admin</option>
          <option value="RECRUITER">Recruiter</option>
          <option value="HR">HR</option>
        </select>

        <button onClick={register}>Register</button>

        <p>
          Already registered? <Link to="/">Login</Link>
        </p>

      </div>

    </div>
  );
}