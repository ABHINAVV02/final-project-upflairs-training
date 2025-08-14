import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await login(email, password);
    if (result.success) {
      navigate("/profile");
    } else {
      setError(result.message || "Login failed.");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="mb-4 text-center">Login to FlashLearn</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Email address</label>
          <input type="email" className="form-control" value={email}
                 onChange={(e) => setEmail(e.target.value)} autoFocus required />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" value={password}
                 onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button className="btn btn-primary w-100 mb-3" type="submit">Login</button>
      </form>
      <div className="text-center">
        <span className="text-muted">Don't have an account? </span>
        <Link to="/register">Sign Up</Link>
      </div>
    </div>
  );
}
