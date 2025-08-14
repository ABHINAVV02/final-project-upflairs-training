import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getCollectionDetails } from "../api/collections";
import { addFlashcard, updateFlashcard, deleteFlashcard } from "../api/flashcards";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default function CollectionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authToken, user } = useAuth();

  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);

  // Flashcard form/modal state
  const [form, setForm] = useState({
    id: null,
    question: "",
    answer: "",
    hint: "",
    difficulty: "easy",
    tags: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  async function loadCollection() {
    try {
      setLoading(true);
      const data = await getCollectionDetails(id, authToken);
      setCollection(data);
    } catch (err) {
      console.error("Failed to load collection:", err);
      setCollection(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (authToken) loadCollection();
  }, [id, authToken]);

  function resetForm() {
    setForm({ id: null, question: "", answer: "", hint: "", difficulty: "easy", tags: "" });
    setError("");
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleAdd() {
    if (!form.question.trim() || !form.answer.trim()) {
      setError("Both question and answer are required.");
      return;
    }
    try {
      await addFlashcard(authToken, id, {
        question: form.question.trim(),
        answer: form.answer.trim(),
        hint: form.hint.trim(),
        difficulty: form.difficulty,
        tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
        createdAt: Date.now()
      });
      await loadCollection();
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error(error);
      setError("Failed to add flashcard.");
    }
  }

  function startEdit(card) {
    setForm({
      id: card.id,
      question: card.question,
      answer: card.answer,
      hint: card.hint || "",
      difficulty: card.difficulty || "easy",
      tags: Array.isArray(card.tags) ? card.tags.join(", ") : (card.tags || "")
    });
    setIsEditing(true);
    setError("");
    setShowModal(true);
  }

  async function handleSave() {
    if (!form.question.trim() || !form.answer.trim()) {
      setError("Both question and answer are required.");
      return;
    }
    try {
      await updateFlashcard(authToken, form.id, {
        question: form.question.trim(),
        answer: form.answer.trim(),
        hint: form.hint.trim(),
        difficulty: form.difficulty,
        tags: form.tags.split(",").map(t => t.trim()).filter(Boolean)
      });
      await loadCollection();
      resetForm();
      setShowModal(false);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      setError("Failed to update flashcard.");
    }
  }

  async function handleDelete(cardId) {
    if (window.confirm("Delete this flashcard?")) {
      try {
        await deleteFlashcard(authToken, cardId);
        await loadCollection();
      } catch (error) {
        console.error(error);
        alert("Failed to delete flashcard");
      }
    }
  }

  if (!user) return <div className="container mt-5">Please login to view this page.</div>;
  if (loading) return <div className="container mt-5">Loading collection...</div>;
  if (!collection) return <div className="container mt-5">Collection not found.</div>;

  return (
    <div className="container mt-5" style={{ maxWidth: "900px" }}>
      <button className="btn btn-link px-0 mb-3" onClick={() => navigate("/collections")}>
        ← Back to Collections
      </button>

      <h2>{collection.title}</h2>
      <p className="text-muted">{collection.description}</p>
      {collection.subject && <p><strong>Subject:</strong> {collection.subject}</p>}
      {collection.topics?.length > 0 && <p><strong>Topics:</strong> {collection.topics.join(", ")}</p>}

      {/* Study + Add Buttons */}
      <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
        <h4 className="mb-0">Flashcards</h4>
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-outline-warning"
            onClick={() =>
              navigate(`/collections/${collection.id || collection._id}/study`, {
                state: { collection, flashcards: collection.cards }
              })
            }
          >
            Study Mode
          </button>
          <button
            className="btn btn-sm btn-primary rounded"
            onClick={() => {
              resetForm();
              setIsEditing(false);
              setShowModal(true);
            }}
          >
            + Add Flashcard
          </button>
        </div>
      </div>

      {collection.cards?.length === 0 && (
        <p className="text-center text-muted">No flashcards yet. Add some above.</p>
      )}

      {/* Flashcards Grid */}
      <div className="row row-cols-1 row-cols-md-3 g-3">
        {collection.cards?.map(fc => (
          <div key={fc.id} className="col">
            <div className="card shadow-sm h-100 rounded">
              <div className="card-body d-flex flex-column justify-content-between">
                <div>
                  <h6>{fc.question}</h6>
                  <p className="text-muted">{fc.answer}</p>
                  {fc.hint && <small className="text-muted d-block">Hint: {fc.hint}</small>}
                  {fc.difficulty && <small className="text-muted d-block">Difficulty: {fc.difficulty}</small>}
                  {fc.tags?.length > 0 && <small className="text-muted d-block">Tags: {fc.tags.join(", ")}</small>}
                </div>
                <div className="mt-2">
                  <small className="text-muted">
                    Added {fc.createdAt ? new Date(fc.createdAt).toLocaleDateString() : ""}
                  </small>
                </div>
                <div className="d-flex justify-content-between mt-2">
                  <button className="btn btn-outline-primary btn-sm" onClick={() => startEdit(fc)}>Edit</button>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(fc.id)}>Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => { setShowModal(false); resetForm(); setIsEditing(false); }} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Edit Flashcard" : "Add New Flashcard"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="mb-3">
            <label className="form-label">Question</label>
            <input name="question" type="text" className="form-control" value={form.question} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="form-label">Answer</label>
            <textarea name="answer" rows="2" className="form-control" value={form.answer} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="form-label">Hint</label>
            <input name="hint" type="text" className="form-control" value={form.hint} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="form-label">Difficulty</label>
            <select name="difficulty" className="form-select" value={form.difficulty} onChange={handleChange}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Tags (comma separated)</label>
            <input name="tags" type="text" className="form-control" value={form.tags} onChange={handleChange} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          {isEditing ? (
            <>
              <Button variant="primary" onClick={handleSave}>Save</Button>
              <Button variant="secondary" onClick={() => { setShowModal(false); resetForm(); setIsEditing(false); }}>Cancel</Button>
            </>
          ) : (
            <Button variant="success" onClick={handleAdd}>Add</Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}
