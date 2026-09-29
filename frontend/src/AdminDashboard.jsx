import React, { useEffect, useState } from "react";

function AdminDashboard() {
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token =
      localStorage.getItem("rainfall_token");

    fetch(`${import.meta.env.VITE_API_URL}/api/admin/login`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Access denied"
          );
        }

        setMessage(data.message);
        setUser(data.user);
      })
      .catch((error) => {
        setMessage(error.message);
      });
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#07111f",
        color: "white",
        padding: "40px",
      }}
    >
      <h1>🌧️ Rainfall AI</h1>

      <h2>Admin & Authority Dashboard</h2>

      <p>{message}</p>

      {user && (
        <p>
          Logged in as:{" "}
          <strong>{user.email}</strong>{" "}
          ({user.role})
        </p>
      )}

      {/* Dashboard Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        <div
          style={{
            background: "#0d1b2d",
            border: "1px solid #1d3650",
            borderRadius: "16px",
            padding: "25px",
          }}
        >
          <h3>🌍 Total Districts</h3>
          <p
            style={{
              fontSize: "32px",
              fontWeight: "700",
            }}
          >
            700+
          </p>
          <span>District-level monitoring</span>
        </div>

        <div
          style={{
            background: "#0d1b2d",
            border: "1px solid #1d3650",
            borderRadius: "16px",
            padding: "25px",
          }}
        >
          <h3>⚠️ Heavy Rainfall Alerts</h3>
          <p
            style={{
              fontSize: "32px",
              fontWeight: "700",
            }}
          >
            12
          </p>
          <span>Current simulated alerts</span>
        </div>

        <div
          style={{
            background: "#0d1b2d",
            border: "1px solid #1d3650",
            borderRadius: "16px",
            padding: "25px",
          }}
        >
          <h3>📊 Active Forecasts</h3>
          <p
            style={{
              fontSize: "32px",
              fontWeight: "700",
            }}
          >
            700+
          </p>
          <span>District forecasts available</span>
        </div>
      </div>

      {/* Buttons */}
      <div style={{ marginTop: "35px" }}>
        <button
          onClick={() => {
            localStorage.removeItem(
              "rainfall_token"
            );

            localStorage.removeItem(
              "rainfall_role"
            );

            window.location.href =
              "/admin-login";
          }}
          style={{
            marginRight: "12px",
            padding: "12px 20px",
            border: "none",
            borderRadius: "8px",
            background: "#dc2626",
            color: "white",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Logout
        </button>

        <button
          onClick={() => {
            window.location.href = "/";
          }}
          style={{
            padding: "12px 20px",
            border: "none",
            borderRadius: "8px",
            background: "#2563eb",
            color: "white",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Rainfall Dashboard
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;