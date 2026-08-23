import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import './style.css';

function Register() {
  const [data, setData] = useState({ name: "", role: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = e => setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!data.role) { alert("Please select a role!"); return; }
    try {
      const res    = await fetch("http://localhost:5000/register", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data)
      });
      const result = await res.json();
      if (res.ok) { alert(result.msg || "Registered successfully!"); navigate("/"); }
      else        { alert(result.msg || "Registration failed!"); }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="auth-page">

      {/* ══════════════ LEFT PANEL ══════════════ */}
      <div className="auth-left">
        <div className="auth-dots" />
        <div className="auth-shapes">
          <div className="auth-shape auth-shape-1" />
          <div className="auth-shape auth-shape-2" />
          <div className="auth-shape auth-shape-3" />
          <div className="auth-shape auth-shape-4" />
        </div>

        <div className="auth-left-content">
          {/* Brand */}
          <div className="auth-brand">
            <div className="auth-brand-icon">P</div>
            <div className="auth-brand-name">ParkSmart</div>
          </div>

          {/* Headline */}
          <h1 className="auth-headline">
            Join the<br />
            <span>Family.</span>
          </h1>
          <p className="auth-tagline">
            Create your account and get instant access<br />
            to smart campus parking in seconds.
          </p>

          {/* Divider */}
          <div className="auth-divider">
            <div className="auth-divider-line" />
            <div className="auth-divider-label">What You Get</div>
            <div className="auth-divider-line" style={{ background: "linear-gradient(90deg, rgba(226,194,125,.05), rgba(226,194,125,.5))" }} />
          </div>

          {/* Features */}
          <div className="auth-features">
            <div className="auth-feature">
              <div className="auth-feature-icon">📊</div>
              <div className="auth-feature-text">Personal booking dashboard</div>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon">🚀</div>
              <div className="auth-feature-text">Lightning-fast slot booking</div>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon">🛡️</div>
              <div className="auth-feature-text">Student &amp; admin access roles</div>
            </div>
          </div>

          {/* Quote */}
          <div className="auth-quote">
            <p className="auth-quote-text">
              "Set up in 30 seconds. Park in 10."
            </p>
            <div className="auth-quote-author">— ParkSmart, 2025</div>
          </div>
        </div>
      </div>

      {/* ══════════════ RIGHT PANEL ══════════════ */}
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-accent" />

          <div className="auth-eyebrow">New Account</div>
          <h2>Create Account</h2>
          <p className="auth-subtitle">
            Fill in your details to get started in seconds.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <div className="input-wrapper">
                <input
                  id="name" type="text" name="name"
                  placeholder="Your full name"
                  value={data.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="role">Account Type</label>
              <div className="input-wrapper">
                <select id="role" name="role" value={data.role} onChange={handleChange} required>
                  <option value="">Select your role</option>
                  <option value="user">Student / User</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <input
                  id="email" type="email" name="email"
                  placeholder="you@university.edu"
                  value={data.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <input
                  id="password" type="password" name="password"
                  placeholder="Create a strong password"
                  value={data.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="auth-button">
              Create Account →
            </button>
          </form>

          <div className="auth-links">
            <span>Already have an account? </span>
            <Link to="/">Sign in here</Link>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Register;