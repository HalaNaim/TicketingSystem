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

// Ticket components
import TicketList from "./components/TicketList";
import TicketForm from "./components/TicketForm";
import TicketDetail from "./components/TicketDetail";
import TicketEdit from "./components/TicketEdit";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route - redirect to login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Authentication routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/register" element={<Register />} />

        {/* Protected dashboard route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Ticket routes */}
        <Route
          path="/tickets"
          element={
            <ProtectedRoute>
              <TicketList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tickets/new"
          element={
            <ProtectedRoute>
              <TicketForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tickets/:id"
          element={
            <ProtectedRoute>
              <TicketDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tickets/:id/edit"
          element={
            <ProtectedRoute>
              <TicketEdit />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<EmployeeDashboard />} />
      <Route path="/my-tickets" element={<TicketList />} />
      <Route path="/employee" element={<ProtectedRoute><EmployeeDashboard /></ProtectedRoute>} />
      <Route path="/manager" element={<ProtectedRoute><ManagerDashboard /></ProtectedRoute>} />
      <Route path="/agent" element={<ProtectedRoute><AgentDashboard /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
       
      </Routes>
    </Router>
  );
}

export default App;
