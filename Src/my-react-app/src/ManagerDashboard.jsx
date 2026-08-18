import { useState, useEffect } from "react";
import "./Dashboard.css";
import axios from "axios";
import { LayoutDashboard, Users, ClipboardList, BarChart3, MessageSquare, Settings, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";


function ManagerDashboard({ onLogout }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    axios.get("https://localhost:7184/Tickets")
      .then(res => setTickets(res.data))
      .catch(err => console.error(err));
  }, []);

   const summaryCards = [
    { title: "Open Tickets", value: tickets.filter(t => t.statusId === 1).length },
    { title: "In Progress", value: tickets.filter(t => t.statusId === 2).length },
    { title: "Resolved Today", value: tickets.filter(t => t.statusId === 3).length }, 
    { title: "Team Members", value: 8 }, // keep static or replace with backend later
  ];

  const performanceMetrics = [
    { label: "Tickets Resolved", value: 72, color: "#6c757d" },
    { label: "Avg. Response Time", value: 65, color: "#007bff" },
    { label: "Customer Satisfaction", value: 80, color: "#198754" },
  ];

  const agentActivity = [
    { name: "John", tickets: 3, status: "Online" },
    { name: "Sarah", tickets: 0, status: "Online" },
    { name: "Mike", tickets: 2, status: "Online" },
  ];


  return (
    <div className="dashboard-container">
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
              <span className="user-role">Manager</span>
            </div>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <aside className="sidebar">
          <nav className="nav-menu">
           <NavLink to="/manager" end className="nav-item">
  <LayoutDashboard size={18} color="#3b82f6" className="nav-icon" />
  <span>Dashboard</span>
</NavLink>

<NavLink to="/team-overview" className="nav-item">
  <Users size={18} color="#8b5cf6" className="nav-icon" />
  <span>Team Overview</span>
</NavLink>

<NavLink to="/ticket-reports" className="nav-item">
  <ClipboardList size={18} color="#10b981" className="nav-icon" />
  <span>Ticket Reports</span>
</NavLink>

<NavLink to="/performance" className="nav-item">
  <BarChart3 size={18} color="#06b6d4" className="nav-icon" />
  <span>Performance</span>
</NavLink>

<NavLink to="/feedback" className="nav-item">
  <MessageSquare size={18} color="#ec4899" className="nav-icon" />
  <span>User Feedback</span>
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

        <main className="main-content">
           {/* Summary cards */}
          <div className="stats-grid">
            {summaryCards.map((card) => (
              <div key={card.title} className="stat-card">
                <h3>{card.title}</h3>
                <p className="stat-number">{card.value}</p>
              </div>
            ))}
          </div>
           {/* Performance + Agent Activity */}
          <div className="dashboard-row">
            <div className="performance-card">
              <div className="card-header">
                <h2>Team Performance</h2>
              </div>
              <div className="performance-list">
                {performanceMetrics.map((metric) => (
                  <div key={metric.label} className="performance-item">
                    <div className="performance-label">
                      <span>{metric.label}</span>
                      <strong>{metric.value}%</strong>
                    </div>
                    <div className="performance-bar">
                      <div className="performance-fill" style={{ width: `${metric.value}%`, backgroundColor: metric.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="activity-card">
              <div className="card-header">
                <h2>Agent Activity</h2>
              </div>
              <div className="activity-list">
                {agentActivity.map((agent) => (
                  <div key={agent.name} className="activity-item">
                    <div className="activity-user">
                      <span className="avatar">👤</span>
                      <div>
                        <div className="activity-name">{agent.name}</div>
                        <div className="activity-meta">{agent.tickets} Tickets</div>
                      </div>
                    </div>
                    <div className="activity-actions">
                      <span className="activity-status">{agent.status}</span>
                      <button className="action-btn view">View</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>


            {/* Recent Tickets table */}
          <div className="ticket-table-row">
            <div className="table-section">
              <h2>Recent Tickets</h2>
              <table className="tickets-table">
                <thead>
                  <tr>
                    <th>Ticket ID</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Agent</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                   {tickets.length === 0 ? (
                    <tr>
                      <td colSpan="6">No tickets found</td>
                    </tr>
                  ) : (
                    tickets.slice(0, 5).map(ticket => (
                      <tr key={ticket.id}>
                        <td>#{ticket.id}</td>
                        <td>{ticket.subject}</td>
                       <td> <span className={`status ${ticket.statusName?.toLowerCase().replace(/\s+/g, '-')}`}>
    {ticket.statusName || `Status ${ticket.statusId}`} </span></td>
                      <td><span className={`priority ${ticket.priorityName?.toLowerCase()}`}>
    {ticket.priorityName || `Priority ${ticket.priorityId}`}</span></td>

                        <td>{ticket.agentName || `Agent ${ticket.agentId}`}</td>
                        <td><button className="action-btn view">View</button></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="chart-container">
              <h3>Resolution Stats</h3>
              <svg className="line-chart" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet">
                <line x1="40" y1="20" x2="40" y2="180" stroke="#ccc" strokeWidth="1.5" />
                <line x1="40" y1="180" x2="390" y2="180" stroke="#ccc" strokeWidth="1.5" />
                <text x="20" y="25" fill="#333" fontSize="10" textAnchor="middle">100</text>
                <text x="20" y="65" fill="#333" fontSize="10" textAnchor="middle">75</text>
                <text x="20" y="105" fill="#333" fontSize="10" textAnchor="middle">50</text>
                <text x="20" y="145" fill="#333" fontSize="10" textAnchor="middle">25</text>
                <text x="20" y="185" fill="#333" fontSize="10" textAnchor="middle">0</text>
                <text x="60" y="195" fill="#333" fontSize="10" textAnchor="middle">Mon</text>
                <text x="140" y="195" fill="#333" fontSize="10" textAnchor="middle">Tue</text>
                <text x="220" y="195" fill="#333" fontSize="10" textAnchor="middle">Wed</text>
                <text x="300" y="195" fill="#333" fontSize="10" textAnchor="middle">Thu</text>
                <text x="380" y="195" fill="#333" fontSize="10" textAnchor="middle">Fri</text>
                <line x1="40" y1="50" x2="390" y2="50" stroke="#e0e0e0" strokeWidth="1" />
                <line x1="40" y1="100" x2="390" y2="100" stroke="#e0e0e0" strokeWidth="1" />
                <polyline points="40,130 100,110 160,120 220,90 280,100 340,85 380,70" fill="none" stroke="#007bff" strokeWidth="3" />
                <polyline points="40,145 100,125 140,135 200,105 260,115 320,95 380,80" fill="none" stroke="#6c757d" strokeWidth="3" />
                <circle cx="40" cy="130" r="4" fill="#007bff" />
                <circle cx="100" cy="110" r="4" fill="#007bff" />
                <circle cx="160" cy="120" r="4" fill="#007bff" />
                <circle cx="220" cy="90" r="4" fill="#007bff" />
                <circle cx="280" cy="100" r="4" fill="#007bff" />
                <circle cx="340" cy="85" r="4" fill="#007bff" />
                <circle cx="380" cy="70" r="4" fill="#007bff" />
                <circle cx="40" cy="145" r="4" fill="#6c757d" />
                <circle cx="100" cy="125" r="4" fill="#6c757d" />
                <circle cx="140" cy="135" r="4" fill="#6c757d" />
                <circle cx="200" cy="105" r="4" fill="#6c757d" />
                <circle cx="260" cy="115" r="4" fill="#6c757d" />
                <circle cx="320" cy="95" r="4" fill="#6c757d" />
                <circle cx="380" cy="80" r="4" fill="#6c757d" />
              </svg>
              <div className="chart-legend">
                <div className="legend-item">
                  <span className="legend-color" style={{backgroundColor: '#007bff'}}></span>
                  <span>This Week</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{backgroundColor: '#6c757d'}}></span>
                  <span>Last Week</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ManagerDashboard;
