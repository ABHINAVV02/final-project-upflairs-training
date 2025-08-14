const API_URL = "http://localhost:5000/api";


export async function getPublicCollections() {
  const res = await fetch(`${API_URL}/collections/public`);
  if (!res.ok) {
    throw new Error("Failed to fetch public collections");
  }
  return res.json();
}


export async function getPublicCollectionDetails(id) {
  const res = await fetch(`${API_URL}/collections/public/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch public collection details");
  }
  return res.json();
}


export async function getUserCollections(token) {
  const res = await fetch(`${API_URL}/collections`, {
    headers: { Authorization: `Basic ${token}` }
  });
  if (!res.ok) throw new Error("Failed to fetch collections");
  return res.json();
}


export async function getCollectionDetails(id, token) {
  const res = await fetch(`${API_URL}/collections/${id}`, {
    headers: { Authorization: `Basic ${token}` }
  });
  if (!res.ok) {
    throw new Error("Failed to fetch collection details");
  }
  return res.json();
}


export async function addCollection(token, data) {
  const res = await fetch(`${API_URL}/collections`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to add collection");
  return res.json();
}


export async function updateCollection(token, id, data) {
  const res = await fetch(`${API_URL}/collections/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Basic ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Failed to update collection");
  return res.json();
}


export async function deleteCollection(token, id) {
  const res = await fetch(`${API_URL}/collections/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Basic ${token}` }
  });
  if (!res.ok) throw new Error("Failed to delete collection");
  return res.json();
}
