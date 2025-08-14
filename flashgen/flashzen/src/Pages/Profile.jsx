import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getUserStats } from "../api/auth";

export default function Profile() {
  const { user, authToken, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authToken) return;
    getUserStats(authToken)
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [authToken]);

  if (!user) {
    return (
      <div className="container mt-5 text-center">
        <h3>Please login to view your profile.</h3>
        <Link to="/login" className="btn btn-primary mt-3">
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="container my-5" style={{ maxWidth: "900px" }}>
      {/* Profile Header: image left, info right */}
      <div
        className="card shadow-sm p-4 mb-4 rounded d-flex align-items-center"
        style={{
          flexDirection: "row",
          gap: "1.5rem",
          borderLeft: "5px solid #0d6efd",
        }}
      >
        <img
          src="https://static.vecteezy.com/system/resources/thumbnails/001/840/612/small/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-free-vector.jpg"
          alt="Avatar"
          className="rounded-circle border object-fit-cover"
          style={{ width: "85px", height: "85px" }}
        />
        <div className="d-flex flex-column">
          <h3 className="mb-1">{user.name}</h3>
          <p className="text-muted mb-1">{user.email}</p>
          <p className="small text-secondary mb-0">Member since: Jan 2025</p>
          <button
            onClick={logout}
            className="btn btn-outline-danger btn-sm mt-2"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Stats (all 4 cards) */}
      <h5 className="mb-3 mt-4 fw-bold">Your Stats</h5>
      {loading ? (
        <p>Loading stats...</p>
      ) : stats ? (
        <div className="row text-center g-3 mb-4">
          <div className="col-md-3 col-6">
            <div className="card shadow-sm p-3 h-100">
              <h4 className="mb-0 fw-bold">{stats.totalCollections ?? 0}</h4>
              <p className="text-muted mb-0">Collections</p>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card shadow-sm p-3 h-100">
              <h4 className="mb-0 fw-bold">{stats.totalFlashcards ?? 0}</h4>
              <p className="text-muted mb-0">Flashcards</p>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card shadow-sm p-3 h-100">
              <h4 className="mb-0 fw-bold">{stats.studySessions ?? 0}</h4>
              <p className="text-muted mb-0">Study Sessions</p>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card shadow-sm p-3 h-100">
              <h4 className="mb-0 fw-bold">{stats.publicCollections ?? 0}</h4>
              <p className="text-muted mb-0">Public Shared</p>
            </div>
          </div>
        </div>
      ) : (
        <p>No stats available yet.</p>
      )}

      {/* Quick Actions */}
      <h5 className="mb-3 mt-4 fw-bold">Quick Actions</h5>
      <div className="list-group rounded shadow-sm">
        <Link
          to="/collections"
          className="list-group-item list-group-item-action"
        >
          📂 My Collections
        </Link>
        <Link
          to="/explore"
          className="list-group-item list-group-item-action"
        >
          🌎 Explore Public Collections
        </Link>
        <Link
          to="/collections/new"
          className="list-group-item list-group-item-action"
        >
          ➕ Create New Collection
        </Link>
      </div>
    </div>
  );
}
