const API_URL = "http://localhost:5000/api";


export async function loginUser(email, password) {
  const token = btoa(`${email}:${password}`);
  const res = await fetch(`${API_URL}/collections`, {
    headers: { Authorization: `Basic ${token}` }
  });
  return { ok: res.ok, token };
}


export async function registerUser(name, email, password) {
  const res = await fetch(`${API_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  });
  return res.json();
}


export async function getUserStats(token) {
  const res = await fetch(`${API_URL}/user/stats`, {
    headers: { Authorization: `Basic ${token}` }
  });
  return res.json();
}


export async function getUserCollections(token) {
  const res = await fetch(`${API_URL}/collections`, {
    headers: { Authorization: `Basic ${token}` }
  });
  return res.json();
}


export async function cloneCollection(token, collectionId) {
  const res = await fetch(`${API_URL}/collections/${collectionId}/clone`, {
    method: "POST",
    headers: { Authorization: `Basic ${token}` },
  });
  return res.json();
}




export function logoutUser() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("authUser");
}
