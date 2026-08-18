import { useState, useEffect } from "react";
import "./Dashboard.css";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, PlusCircle, ClipboardList, BookOpen, HelpCircle, Settings, LogOut } from "lucide-react";

function EmployeeDashboard({ userName, onLogout }) {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const displayName = userName === "Employee User" ? "Employee" : userName;

  const [tasks, setTasks] = useState([
    { id: 1, text: "Provide details on VPN setup", due: "Due Today", completed: false },
    { id: 2, text: "Follow up on install", due: "Due Today", completed: false },
  ]);

  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    axios.get("https://localhost:7184/Tickets")
      .then(res => setTickets(res.data))
      .catch(err => console.error(err));
  }, []);

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

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
              placeholder="Search articles..."
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
              <span className="user-role">Employee</span>
            </div>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
         {/* Sidebar */}
        <aside className="sidebar">
          <nav className="nav-menu">
            <NavLink to="/employee" end className="nav-item">
              <LayoutDashboard size={18} color="#3b82f6" className="nav-icon" />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/tickets/new" className="nav-item">
              <PlusCircle size={18} color="#ec4899" className="nav-icon" />
              <span>Submit Ticket</span>
            </NavLink>
            <NavLink to="/my-tickets" className="nav-item">
              <ClipboardList size={18} color="#10b981" className="nav-icon" />
              <span>My Tickets</span>
            </NavLink>
            <NavLink to="/knowledge-base" className="nav-item">
              <BookOpen size={18} color="#8b5cf6" className="nav-icon" />
              <span>Knowledge Base</span>
            </NavLink>
            <NavLink to="/faq" className="nav-item">
              <HelpCircle size={18} color="#06b6d4" className="nav-icon" />
              <span>FAQ</span>
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
        <main className="employee-main-content">
          <h1 className="welcome-title">Welcome, {displayName}!</h1>

          {/* Stats Cards */}
          <div className="stats-grid employee-stats">
            <div className="stat-card">
              <h3>Open Tickets</h3>
              <p className="stat-number">{tickets.filter(t => t.statusId === 1).length}</p>
            </div>
            <div className="stat-card">
              <h3>Tickets in Progress</h3>
              <p className="stat-number">{tickets.filter(t => t.statusId === 2).length}</p>
            </div>
            <div className="stat-card">
              <h3>Awaiting Response</h3>
              <p className="stat-number">{tickets.filter(t => t.statusId === 5).length}</p>
            </div>
            <div className="stat-card">
              <h3>Resolved Tickets</h3>
              <p className="stat-number">{tickets.filter(t => t.statusId === 3).length}</p>
            </div>
          </div>

          <div className="employee-content-grid">


            {/* Recent Tickets */}
            <div className="content-section">
              <h2>Recent Tickets</h2>
              <table className="tickets-table">
                <thead>
                  <tr>
                    <th>Ticket ID</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>Last Update</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.length === 0 ? (
                    <tr><td colSpan="4">No tickets found</td></tr>
                  ) : (
                    tickets.slice(0, 5).map(ticket => (
                      <tr key={ticket.id}>
                        <td>#{ticket.id}</td>
                        <td>{ticket.subject}</td>
                        <td>
                          <span className={`status ${ticket.statusName?.toLowerCase().replace(/\s+/g, '-')}`}>
                            {ticket.statusName || `Status ${ticket.statusId}`}
                          </span>
                        </td>
                        <td>{new Date(ticket.updatedAt || ticket.createdDate).toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <button className="view-all-btn" onClick={() => navigate("/my-tickets")}>View All</button>
            </div>


            {/* My Tasks + Resolution Stats Column */}
            <div className="employee-right-column">
              {/* My Tasks */}
              <div className="content-section">
                <h3>My Tasks</h3>
                <div className="tasks-list">
                  {tasks.map((task) => (
                    <div key={task.id} className="task-item">
                      <input 
                        type="checkbox" 
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                        className="task-checkbox"
                      />
                      <span className={task.completed ? 'task-completed' : ''}>{task.text}</span>
                      <span className="task-due">{task.due}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resolution Stats */}
              <div className="content-section">
                <h3>Resolution Stats</h3>
                <div className="chart-legend">
                  <div className="legend-item">
                    <span className="legend-color" style={{backgroundColor: '#007bff'}}></span>
                    <span>This Week</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color" style={{backgroundColor: '#808080'}}></span>
                    <span>Last Week</span>
                  </div>
                </div>
                <svg className="line-chart" viewBox="0 0 350 170" preserveAspectRatio="xMidYMid meet">
                  <line x1="40" y1="20" x2="40" y2="150" stroke="#ccc" strokeWidth="1.5" />
                  <line x1="40" y1="150" x2="330" y2="150" stroke="#ccc" strokeWidth="1.5" />
                  <text x="20" y="25" fill="#333" fontSize="10" textAnchor="middle">100</text>
                  <text x="20" y="55" fill="#333" fontSize="10" textAnchor="middle">75</text>
                  <text x="20" y="85" fill="#333" fontSize="10" textAnchor="middle">50</text>
                  <text x="20" y="115" fill="#333" fontSize="10" textAnchor="middle">25</text>
                  <text x="20" y="150" fill="#333" fontSize="10" textAnchor="middle">0</text>
                  <text x="70" y="165" fill="#333" fontSize="10" textAnchor="middle">Mon</text>
                  <text x="120" y="165" fill="#333" fontSize="10" textAnchor="middle">Tue</text>
                  <text x="170" y="165" fill="#333" fontSize="10" textAnchor="middle">Wed</text>
                  <text x="220" y="165" fill="#333" fontSize="10" textAnchor="middle">Thu</text>
                  <text x="270" y="165" fill="#333" fontSize="10" textAnchor="middle">Fri</text>
                  <line x1="40" y1="40" x2="330" y2="40" stroke="#e0e0e0" strokeWidth="1" />
                  <line x1="40" y1="80" x2="330" y2="80" stroke="#e0e0e0" strokeWidth="1" />
                  <polyline points="40,80 80,60 120,70 160,50 200,65 240,45 280,40" 
                    fill="none" stroke="#007bff" strokeWidth="2" />
                  <circle cx="40" cy="80" r="3" fill="#007bff" />
                  <circle cx="80" cy="60" r="3" fill="#007bff" />
                  <circle cx="120" cy="70" r="3" fill="#007bff" />
                  <circle cx="160" cy="50" r="3" fill="#007bff" />
                  <circle cx="200" cy="65" r="3" fill="#007bff" />
                  <circle cx="240" cy="45" r="3" fill="#007bff" />
                  <circle cx="280" cy="40" r="3" fill="#007bff" />
                  <polyline points="40,95 80,75 120,85 160,65 200,80 240,60 280,55" 
                    fill="none" stroke="#808080" strokeWidth="2" />
                  <circle cx="40" cy="95" r="3" fill="#808080" />
                  <circle cx="80" cy="75" r="3" fill="#808080" />
                  <circle cx="120" cy="85" r="3" fill="#808080" />
                  <circle cx="160" cy="65" r="3" fill="#808080" />
                  <circle cx="200" cy="80" r="3" fill="#808080" />
                  <circle cx="240" cy="60" r="3" fill="#808080" />
                  <circle cx="280" cy="55" r="3" fill="#808080" />
                </svg>
              </div>
            </div>
          </div>

          {/* Announcements and Help Resources */}
          <div className="employee-bottom-grid">
            {/* Announcements */}
            <div className="content-section">
              <h3>Announcements</h3>
              <div className="announcement-item">
                <h4>System Maintenance Tonight</h4>
                <p>Reminder: Scheduled maintenance at 10:00 PM.</p>
              </div>
              <div className="announcement-item">
                <h4>New Knowledge Base Articles</h4>
                <p>Three new guides on troubleshooting tips added!</p>
              </div>
              <button className="view-more-btn">View More</button>
            </div>

            {/* Help Resources */}
            <div className="content-section">
              <h3>Help Resources</h3>
              <div className="resources-grid">
                <div className="resource-card" onClick={() => alert("Opening: How to Reset Your Password")}>
                  <span className="resource-icon">🔐</span>
                  <span>How to Reset Your Password</span>
                </div>
                <div className="resource-card" onClick={() => alert("Opening: Setting Up VPN Access")}>
                  <span className="resource-icon">🔒</span>
                  <span>Setting Up VPN Access</span>
                </div>
                <div className="resource-card" onClick={() => alert("Opening: Troubleshooting Email Issues")}>
                  <span className="resource-icon">📧</span>
                  <span>Troubleshooting Email Issues</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default EmployeeDashboard;
