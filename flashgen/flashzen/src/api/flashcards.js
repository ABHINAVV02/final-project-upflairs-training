const API_URL = "http://localhost:5000/api";

// Add a flashcard to a collection
export async function addFlashcard(token, collectionId, flashcardData) {
  const res = await fetch(`${API_URL}/collections/${collectionId}/cards`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(flashcardData),
  });
  if (!res.ok) throw new Error('Failed to add flashcard');
  return res.json();
}

// Update a flashcard
export async function updateFlashcard(token, cardId, updatedData) {
  const res = await fetch(`${API_URL}/cards/${cardId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Basic ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData),
  });
  if (!res.ok) throw new Error('Failed to update flashcard');
  return res.json();
}

// Delete a flashcard
export async function deleteFlashcard(token, cardId) {
  const res = await fetch(`${API_URL}/cards/${cardId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Basic ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to delete flashcard');
  return res.json();
}
