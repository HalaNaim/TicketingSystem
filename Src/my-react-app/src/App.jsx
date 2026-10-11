import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import Register from "./Register";
import EmployeeDashboard from "./EmployeeDashboard";
import ManagerDashboard from "./ManagerDashboard";
import AgentDashboard from "./AgentDashboard";
import AdminDashboard from "./AdminDashboard";
import "./ActionButtons.css"; 
import { AuthProvider, useAuth } from "./AuthContext";

// Ticket components
import TicketList from "./Components/TicketList";
import TicketForm from "./Components/TicketForm";
import TicketDetail from "./Components/TicketDetail";
import TicketEdit from "./Components/TicketEdit";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Default route - redirect to login */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Authentication routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/register" element={<Register />} />

          {/* Protected dashboards */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/employee" element={<ProtectedRoute><EmployeeDashboard /></ProtectedRoute>} />
          <Route path="/manager" element={<ProtectedRoute><ManagerDashboard /></ProtectedRoute>} />
          <Route path="/agent" element={<ProtectedRoute><AgentDashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

          {/* Ticket routes */}
          <Route path="/tickets" element={<ProtectedRoute><TicketListWrapper /></ProtectedRoute>} />
          <Route path="/tickets/new" element={<ProtectedRoute><TicketForm /></ProtectedRoute>} />
          <Route path="/tickets/:id" element={<ProtectedRoute><TicketDetailWrapper /></ProtectedRoute>} />
          <Route path="/tickets/:id/edit" element={<ProtectedRoute><TicketEdit /></ProtectedRoute>} />
          <Route path="/my-tickets" element={<ProtectedRoute><TicketListWrapper /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// Wrapper to inject auth props into TicketDetail
function TicketDetailWrapper() {
  const { auth } = useAuth();
  return <TicketDetail userRole={auth.userRole} currentUserName={auth.userName} />;
}
function TicketListWrapper() {
  const { auth } = useAuth();
  return <TicketList userRole={auth.userRole} />;
}
export default App;
