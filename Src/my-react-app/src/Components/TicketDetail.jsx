import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./TicketDetail.css";


function TicketDetail({ userRole, currentUserName }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  console.log("userRole prop:", userRole);
  const handleResolve = async (id) => {
  try {
    await axios.put(`${import.meta.env.VITE_API_URL}/Tickets/${id}`, {
      ...ticket,
      statusId: 5 // Resolved
    });
    alert("✅ Ticket resolved!");
    window.location.reload(); // refresh to show updated status
  } catch (err) {
    console.error(err);
    alert("❌ Failed to resolve ticket");
  }
};

const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this ticket?")) return;
  try {
    await axios.delete(`${import.meta.env.VITE_API_URL}/Tickets/${id}`);
    alert("🗑️ Ticket deleted!");
    window.location.href = "/my-tickets"; // redirect back to list
  } catch (err) {
    console.error(err);
    alert("❌ Failed to delete ticket");
  }
};

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/Tickets/${id}`)
      .then(res => setTicket(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!ticket) return <p>Loading...</p>;

  return (
    <div className="ticket-detail-card">
      {/* Header */}
      <h2 className="ticket-title">Ticket #{ticket.id} - {ticket.subject}</h2>

      {/* Meta info */}
      <div className="ticket-meta">
  <p><strong>Status:</strong> {ticket.statusName}</p>
  <p><strong>Priority:</strong> {ticket.priorityName}</p>
  <p><strong>Agent:</strong> {ticket.agentName || "Unassigned"}</p>
  <p><strong>Category:</strong> {ticket.categoryName}</p>
  <p><strong>Created:</strong> {new Date(ticket.createdDate).toLocaleDateString()}</p>
  <p><strong>Updated:</strong> {ticket.updatedDate ? new Date(ticket.updatedDate).toLocaleDateString() : "-"}</p>
  <p><strong>Created By:</strong> {ticket.userName} ({ticket.userRole})</p>
</div>


      {/* Description */}
      <div className="ticket-description">
        <h3>Description</h3>
        <p>{ticket.description}</p>
      </div>

      {/* Attachments */}
      <div className="ticket-attachments">
        <h3>Attachments</h3>
        {ticket.attachments && ticket.attachments.length > 0 ? (
          <ul>
            {ticket.attachments.map(att => (
              <li key={att.id}>
                <a href={att.filePath} target="_blank" rel="noopener noreferrer">
                  {att.filePath.split("/").pop()}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>No attachments</p>
        )}
      </div>

      {/* Activity log */}
      <div className="ticket-activity">
        <h3>Activity Log</h3>
        <ul>
          <li>{ticket.createdDate} - Ticket created</li>
          {ticket.updatedDate && <li>{ticket.updatedDate} - Ticket updated</li>}
        </ul>
      </div>

      {/* Actions */}
      <div className="ticket-actions">
       {(userRole === "Admin" || userRole === "Employee") && (
    <>
      <button className="action-btn edit" onClick={() => navigate(`/tickets/${ticket.id}/edit`)}>Edit</button>
      <button className="action-btn delete" onClick={() => handleDelete(ticket.id)}>Delete</button>
    </>
  )}

  {/* Resolve only for Agent */}
  {userRole === "Agent" && ticket.agentName === currentUserName && (
    <button className="action-btn resolve" onClick={() => handleResolve(ticket.id)}>Resolve</button>
  )}
</div>
      

      {/* Comment box */}
      <div className="ticket-comment">
        <textarea placeholder="Add a comment..."></textarea>
        <button className="submit-btn">Submit</button>
      </div>
    </div>
  );
}

export default TicketDetail;
