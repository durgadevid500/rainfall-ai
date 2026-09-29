import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        ${import.meta.env.VITE_API_URL}/api/...
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error);
        return;
      }

      // Save JWT token
      localStorage.setItem(
        "rainfall_token",
        data.token
      );

      // Save user role
      localStorage.setItem(
        "rainfall_role",
        data.role
      );

      alert(`Login successful - ${data.role}`);

      // Go to admin dashboard
      navigate("/admin-dashboard");

    } catch (error) {
      console.error(error);
      alert("Backend connection failed");
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">

        <div className="admin-login-icon">
          🌧️
        </div>

        <h1>Rainfall AI</h1>

        <p className="admin-login-subtitle">
          Admin & Authority Portal
        </p>

        <form onSubmit={handleLogin}>

          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your official email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          <button type="submit">
            Login
          </button>

        </form>

        <p className="admin-login-note">
          Authorized personnel only
        </p>

      </div>
    </div>
  );
}

export default AdminLogin;