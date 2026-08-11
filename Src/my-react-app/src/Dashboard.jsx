import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import EmployeeDashboard from "./EmployeeDashboard";
import AdminDashboard from "./AdminDashboard";
import AgentDashboard from "./AgentDashboard";
import ManagerDashboard from "./ManagerDashboard";

function Dashboard() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  let role = null;
  let userName = "User";

  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      userName = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || "User";
    } catch (err) {
      console.error("Invalid token", err);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Route to appropriate dashboard based on role
  switch (role) {
    case "Admin":
      return <AdminDashboard onLogout={handleLogout} />;
    case "Agent":
      return <AgentDashboard userName={userName} onLogout={handleLogout} />;
    case "Manager":
      return <ManagerDashboard userName={userName} onLogout={handleLogout} />;
    default:
      // Default to Employee Dashboard
      return <EmployeeDashboard userName={userName} onLogout={handleLogout} />;
  }
}

export default Dashboard;
