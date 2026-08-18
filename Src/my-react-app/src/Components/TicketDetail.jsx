import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function TicketDetail() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    axios.get(`https://localhost:7184/Tickets/${id}`)
      .then(response => setTicket(response.data))
      .catch(error => console.error(error));
  }, [id]);

  if (!ticket) {
    return <p>Loading ticket...</p>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h2>Ticket #{ticket.id} - {ticket.subject}</h2>
      <p><strong>Status:</strong> {ticket.statusId}</p>
      <p><strong>Priority:</strong> {ticket.priorityId}</p>
      <p><strong>Category:</strong> {ticket.categoryId}</p>
      <p><strong>Assigned Agent:</strong> {ticket.agentId}</p>
      <p><strong>Created:</strong> {ticket.createdDate}</p>
      <p><strong>Updated:</strong> {ticket.updatedDate || "Not updated yet"}</p>

      <h3>Description</h3>
      <p>{ticket.description}</p>

      <h3>Attachments</h3>
      <ul>
        {/* Later you can fetch TicketAttachments table */}
        <li>No attachments yet</li>
      </ul>

      <h3>Activity Log</h3>
      <ul>
        {/* Later you can fetch ActivityLogs table */}
        <li>Ticket created by User {ticket.userId}</li>
      </ul>

      <h3>Add Comment</h3>
      <textarea placeholder="Write a comment..." style={{ width: "100%", height: "80px" }}></textarea>
      <button style={{ marginTop: "10px" }}>Submit</button>

      <div style={{ marginTop: "20px" }}>
        <button style={{ marginRight: "10px" }}>Edit</button>
        <button style={{ marginRight: "10px" }}>Resolve</button>
        <button style={{ marginRight: "10px" }}>Delete</button>
      </div>
    </div>
  );
}

export default TicketDetail;
