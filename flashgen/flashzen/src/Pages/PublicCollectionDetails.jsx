import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getPublicCollectionDetails, getUserCollections, addCollection } from "../api/collections";
import { addFlashcard } from "../api/flashcards";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function PublicCollectionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authToken, user } = useAuth();

  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);


  const [bookmarkCollectionId, setBookmarkCollectionId] = useState(null);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());


  useEffect(() => {
    getPublicCollectionDetails(id)
      .then(data => {
        setCollection(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching collection:", err);
        setLoading(false);
      });
  }, [id]);


  useEffect(() => {
    async function initBookmarkCollection() {
      if (!authToken) return;
      const allCols = await getUserCollections(authToken);
      let bookmarkCol = allCols.find(c => c.title === "Bookmarked Flashcards");
      if (!bookmarkCol) {
        bookmarkCol = await addCollection(authToken, {
          title: "Bookmarked Flashcards",
          description: "My saved/bookmarked cards",
          subject: "",
          topics: []
        });
      }
      setBookmarkCollectionId(bookmarkCol.id || bookmarkCol._id);
    }
    initBookmarkCollection();
  }, [authToken]);

  function isBookmarked(card) {
    return bookmarkedIds.has(card.question + card.answer);
  }

  async function handleBookmark(card) {
    if (!authToken || !bookmarkCollectionId) return;
    if (isBookmarked(card)) return;
    try {
      await addFlashcard(authToken, bookmarkCollectionId, {
        question: card.question,
        answer: card.answer,
        hint: card.hint,
        difficulty: card.difficulty || "easy",
        tags: card.tags,
        createdAt: Date.now()
      });
      setBookmarkedIds(prev => new Set([...prev, card.question + card.answer]));
    } catch (err) {
      alert("Failed to save to bookmarks");
    }
  }

  if (loading) return <div className="container mt-5">Loading collection...</div>;
  if (!collection) return <div className="container mt-5">Collection not found.</div>;

  return (
    <div className="container mt-5">
 
      <button
        className="btn btn-link px-0 mb-3"
        onClick={() => navigate("/explore")}
      >
        ← Back to Explore
      </button>


      <h2>{collection.title}</h2>
      <p className="text-muted">{collection.description}</p>
      {collection.subject && <p><strong>Subject:</strong> {collection.subject}</p>}
      {collection.topics?.length > 0 && (
        <p><strong>Topics:</strong> {collection.topics.join(", ")}</p>
      )}


      <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
        <h4 className="mb-0">Flashcards</h4>
        <Link
            to={`/explore/${collection._id || collection.id}/study`}
           state={{ collection, flashcards: collection.cards, readOnly: true }}
           className="btn btn-sm btn-outline-warning"
        >
  📖 Study Mode
</Link>

      </div>

      <div className="row g-3">
        {collection.cards && collection.cards.length > 0 ? (
          collection.cards.map(fc => (
            <div key={fc._id || fc.id} className="col-md-4">
              <div className="card shadow-sm h-100">
                <div className="card-body d-flex flex-column justify-content-between">
                  <div><h6>{fc.question}</h6><p className="text-muted">{fc.answer}</p></div>

                  {user && (
                    <div className="mt-2 d-flex justify-content-end">
                      <button
                        className="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: "32px",
                          height: "32px",
                          color: isBookmarked(fc) ? "#0d6efd" : ""
                        }}
                        title={isBookmarked(fc) ? "Bookmarked" : "Save to Bookmarked"}
                        onClick={() => handleBookmark(fc)}
                      >
                        <i className={isBookmarked(fc) ? "bi bi-bookmark-fill" : "bi bi-bookmark"}></i>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No flashcards found.</p>
        )}
      </div>
    </div>
  );
}
