import { useEffect, useState } from "react";
import { getPublicCollections } from "../api/collections";
import { cloneCollection } from "../api/auth";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; 

export default function Explore() {
  const [groups, setGroups] = useState({});
  const [loading, setLoading] = useState(true);
  const { authToken } = useAuth();
  const [saving, setSaving] = useState({}); 

  useEffect(() => {
    getPublicCollections().then(data => {
      const grouped = data.reduce((acc, col) => {
        const subject = col.subject || "Uncategorized";
        if (!acc[subject]) acc[subject] = [];
        acc[subject].push(col);
        return acc;
      }, {});
      setGroups(grouped);
      setLoading(false);
    });
  }, []);

  const handleClone = async (colId) => {
    if (!authToken) {
      alert("Please login to save collections.");
      return;
    }
    try {
      setSaving(prev => ({ ...prev, [colId]: true }));
      const result = await cloneCollection(authToken, colId);
      if (result.success) {
        alert("Collection saved to your list!");
      } else {
        alert(result.message || "Failed to save collection.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving collection.");
    } finally {
      setSaving(prev => ({ ...prev, [colId]: false }));
    }
  };

  if (loading) return <div className="container mt-5">Loading public collections...</div>;

  return (
    <div className="container mt-4">
      {Object.entries(groups).map(([subject, cols]) => (
        <section key={subject} className="mb-5">
          <h4>{subject}</h4>
          <div className="row g-3">
            {cols.map(col => (
              <div key={col.id || col._id} className="col-md-4">
                <div className="card shadow-sm h-100">
                  <div className="card-body d-flex flex-column">
                    <h5>{col.title}</h5>
                    <p className="text-muted">{col.description}</p>
                    
                    <div className="mt-auto d-flex gap-2">
                      {/* View Button */}
                      <Link
                        to={`/explore/${col.id || col._id}`}
                        className="btn btn-outline-primary btn-sm flex-fill"
                        title="View"
                      >
                        <span className="lnr lnr-eye"></span>
                      </Link>

                      {/* Save/Clone Button */}
                      <button
                        className="btn btn-outline-warning btn-sm flex-fill"
                        title="Save to My Collections"
                        onClick={() => handleClone(col.id || col._id)}
                        disabled={saving[col.id || col._id]}
                      >
                        {saving[col.id || col._id]
                          ? <span className="spinner-border spinner-border-sm"></span>
                          : <span className="lnr lnr-bookmark"></span>}
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
