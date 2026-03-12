import { useState } from "react";
import { api } from "../api";
import { useNavigate, Link } from "react-router-dom";
import "../App.css";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
     
      const { data } = await api.post("/api/auth/login", { email, password });

      // Save token to localStorage
      localStorage.setItem("token", data.token);

      // Also save user info for easy access
      localStorage.setItem("user", JSON.stringify({
        id:         data.id,
        email:      data.email,
        fullName:   data.fullName,
        role:       data.role,
        isVerified: data.isVerified
      }));

      navigate("/dashboard");

    } catch (err) {
      const msg = err.response?.data?.message || "Invalid credentials";
      alert(msg);
    }
  };

  return (
    <div className="container">

      <h1 className="title">Placement Automation Tool</h1>

      <div className="card">

        <h2>Login</h2>

        <input
          placeholder="Email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={login}>Login</button>

        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>

      </div>

    </div>
  );
}