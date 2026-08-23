import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import './style.css';

function Login({ setUser }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    const res    = await fetch("http://localhost:5000/login", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ email, password })
    });
    const result = await res.json();
    if (res.ok) { setUser(result.user); navigate("/parking"); }
    else        { alert(result.msg); }
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
            Welcome<br />
            <span>Back.</span>
          </h1>
          <p className="auth-tagline">
            Your campus parking, managed smarter.<br />
            Real-time slots, zero hassle.
          </p>

          {/* Divider */}
          <div className="auth-divider">
            <div className="auth-divider-line" />
            <div className="auth-divider-label">Why ParkSmart</div>
            <div className="auth-divider-line" style={{ background: "linear-gradient(90deg, rgba(226,194,125,.05), rgba(226,194,125,.5))" }} />
          </div>

          {/* Features */}
          <div className="auth-features">
            <div className="auth-feature">
              <div className="auth-feature-icon">🎯</div>
              <div className="auth-feature-text">Real-time slot availability</div>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon">⚡</div>
              <div className="auth-feature-text">Instant booking &amp; release</div>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon">🔒</div>
              <div className="auth-feature-text">Secure campus access control</div>
            </div>
          </div>

          {/* Quote */}
          <div className="auth-quote">
            <p className="auth-quote-text">
              "The best parking experience our campus has ever had."
            </p>
            <div className="auth-quote-author">— Campus Transport Office</div>
          </div>
        </div>
      </div>

      {/* ══════════════ RIGHT PANEL ══════════════ */}
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-accent" />

          <div className="auth-eyebrow">Secure Login</div>
          <h2>Sign In</h2>
          <p className="auth-subtitle">
            Enter your credentials to access your parking dashboard.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <input
                  id="email"
                  type="email"
                  placeholder="you@university.edu"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="auth-button">
              Sign In →
            </button>
          </form>

          <div className="auth-links">
            <span>Don't have an account? </span>
            <Link to="/register">Create one here</Link>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Login;