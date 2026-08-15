import { useState, useRef } from "react";
import "./Login.css";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      const missingField = !email.trim() ? "Email" : "Password";
      setError(`Please enter your ${missingField}.`);
      if (!email.trim()) {
        emailRef.current?.focus();
      } else {
        passwordRef.current?.focus();
      }
      return;
    }

    try {
      const response = await fetch("https://localhost:7184/Auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Server error:", text);
        alert("Login failed!");
        return;
      }

      const data = await response.json();

      if (!data.token) {
        alert("No token returned from server");
        return;
      }

      localStorage.setItem("token", data.token);
      navigate("/dashboard");
      alert("Login successful!");
    } catch (err) {
      console.error("Network error:", err);
      alert("Error connecting to server");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Ticketing System</h1>

      {/* Email input */}
      <input
        ref={emailRef}
        type="email"
        placeholder="Email"
        value={email}
        onFocus={() => setError("")}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* Password input */}
      <input
        ref={passwordRef}
        type="password"
        placeholder="Password"
        value={password}
        onFocus={() => setError("")}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <div className="error-message">{error}</div>}

      {/* Forgot password link */}
      <div className="forgot-password">
        <Link to="/forgot-password">Forgot Password?</Link>
      </div>

      {/* Login button */}
      <button type="submit" className="login-btn">Login</button>

      {/* OR separator */}
      <div className="or">OR</div>

      {/* Register button */}
      <button type="button" className="register-btn" onClick={() => navigate("/register")}>
        Register
      </button>

      {/* Sign up text */}
      <div className="signup-text">
        Don't have an account? <Link to="/register">Sign up now!</Link>
      </div>
    </form>
  );
}

export default Login;
