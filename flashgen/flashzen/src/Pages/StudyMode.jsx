import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getCollectionDetails, getPublicCollectionDetails } from "../api/collections";

export default function StudyMode({ readOnly = false }) {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { authToken } = useAuth();


  const stateCollection = location.state?.collection;
  const stateCards = location.state?.flashcards;

  const [collection, setCollection] = useState(stateCollection || null);
  const [cards, setCards] = useState(stateCards || []);
  const [loading, setLoading] = useState(!stateCollection || !stateCards);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);


  useEffect(() => {
    async function loadData() {
      try {
        if (!collection || cards.length === 0) {
          let data;
          if (readOnly) {
            data = await getPublicCollectionDetails(id);
          } else {
            data = await getCollectionDetails(id, authToken);
          }
          setCollection(data);
          setCards(data.cards || []);
        }
      } catch (err) {
        console.error("Error loading collection for study:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id, authToken, readOnly]);


  useEffect(() => {
    setIndex(0);
    setShowAnswer(false);
  }, [cards]);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <h4>Loading flashcards...</h4>
      </div>
    );
  }

  if (!collection || cards.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <h2>No flashcards found</h2>
        <button
          className="btn btn-secondary mt-3"
          onClick={() => navigate(readOnly ? "/explore" : "/collections")}
        >
          Back
        </button>
      </div>
    );
  }

  const card = cards[index];
  const flipCard = () => setShowAnswer(!showAnswer);
  const nextCard = () => {
    setIndex((prev) => (prev + 1) % cards.length);
    setShowAnswer(false);
  };
  const prevCard = () => {
    setIndex((prev) => (prev - 1 + cards.length) % cards.length);
    setShowAnswer(false);
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h4 className="text-center mb-4">
        {collection.title} — {index + 1} / {cards.length}
      </h4>

      <div
        className="card text-center p-5 shadow-sm"
        style={{ cursor: "pointer" }}
        onClick={flipCard}
      >
        <h5>{showAnswer ? card.answer : card.question}</h5>
      </div>

      <div className="d-flex justify-content-between mt-3">
        <button className="btn btn-outline-secondary btn-sm" onClick={prevCard}>
          Previous
        </button>
        <button className="btn btn-outline-primary btn-sm" onClick={flipCard}>
          {showAnswer ? "Show Question" : "Show Answer"}
        </button>
        <button className="btn btn-outline-secondary btn-sm" onClick={nextCard}>
          Next
        </button>
      </div>

      <div className="text-center mt-3">
        <button
          className="btn btn-secondary"
          onClick={() => navigate(readOnly ? "/explore" : "/collections")}
        >
          Exit Study Mode
        </button>
      </div>
    </div>
  );
}
