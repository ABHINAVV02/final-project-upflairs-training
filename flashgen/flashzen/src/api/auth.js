const API_URL = "http://localhost:5000/api";

// Login: test credentials against a protected endpoint
export async function loginUser(email, password) {
  const token = btoa(`${email}:${password}`);
  const res = await fetch(`${API_URL}/collections`, {
    headers: { Authorization: `Basic ${token}` }
  });
  return { ok: res.ok, token };
}

// Register new user
export async function registerUser(name, email, password) {
  const res = await fetch(`${API_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  });
  return res.json();
}

// Get stats for logged user
export async function getUserStats(token) {
  const res = await fetch(`${API_URL}/user/stats`, {
    headers: { Authorization: `Basic ${token}` }
  });
  return res.json();
}

// Get all collections
export async function getUserCollections(token) {
  const res = await fetch(`${API_URL}/collections`, {
    headers: { Authorization: `Basic ${token}` }
  });
  return res.json();
}
//save public collections to user collection
export async function cloneCollection(token, collectionId) {
  const res = await fetch(`${API_URL}/collections/${collectionId}/clone`, {
    method: "POST",
    headers: { Authorization: `Basic ${token}` },
  });
  return res.json();
}



// Logout helper (frontend only)
export function logoutUser() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("authUser");
}
