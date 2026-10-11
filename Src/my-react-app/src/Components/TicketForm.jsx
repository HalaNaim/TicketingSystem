import { useState } from "react";
import axios from "axios";
import { ClipboardList, FileText, Send, Paperclip, ListChecks, AlertTriangle } from "lucide-react";
import { useAuth } from "../AuthContext";
import "./TicketForm.css";

function TicketForm() {
  const { auth } = useAuth(); // contains auth.userId, auth.userName, auth.token
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [priorityId, setPriorityId] = useState("");
  const [attachments, setAttachments] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    // Validation: max 10MB, allowed types
    const validFiles = files.filter(file => {
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      const isValidType = [
        "image/png",
        "image/jpeg",
        "application/pdf",
        "text/plain"
      ].includes(file.type);
      return isValidSize && isValidType;
    });

    setAttachments(validFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
      const formData = new FormData();
      formData.append("subject", subject);
      formData.append("description", description);
      formData.append("userId", auth.userId); // auto-filled employee ID
      formData.append("categoryId", categoryId);
      formData.append("priorityId", priorityId);
      formData.append("statusId", 1); // default Open

      attachments.forEach(file => {formData.append("attachments", file);});
//const token = localStorage.getItem("token"); // Or wherever you store your JWT
try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/Tickets`, formData, {
        headers: { Authorization: `Bearer ${auth.token}` }
         });
          alert("✅ Ticket created successfully!");
          console.log(response.data);
         setSubject("");
         setDescription("");
         setCategoryId("");
         setPriorityId("");
         setAttachments([]);
         } catch (error) {
  console.error(error);
  //alert("Failed to create ticket: " + (error.response?.data?.message || error.message));
   alert("Failed: " + (error.response?.data || error.message));
}
  };

  return (
    <div className="ticket-form-card">
      <h2 className="form-title">
        <ClipboardList size={20} color="#3b82f6" /> Create New Ticket
      </h2>
      <form onSubmit={handleSubmit} className="ticket-form">
        
        {/* Subject */}
        <div className="form-group">
  <label htmlFor="subject">
    <FileText size={16} className="label-icon" /> Subject
  </label>
  <input 
    id="subject"
    name="Subject"
    type="text" 
    value={subject} 
    onChange={(e) => setSubject(e.target.value)} 
    placeholder="Enter ticket subject..."
    required
  />
</div>

        {/* Description */}
       <div className="form-group">
  <label htmlFor="description">
    <FileText size={16} className="label-icon" /> Description
  </label>
  <textarea 
    id="description"
    name="Description"
    value={description} 
    onChange={(e) => setDescription(e.target.value)} 
    placeholder="Describe the issue..."
    rows="4"
    required
  />
</div>

        {/* Category */}
        <div className="form-group">
  <label htmlFor="categoryId">
    <ListChecks size={16} className="label-icon" /> Category
  </label>
  <select 
    id="categoryId"
    name="CategoryId"
    value={categoryId} 
    onChange={(e) => setCategoryId(e.target.value)} 
    required
  >
    <option value="">Select category...</option>
    <option value="1">Authentication</option>
    <option value="2">Networking</option>
    <option value="3">Hardware</option>
    <option value="4">Software</option>
    <option value="5">Email</option>
    <option value="6">Access Request</option>
    <option value="7">Other</option>
  </select>
</div>

        {/* Priority */}
       <div className="form-group">
  <label htmlFor="priorityId">
    <AlertTriangle size={16} className="label-icon" /> Priority
  </label>
  <select 
    id="priorityId"
    name="PriorityId"
    value={priorityId} 
    onChange={(e) => setPriorityId(e.target.value)} 
    required
  >
    <option value="">Select priority...</option>
    <option value="1">Low</option>
    <option value="2">Medium</option>
    <option value="3">High</option>
    <option value="4">Critical</option>
  </select>
</div>
        {/* File Attachments */}
        <div className="form-group">
          <label>
            <Paperclip size={16} className="label-icon" /> File Attachments
          </label>
          <input 
            type="file" 
            multiple 
            onChange={handleFileChange} 
          />
          <small className="hint">
            Allowed: PNG, JPG, PDF, TXT (max 10MB each)
          </small>
        </div>

        {/* Submit */}
        <button type="submit" className="submit-btn">
          <Send size={16} className="btn-icon" /> Add Ticket
        </button>
      </form>
    </div>
  );
}

export default TicketForm;
