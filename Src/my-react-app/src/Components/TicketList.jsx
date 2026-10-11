import { useEffect, useState } from "react";
import axios from "axios";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import "./TicketList.css";
import { useNavigate } from "react-router-dom";
import "../ActionButtons.css";
import { useAuth } from "../AuthContext";

// Maps DB numeric IDs → readable labels + CSS class
const STATUS_MAP = {
  1: { label: "Open",        cls: "open" },
  2: { label: "In Progress", cls: "in-progress" },
  4: { label: "Pending",     cls: "pending" },
  5: { label: "Resolved",    cls: "resolved" },
  3: { label: "Closed",      cls: "closed" },
};

const PRIORITY_MAP = {
  1: { label: "Low",     cls: "low" },
  2: { label: "Medium",  cls: "medium" },
  3: { label: "High",    cls: "high" },
  4: { label: "Critical",cls: "critical" },
};

function TicketList({ userRole }) {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [agentFilter, setAgentFilter] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const { auth } = useAuth();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/Tickets`, {
        headers: { Authorization: `Bearer ${auth.token}` }
      })
      .then((res) => setTickets(res.data))
      .catch((err) => console.error(err));
  }, [auth.token]);

  // Unique agents pulled from the actual data
  const agents = [...new Set(tickets.map((t) => t.agentId))];

  const filtered = tickets.filter((t) => {
    return (
      (search === "" ||
        t.subject.toLowerCase().includes(search.toLowerCase())) &&
      (statusFilter === "" || t.statusId.toString() === statusFilter) &&
      (priorityFilter === "" || t.priorityId.toString() === priorityFilter) &&
      (agentFilter === "" || t.agentId?.toString() === agentFilter)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageData = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const formatDate = (d) => {
    if (!d) return "-";
    const date = new Date(d);
    return isNaN(date) ? d : date.toISOString().split("T")[0];
  };

  const handleDelete = async (id) => {
  try {
    const res = await axios.delete(`${import.meta.env.VITE_API_URL}/Tickets/${id}`, {
      headers: { Authorization: `Bearer ${auth.token}` }
    });
    // Refresh list after delete
    setTickets(tickets.filter(ticket => ticket.id !== id));

    // ✅ Show success message
    alert(res.data?.message || "Ticket deleted successfully!");
  } catch (err) {
    console.error("Delete failed:", err.response?.data || err.message);
    alert("❌ Delete failed: " + (err.response?.data || err.message));
  }
};

  return (
    <div className="tickets-page">
      {/* Top search bar */}
      <div className="tickets-top-bar">
        <div className="tickets-search">
          <Search size={16} className="tickets-search-icon" />
          <input
            type="text"
            placeholder="Search tickets..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* Filter pills */}
      <div className="filter-row">
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="filter-pill"
        >
          <option value="">Status: All</option>
          {Object.entries(STATUS_MAP).map(([id, s]) => (
            <option key={id} value={id}>{s.label}</option>
          ))}
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => {
            setPriorityFilter(e.target.value);
            setPage(1);
          }}
          className="filter-pill"
        >
          <option value="">Priority: All</option>
          {Object.entries(PRIORITY_MAP).map(([id, p]) => (
            <option key={id} value={id}>{p.label}</option>
          ))}
        </select>

        <select
          value={agentFilter}
          onChange={(e) => {
            setAgentFilter(e.target.value);
            setPage(1);
          }}
          className="filter-pill"
        >
          <option value="">Agent: All</option>
          {agents.map((id) => (
            <option key={id} value={id}>Agent {id}</option>
          ))}
        </select>
      </div>

      {/* List card */}
      <div className="tickets-card">
        <h2 className="tickets-title">Tickets List</h2>

        <table className="tickets-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Subject</th>
              <th>Creator</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Agent</th>
              <th>Created Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pageData.length === 0 ? (
              <tr>
                <td colSpan="8" className="empty-row">No tickets found</td>
              </tr>
            ) : (
              pageData.map((ticket) => {
                const status = STATUS_MAP[ticket.statusId] || { label: "Unknown", cls: "" };
                const priority = PRIORITY_MAP[ticket.priorityId] || { label: "-", cls: "" };
                return (
                  <tr key={ticket.id}>
                    <td className="ticket-id">#{ticket.id}</td>
                    <td>{ticket.subject}</td>
                    <td>{ticket.creatorName}</td>
                    <td>
                      <span className={`status ${status.cls}`}>{status.label}</span>
                    </td>
                    <td>
                      <span className={`priority ${priority.cls}`}>{priority.label}</span>
                    </td>
                    <td>{ticket.agentName || "-"}</td>
                    <td>{formatDate(ticket.createdDate)}</td>
                    <td className="action-cell">
                      <button
                        className="action-btn view"
                        onClick={() => navigate(`/tickets/${ticket.id}`)}
                      >
                        View
                      </button>

                      {(userRole === "Admin" || userRole === "Employee") && (
                        <>
                          <button
                            className="action-btn edit"
                            onClick={() => navigate(`/tickets/${ticket.id}/edit`)}
                            disabled={ticket.statusId === 2}
                          >
                            Edit
                          </button>
                          <button
                            className="action-btn delete"
                            onClick={() => handleDelete(ticket.id)}
                            disabled={ticket.statusId === 2}
                          >
                            Delete
                          </button>
                        </>
                      )}

                      {userRole === "Manager" && (
                        <button
                          className="action-btn assign"
                          onClick={() => navigate(`/tickets/${ticket.id}/assign`)}
                        >
                          Assign
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          className="page-btn"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={14} /> Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .slice(0, 4)
          .map((n) => (
            <button
              key={n}
              className={`page-num ${n === currentPage ? "active" : ""}`}
              onClick={() => setPage(n)}
            >
              {n}
            </button>
          ))}

        {totalPages > 4 && <span className="page-ellipsis">...</span>}
        {totalPages > 4 && (
          <button
            className={`page-num ${currentPage === totalPages ? "active" : ""}`}
            onClick={() => setPage(totalPages)}
          >
            {totalPages}
          </button>
        )}

        <button
          className="page-btn"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          Next <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
export default TicketList;