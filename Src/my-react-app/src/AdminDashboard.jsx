import { useState, useEffect } from "react";
import "./Dashboard.css";
import axios from "axios";

import { Routes, Route, NavLink } from "react-router-dom";  
import TicketList from "./components/TicketList";         
import TicketDetail from "./components/TicketDetail";     
import TicketEdit from "./components/TicketEdit";         
import TicketForm from "./components/TicketForm";  
import { LayoutDashboard, Users, Tags, ClipboardList, PlusCircle,
         BarChart3, Settings, LogOut} from "lucide-react";  

// Maps DB numeric IDs → readable labels + CSS class
const STATUS_MAP = {
  1: { label: "Open",        cls: "open" },
  2: { label: "In Progress", cls: "in-progress" },
  3: { label: "Resolved",    cls: "resolved" },
  4: { label: "Closed",      cls: "closed" },
};

const PRIORITY_MAP = {
  1: { label: "High",   cls: "high" },
  2: { label: "Medium", cls: "medium" },
  3: { label: "Low",    cls: "low" },
};

function AdminDashboard({ onLogout }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    axios.get("https://localhost:7184/Tickets")
      .then(res => setTickets(res.data))
      .catch(err => console.error(err));
  }, [])



  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="logo">🎫 Ticketing System</div>
        </div>
        <div className="header-center">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-bar"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="header-right">
          <button className="icon-btn">🔔</button>
          <div className="user-profile">
            <div className="avatar">👤</div>
            <div className="user-info">
              <span className="user-role admin">Admin</span>
            </div>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Sidebar */}
        <aside className="sidebar">
  <nav className="nav-menu">

    <NavLink to="/admin" end className="nav-item">
      <LayoutDashboard size={18} color="#3b82f6" className="nav-icon" />
      <span>Dashboard</span>
    </NavLink>
    
    <NavLink to="/users" className="nav-item">
      <Users size={18} color="#8b5cf6" className="nav-icon" />
      <span>Manage Users</span>
    </NavLink>
    <NavLink to="/categories & Priorities" className="nav-item">
      <Tags size={18} color="#f59e0b" className="nav-icon" />
      <span>Categories & Priorities</span>
    </NavLink>
    <NavLink to="/tickets" className="nav-item">
      <ClipboardList size={18} color="#10b981" className="nav-icon" />
      <span>Tickets</span>
    </NavLink>
    <NavLink to="/tickets/new" className="nav-item">
      <PlusCircle size={18} color="#ec4899" className="nav-icon" />
      <span>Create Ticket</span>
    </NavLink>
    <NavLink to="/Reports & Analytics" className="nav-item">
      <BarChart3 size={18} color="#06b6d4" className="nav-icon" />
      <span>Reports & Analytics</span>
    </NavLink>
    <NavLink to="/settings" className="nav-item">
      <Settings size={18} color="#64748b" className="nav-icon" />
      <span>Settings</span>
    </NavLink>
  </nav>

  <button className="logout-btn" onClick={onLogout}>
    <LogOut size={16} />
    <span>Logout</span>
  </button>
