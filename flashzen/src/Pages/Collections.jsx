import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import {
  getUserCollections,
  addCollection,
  updateCollection,
  deleteCollection,
} from "../api/collections";

export default function Collections() {
  const { authToken, user } = useAuth();
  const [collections, setCollections] = useState([]);
  const [form, setForm] = useState({
    id: null,
    title: "",
    description: "",
    subject: "",
    topics: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authToken) return;
    refreshCollections();
  }, [authToken]);

  async function refreshCollections() {
    try {
      setLoading(true);
      const data = await getUserCollections(authToken);
      setCollections(data);
    } catch (err) {
      console.error("Error loading collections:", err);
    } finally {
      setLoading(false);
    }
  }
  

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function resetForm() {
    setForm({ id: null, title: "", description: "", subject: "", topics: "" });
    setIsEditing(false);
    setError("");
  }

  async function handleAdd() {
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    try {
      await addCollection(authToken, {
        title: form.title.trim(),
        description: form.description.trim(),
        subject: form.subject.trim(),
        topics: form.topics.split(",").map(t => t.trim()).filter(Boolean)
      });
      await refreshCollections();
      resetForm();
      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  }

  function startEdit(col) {
    setForm({
      id: col.id || col._id,
      title: col.title,
      description: col.description || "",
      subject: col.subject || "",
      topics: Array.isArray(col.topics) ? col.topics.join(", ") : ""
    });
    setIsEditing(true);
    setError("");
  }

  async function handleSave() {
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    try {
      await updateCollection(authToken, form.id, {
        title: form.title.trim(),
        description: form.description.trim(),
        subject: form.subject.trim(),
        topics: form.topics.split(",").map(t => t.trim()).filter(Boolean)
      });
      await refreshCollections();
      resetForm();
      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this collection?")) {
      try {
        await deleteCollection(authToken, id);
        setCollections(collections.filter(col => (col.id || col._id) !== id));
      } catch (err) {
        console.error(err);
      }
    }
  }

  if (!user) return <div className="container mt-5">Please login to view collections.</div>;
  if (loading) return <div className="container mt-5">Loading collections...</div>;

  return (
    <div className="container mt-5" style={{ maxWidth: "700px" }}>
      <h2 className="mb-4">My Collections</h2>

      <button
        className="btn btn-outline-success btn-sm mb-4"
        onClick={() => {
          setShowModal(true);
          setIsEditing(false);
          resetForm();
        }}
      >
        + Add Collection
      </button>

      <ul className="list-group">
        {collections.length === 0 && (
          <li className="list-group-item text-center text-muted">
            No collections yet. Add your first collection above.
          </li>
        )}
        {collections.map(col => (
  <li
    key={col.id || col._id}
    className="list-group-item d-flex justify-content-between align-items-start"
  >
    <div>
      <h6>{col.title}</h6>
      {col.subject && <small className="text-muted">Subject: {col.subject}</small>}
      {col.topics?.length > 0 && (
        <small className="text-muted d-block">Topics: {col.topics.join(", ")}</small>
      )}
      <p className="mb-0 text-muted" style={{ whiteSpace: "pre-wrap" }}>
        {col.description || "No description"}
      </p>
    </div>
    <div>

      <button
        className="btn btn-sm btn-outline-success me-2"
        title="View"
        onClick={() => navigate(`/collections/${col.id || col._id}`)}
      >
        <span className="lnr lnr-eye"></span>
      </button>

      <button
        className="btn btn-sm btn-outline-primary me-2"
        title="Edit"
        onClick={() => {
          startEdit(col);
          setShowModal(true);
        }}
      >
        <span className="lnr lnr-pencil"></span>
        </button>

          <button
            className="btn btn-sm btn-outline-danger"
            title="Delete"
            onClick={() => handleDelete(col.id || col._id)}
          >
           <span className="lnr lnr-trash"></span>
         </button>
       </div>
      </li>
      ))}

      </ul>


      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Edit Collection" : "Add New Collection"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="mb-3">
            <label htmlFor="title" className="form-label">Title *</label>
            <input
              id="title"
              name="title"
              type="text"
              className="form-control"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter collection title"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              id="description"
              name="description"
              rows="2"
              className="form-control"
              value={form.description}
              onChange={handleChange}
              placeholder="Brief description"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="subject" className="form-label">Subject</label>
            <input
              id="subject"
              name="subject"
              type="text"
              className="form-control"
              value={form.subject}
              onChange={handleChange}
              placeholder="Enter subject"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="topics" className="form-label">Topics (comma separated)</label>
            <input
              id="topics"
              name="topics"
              type="text"
              className="form-control"
              value={form.topics}
              onChange={handleChange}
              placeholder="e.g. Math, Algebra"
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          {isEditing ? (
            <>
              <Button variant="primary" onClick={handleSave}>Save</Button>
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            </>
          ) : (
            <Button variant="success" onClick={handleAdd}>Add</Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}
