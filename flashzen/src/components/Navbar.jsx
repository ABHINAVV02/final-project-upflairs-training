import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../contexts/useTheme";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className={`navbar navbar-expand-lg position-sticky  ${theme === "dark" ? "navbar-dark bg-dark" : "navbar-light bg-light"} px-4 py-2 shadow-sm sticky-top`}>
      <div className="container-fluid">

        <NavLink className="navbar-brand fw-bold" to="/">Flash<span className="text-info">Learn</span> </NavLink>

        <button className="navbar-toggler" type="button" onClick={() => setOpen(false)}>
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto align-items-center gap-lg-2">
          <li className="nav-item ms-lg-3">
              <button onClick={toggleTheme} className="btn btn-sm" title="Toggle Theme">
                {theme === "light" ? (
                  <span className="lnr lnr-moon"></span>
                ) : (
                  <span className="lnr lnr-sun"></span>
                )}
              </button>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/" end>Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/explore">Explore</NavLink>
            </li>
            {user && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/collections">Collections</NavLink>
              </li>
            )}

            

            {user ? (
              <li className="nav-item dropdown ms-lg-3" ref={dropdownRef}>
                <button
                  className="btn btn-info btn-sm dropdown-toggle rounded-pill d-flex align-items-center"
                  id="profileDropdown"
                  onClick={() => setOpen(!open)}
                  aria-expanded={open}
                  aria-haspopup="true"
                >
                  <i className="bi bi-person-circle me-2"></i>
                  <span>{user.username || user.name || user.email?.split("@")[0]}</span>
                </button>
                <ul className={`dropdown-menu dropdown-menu-end${open ? " show" : ""}`} aria-labelledby="profileDropdown" style={{ minWidth: "10rem" }}>
                  <li>
                    <NavLink className="dropdown-item" to="/profile" onClick={() => setOpen(false)}>Profile</NavLink>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={() => { logout(); setOpen(false); }}>
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item ms-lg-3">
                  <NavLink className="nav-link" to="/login">Login</NavLink>
                </li>
                <li className="nav-item ms-lg-2">
                  <NavLink className="btn btn-primary btn-sm" to="/register">Sign Up</NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
