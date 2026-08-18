import React, { useState } from "react";
import axios from "axios";

function TicketForm() {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("https://localhost:7184/Tickets", {
      subject,
      description,
      userId: 1,
      agentId: 2,
      categoryId: 1,
      priorityId: 1,
      statusId: 1
    })
    .then(response => {
      alert("Ticket created!");
      console.log(response.data);
    })
    .catch(error => console.error(error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Ticket</h2>
      <div>
        <label>Subject:</label>
        <input 
          type="text" 
          value={subject} 
          onChange={(e) => setSubject(e.target.value)} 
        />
      </div>
      <div>
        <label>Description:</label>
        <textarea 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
        />
      </div>
      <button type="submit">Add Ticket</button>
    </form>
  );
}

export default TicketForm;
