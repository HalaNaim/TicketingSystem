import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await fetch("https://localhost:7184/Users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, roleId: 3 }) // roleId=3 for Employee by default
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Server error:", text);
        alert("Registration failed!");
        return;
      }

      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (err) {
      console.error("Network error:", err);
      alert("Error connecting to server");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Register</h1>

      <input
        ref={nameRef}
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        ref={emailRef}
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        ref={passwordRef}
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <div className="error-message">{error}</div>}

      <button type="submit" className="register-btn">Sign Up</button>
    </form>
  );
}

export default Register;