</aside>

        {/* Main Content */}
        <main className="main-content">
          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Tickets</h3>
              <p className="stat-number">1234</p>
            </div>
            <div className="stat-card">
              <h3>Open Tickets</h3>
              <p className="stat-number">256</p>
            </div>
            <div className="stat-card">
              <h3>Closed Tickets</h3>
              <p className="stat-number">874</p>
            </div>
            <div className="stat-card">
              <h3>Active Users</h3>
              <p className="stat-number">120</p>
            </div>
          </div>

          {/* Ticket Overview Table */}
          <div className="table-section">
            <h2>Ticket Overview</h2>
            <table className="tickets-table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Assigned To</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                 {tickets.length === 0 ? (
                  <tr>
                    <td colSpan="6">No tickets found</td>
                  </tr>
                ) : (
                  tickets.slice(0, 5).map(ticket => {
                    const status = STATUS_MAP[ticket.statusId] || { label: "-", cls: "" };
                    const priority = PRIORITY_MAP[ticket.priorityId] || { label: "-", cls: "" };
                    return (
                      <tr key={ticket.id}>
                        <td>#{ticket.id}</td>
                        <td>{ticket.subject}</td>
                        <td><span className={`status ${status.cls}`}>{status.label}</span></td>
                        <td><span className={`priority ${priority.cls}`}>{priority.label}</span></td>
                        <td>{ticket.agentName || `Agent ${ticket.agentId}`}</td>
                        <td>
                          <button className="action-btn edit">Edit</button>
                          <button className="action-btn delete">Delete</button>
                          <button className="action-btn view">View</button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Charts Section */}
          <div className="charts-grid">
            <div className="chart-container">
              <h3>Tickets by Category</h3>
              <div className="chart-placeholder">
                <div className="bar" style={{height: '70%'}}></div>
                <div className="bar" style={{height: '50%'}}></div>
                <div className="bar" style={{height: '40%'}}></div>
                <div className="bar" style={{height: '30%'}}></div>
              </div>
            </div>
            <div className="chart-container">
              <h3>Resolution Time</h3>
              <div className="chart-legend">
                <div className="legend-item">
                  <span className="legend-color" style={{backgroundColor: '#007bff'}}></span>
                  <span>Last Week</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{backgroundColor: '#ff6b6b'}}></span>
                  <span>This Week</span>
                </div>
              </div>
              <svg className="line-chart" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet">
                {/* Axis lines */}
                <line x1="40" y1="20" x2="40" y2="180" stroke="#ccc" strokeWidth="1.5" />
                <line x1="40" y1="180" x2="390" y2="180" stroke="#ccc" strokeWidth="1.5" />

                {/* Y axis labels */}
                <text x="20" y="25" fill="#333" fontSize="10" textAnchor="middle">100</text>
                <text x="20" y="65" fill="#333" fontSize="10" textAnchor="middle">75</text>
                <text x="20" y="105" fill="#333" fontSize="10" textAnchor="middle">50</text>
                <text x="20" y="145" fill="#333" fontSize="10" textAnchor="middle">25</text>
                <text x="20" y="185" fill="#333" fontSize="10" textAnchor="middle">0</text>

                {/* X axis labels */}
                <text x="60" y="195" fill="#333" fontSize="10" textAnchor="middle">Mon</text>
                <text x="140" y="195" fill="#333" fontSize="10" textAnchor="middle">Tue</text>
                <text x="220" y="195" fill="#333" fontSize="10" textAnchor="middle">Wed</text>
                <text x="300" y="195" fill="#333" fontSize="10" textAnchor="middle">Thu</text>
                <text x="380" y="195" fill="#333" fontSize="10" textAnchor="middle">Fri</text>

                {/* Grid lines */}
                <line x1="40" y1="50" x2="390" y2="50" stroke="#e0e0e0" strokeWidth="1" />
                <line x1="40" y1="100" x2="390" y2="100" stroke="#e0e0e0" strokeWidth="1" />
                <line x1="40" y1="150" x2="390" y2="150" stroke="#e0e0e0" strokeWidth="1" />
                
                {/* Last Week Line - Blue */}
                <polyline points="40,140 100,110 160,130 220,90 280,120 340,70 380,60" 
                  fill="none" stroke="#007bff" strokeWidth="2.5" />
                
                {/* Last Week Data Points */}
                <circle cx="40" cy="140" r="4" fill="#007bff" />
                <circle cx="100" cy="110" r="4" fill="#007bff" />
                <circle cx="160" cy="130" r="4" fill="#007bff" />
                <circle cx="220" cy="90" r="4" fill="#007bff" />
                <circle cx="280" cy="120" r="4" fill="#007bff" />
                <circle cx="340" cy="70" r="4" fill="#007bff" />
                <circle cx="380" cy="60" r="4" fill="#007bff" />

                {/* This Week Line - Red */}
                <polyline points="40,120 100,95 160,105 220,75 280,90 340,50 380,45" 
                  fill="none" stroke="#ff6b6b" strokeWidth="2.5" />
                
                {/* This Week Data Points */}
                <circle cx="40" cy="120" r="4" fill="#ff6b6b" />
                <circle cx="100" cy="95" r="4" fill="#ff6b6b" />
                <circle cx="160" cy="105" r="4" fill="#ff6b6b" />
                <circle cx="220" cy="75" r="4" fill="#ff6b6b" />
                <circle cx="280" cy="90" r="4" fill="#ff6b6b" />
                <circle cx="340" cy="50" r="4" fill="#ff6b6b" />
                <circle cx="380" cy="45" r="4" fill="#ff6b6b" />
              </svg>
            </div>
          </div>
          <Routes>   
    <Route path="/tickets" element={<TicketList />} />
    <Route path="/tickets/:id" element={<TicketDetail />} />
    <Route path="/tickets/:id/edit" element={<TicketEdit />} />
    <Route path="/tickets/new" element={<TicketForm />} />
  </Routes>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
