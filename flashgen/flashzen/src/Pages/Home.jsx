import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="container py-5">

      <section className="mb-5 d-flex justify-content-center">
        <div className="text-center" style={{ maxWidth: 600 }}>
          <h1 className="fw-bold mb-3 display-4 text-info">FlashLearn</h1>
          <p className="lead text-muted mb-4">
            Smart flashcards for faster, better learning — create your own or browse public decks.
          </p>

          <div className="d-flex justify-content-center gap-3 flex-wrap">
            {!user ? (
              <>
                <Link className="btn btn-primary btn-lg px-4" to="/register">
                  🚀 Sign Up
                </Link>
                <Link className="btn btn-outline-secondary btn-lg px-4" to="/explore">
                  🔍 Explore Collections
                </Link>
              </>
            ) : (
              <>
                <Link className="btn btn-success btn-lg px-4" to="/collections">
                  Go to library
                </Link>
                <Link className="btn btn-outline-secondary btn-lg px-4" to="/explore">
                  🔍 Explore Public
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="py-4">
        <h2 className="fw-bold text-center mb-5">Features</h2>
        <div className="row g-4 justify-content-center">

          <div className="col-md-4">
            <div className="card h-100 text-center shadow-sm border-0">
              <div className="card-body d-flex flex-column align-items-center">
                <span
                  className="mb-3 d-inline-flex justify-content-center align-items-center rounded-circle bg-primary bg-opacity-15"
                  style={{ width: 64, height: 64 }}
                >
                  <i className="bi bi-pencil-square fs-2 text-primary"></i>
                </span>
                <h5 className="card-title fw-semibold mt-3">Create &amp; Organize</h5>
                <p className="card-text text-muted mt-2 small">
                  Build collections tailored to your subjects with intuitive add, edit, and delete features.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 text-center shadow-sm border-0">
              <div className="card-body d-flex flex-column align-items-center">
                <span
                  className="mb-3 d-inline-flex justify-content-center align-items-center rounded-circle bg-success bg-opacity-15"
                  style={{ width: 64, height: 64 }}
                >
                  <i className="bi bi-laptop fs-2 text-success"></i>
                </span>
                <h5 className="card-title fw-semibold mt-3">Study Anywhere</h5>
                <p className="card-text text-muted mt-2 small">
                  Access flashcards across devices. Quiz mode helps reinforce memory and track your improvement.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 text-center shadow-sm border-0">
              <div className="card-body d-flex flex-column align-items-center">
                <span
                  className="mb-3 d-inline-flex justify-content-center align-items-center rounded-circle bg-warning bg-opacity-15"
                  style={{ width: 64, height: 64 }}
                >
                  <i className="bi bi-graph-up fs-2 text-warning"></i>
                </span>
                <h5 className="card-title fw-semibold mt-3">Progress Tracking</h5>
                <p className="card-text text-muted mt-2 small">
                  Track how many collections and cards you’ve made. Monitor streaks and progress effortlessly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
