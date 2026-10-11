import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FileText, ClipboardList, AlertTriangle, User, Settings, Send, Paperclip, MessageSquare } from "lucide-react";
import "./TicketEdit.css";
import { useAuth } from "../AuthContext";

function TicketEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [agents, setAgents] = useState([]);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [priorityId, setPriorityId] = useState("");
  const [statusId, setStatusId] = useState("");
  const [agentId, setAgentId] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [comment, setComment] = useState(""); 
  const [loading, setLoading] = useState(true);
  const { auth } = useAuth();
  const currentUserId = auth.userId;
  // Fetch ticket details
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/Tickets/${id}`)
      .then(res => {
        const t = res.data;
        setSubject(t.subject || "");
        setDescription(t.description || "");
        setCategoryId(t.categoryId?.toString() || "");
        setPriorityId(t.priorityId?.toString() || "");
        setStatusId(t.statusId?.toString() || "");
        setAgentId(t.agentId?.toString() || "");
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching ticket:", err);
        setLoading(false);
      });
  }, [id]);

  // Fetch agents (RoleId = 2)
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/Users/agents`)
      .then(res => setAgents(res.data))
      .catch(err => console.error("Error fetching agents:", err));
  }, []);
 

  const handleSubmit = async (e) => {
    e.preventDefault();
 
    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("description", description);
    formData.append("categoryId", categoryId);
    formData.append("priorityId", priorityId);
    formData.append("statusId", statusId);
    if (agentId) formData.append("agentId", agentId);
    if (comment) formData.append("comment", comment); 
    formData.append("userId", currentUserId);
    attachments.forEach(file => {
      formData.append("attachments", file);
    });

    try {
    const res = await axios.put(`${import.meta.env.VITE_API_URL}/Tickets/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    alert("✅ Ticket updated successfully!");
    console.log("Response:", res.data); // 👈 see backend response
    navigate(`/tickets/${id}`);
  } catch (err) {
    console.error("Error updating ticket:", err);
    alert("❌ Error: " + (err.response?.data || err.message));
  }
  };

  if (loading) return <p className="loading-text">Loading ticket...</p>;

  return (
    <div className="edit-container">
      <h2 className="edit-title">
        <ClipboardList size={20} color="#0d6efd" /> Edit Ticket #{id}
      </h2>
      <form onSubmit={handleSubmit} className="edit-form">
        
        {/* Subject */}
        <div className="form-group">
          <label className="form-label">
            <FileText size={16} className="label-icon" /> Subject
          </label>
          <input 
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="form-input"
            placeholder="Enter ticket subject..."
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="form-label">
            <FileText size={16} className="label-icon" /> Description
          </label>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-textarea"
            rows="4"
            placeholder="Describe the issue..."
          />
        </div>

        {/* Category */}
        <div className="form-group">
          <label className="form-label">
            <Settings size={16} className="label-icon" /> Category
          </label>
          <select 
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="form-select"
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
          <label className="form-label">
            <AlertTriangle size={16} className="label-icon" /> Priority
          </label>
          <select 
            value={priorityId}
            onChange={(e) => setPriorityId(e.target.value)}
            className="form-select"
          >
            <option value="">Select priority...</option>
            <option value="1">Low</option>
            <option value="2">Medium</option>
            <option value="3">High</option>
            <option value="4">Critical</option>
          </select>
        </div>

        {/* Status */}
        <div className="form-group">
          <label className="form-label">
            <ClipboardList size={16} className="label-icon" /> Status
          </label>
          <select 
            value={statusId}
            onChange={(e) => setStatusId(e.target.value)}
            className="form-select"
          >
            <option value="">Select status...</option>
            <option value="1">Open</option>
            <option value="2">In Progress</option>
            <option value="4">Pending</option>
            <option value="5">Resolved</option>
            <option value="3">Closed</option>
          </select>
        </div>

        {/* Agent */}
        <div className="form-group">
          <label className="form-label">
            <User size={16} className="label-icon" /> Assigned Agent (optional)
          </label>
          <select
            value={agentId}
            onChange={(e) => setAgentId(e.target.value)}
            className="form-select"
          >
            <option value="">Select agent...</option>
            {agents.map(agent => (
              <option key={agent.id} value={agent.id}>
                {agent.name}
              </option>
            ))}
          </select>
        </div>

        {/* Attachments */}
        <div className="form-group">
          <label className="form-label">
            <Paperclip size={16} className="label-icon" /> Attachments (optional)
          </label>
          <input
            type="file"
            multiple
            onChange={(e) => setAttachments(Array.from(e.target.files))}
            className="form-input"
          />
        </div>

        {/* Optional comment */}
        <div className="form-group">
          <label className="form-label">
            <MessageSquare size={16} className="label-icon" /> Comment (optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="form-textarea"
            rows="3"
            placeholder="Add a comment..."
          />
        </div>

        <button type="submit" className="save-btn">
          <Send size={16} className="btn-icon" /> Save Changes
        </button>
      </form>
    </div>
  );
}

export default TicketEdit;
