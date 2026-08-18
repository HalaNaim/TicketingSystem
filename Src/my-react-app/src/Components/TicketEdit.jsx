import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function TicketEdit() {
  const { id } = useParams();          // get ticket ID from URL
  const navigate = useNavigate();      // for redirect after save
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch ticket details when component loads
  useEffect(() => {
    axios.get(`https://localhost:7184/Tickets/${id}`)
      .then(response => {
        setSubject(response.data.subject || "");
        setDescription(response.data.description || "");
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching ticket:", error);
        setLoading(false);
      });
  }, [id]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`https://localhost:7184/Tickets/${id}`, {
      subject,
      description,
      userId: 1,       // adjust IDs as needed
      agentId: 2,
      categoryId: 1,
      priorityId: 1,
      statusId: 1
    })
    .then(() => {
      alert("Ticket updated successfully!");
      navigate(`/tickets/${id}`);   // redirect back to detail page
    })
    .catch(error => console.error("Error updating ticket:", error));
  };

  if (loading) {
    return <p>Loading ticket...</p>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>Edit Ticket #{id}</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>Subject:</label><br />
          <input 
            type="text" 
            value={subject} 
            onChange={(e) => setSubject(e.target.value)} 
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Description:</label><br />
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            style={{ width: "100%", height: "120px", padding: "8px" }}
          />
        </div>
        <button type="submit" style={{ padding: "10px 20px" }}>Save Changes</button>
      </form>
    </div>
  );
}

export default TicketEdit;   
