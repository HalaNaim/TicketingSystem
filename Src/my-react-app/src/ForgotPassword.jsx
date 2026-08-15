import { useState } from "react";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://localhost:7184/Auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        alert("Error sending reset link");
        return;
      }

      alert("Reset link sent to your email!");
    } catch (err) {
      console.error("Network error:", err);
      alert("Error connecting to server");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 style={{ color: "black" }}>Forgot Password</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit">Send Reset Link</button>
    </form>
  );
}

export default ForgotPassword;
