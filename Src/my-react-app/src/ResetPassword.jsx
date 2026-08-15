import { useState } from "react";
import { useLocation } from "react-router-dom";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const location = useLocation();

  // Extract token from URL query string
  const params = new URLSearchParams(location.search);
  const token = params.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://localhost:7184/Auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      if (!response.ok) {
        alert("Error resetting password");
        return;
      }

      alert("Password reset successful! You can now log in.");
    } catch (err) {
      console.error("Network error:", err);
      alert("Error connecting to server");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 style={{ color: "black" }}>Reset Password</h2>
      <input
        type="password"
        placeholder="Enter new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button type="submit">Reset Password</button>
    </form>
  );
}

export default ResetPassword;
