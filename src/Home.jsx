import React, { useState } from "react";
import "./style.css";

function Home() {
  const [showLogin, setShowLogin] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("LOGIN:", formData);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    console.log("REGISTER:", formData);
  };

  return (
    <div className="page">
  <div className="card">
    <div className="header">
      <h1>Real-Time Slot Booking System</h1>
      <p className="subtitle">Smart campus parking made simple</p>
    </div>
    <div className="container">
      
      {/* LOGIN FORM */}
      <div className={`form-box ${showLogin ? "active" : ""}`}>
        <form onSubmit={handleLogin}>
          <h2>Login</h2>

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            onChange={handleChange}
          />

          <button type="submit">Login</button>
        </form>

        <p>
          Don't have an account?{" "}
          <span
            className="link"
            onClick={() => setShowLogin(false)}
          >
            Register
          </span>
        </p>
      </div>

      <div className={`form-box ${!showLogin ? "active" : ""}`}>
        <form onSubmit={handleRegister}>
          <h2>Register</h2>

          <input
            type="text"
            name="name"
            placeholder="Name"
            required
            onChange={handleChange}
          />

          <select name="role" required onChange={handleChange}>
            <option value="">Select Role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            onChange={handleChange}
          />

          <button type="submit">Register</button>
        </form>

        <p>
          Already have an account?{" "}
          <span
            className="link"
            onClick={() => setShowLogin(true)}
          >
            Login
          </span>
        </p>
      </div>

    </div>
    </div>
    </div>
  );
}

export default Home;