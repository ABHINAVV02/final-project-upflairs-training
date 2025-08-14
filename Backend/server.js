require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const basicAuth = require("./middleware/basicAuth");


const dataDir = path.join(__dirname, "data");
const collectionsFile = path.join(dataDir, "collections.json");
const flashcardsFile = path.join(dataDir, "flashcards.json");
const usersFile = path.join(dataDir, "users.json");

let collections = require(collectionsFile);
let flashcards = require(flashcardsFile);
let users = require(usersFile);

const saveCollections = () => fs.writeFileSync(collectionsFile, JSON.stringify(collections, null, 2));
const saveFlashcards = () => fs.writeFileSync(flashcardsFile, JSON.stringify(flashcards, null, 2));
const saveUsers = () => fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

const app = express();
app.use(cors());
app.use(express.json());


app.post("/api/users/register", (req, res) => {
  const { name, email, password } = req.body;
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: "User already exists" });
  }
  const newUser = { id: Date.now().toString(), name, email, password };
  users.push(newUser);
  saveUsers();
  res.status(201).json({ message: "User registered", user: { name, email } });
});


app.get("/api/collections/public", (req, res) => {
  res.json(collections);
});

app.get("/api/collections", basicAuth, (req, res) => {
  const filtered = collections.filter(c => c.userId === req.user.id || req.user.id === "env-admin");
  res.json(filtered);
});

app.get("/api/collections/public/:id", (req, res) => {
  const collection = collections.find(c => c.id === req.params.id);
  if (!collection) return res.status(404).json({ message: "Not found" });
  const cards = flashcards.filter(fc => fc.collectionId === req.params.id);
  res.json({ ...collection, cards });
});

app.get("/api/collections/:id", basicAuth, (req, res) => {
  const collection = collections.find(
    c => c.id === req.params.id && (c.userId === req.user.id || req.user.id === "env-admin")
  );
  if (!collection) return res.status(404).json({ message: "Not found" });
  const cards = flashcards.filter(fc => fc.collectionId === req.params.id);
  res.json({ ...collection, cards });
});

app.post("/api/collections", basicAuth, (req, res) => {
  const { title, description, subject, topics = [] } = req.body;
  const newCollection = {
    id: Date.now().toString(),
    title,
    description,
    subject,
    topics,
    userId: req.user.id
  };
  collections.push(newCollection);
  saveCollections();
  res.status(201).json(newCollection);
});

app.put("/api/collections/:id", basicAuth, (req, res) => {
  const idx = collections.findIndex(
    c => c.id === req.params.id && (c.userId === req.user.id || req.user.id === "env-admin")
  );
  if (idx === -1) return res.status(404).json({ message: "Not found" });
  collections[idx] = { ...collections[idx], ...req.body };
  saveCollections();
  res.json(collections[idx]);
});

app.delete("/api/collections/:id", basicAuth, (req, res) => {
  const before = collections.length;
  collections = collections.filter(
    c => !(c.id === req.params.id && (c.userId === req.user.id || req.user.id === "env-admin"))
  );
  if (collections.length === before) return res.status(404).json({ message: "Not found" });
  saveCollections();
  flashcards = flashcards.filter(f => f.collectionId !== req.params.id);
  saveFlashcards();
  res.json({ message: "Collection deleted" });
});


app.get("/api/collections/:id/cards", (req, res) => {
  const list = flashcards.filter(fc => fc.collectionId === req.params.id);
  res.json(list);
});

app.post("/api/collections/:id/cards", basicAuth, (req, res) => {
  const { question, answer } = req.body;
  const newCard = {
    id: "c" + Date.now(),
    collectionId: req.params.id,
    question,
    answer
  };
  flashcards.push(newCard);
  saveFlashcards();
  res.status(201).json(newCard);
});

app.put("/api/cards/:cardId", basicAuth, (req, res) => {
  const idx = flashcards.findIndex(fc => fc.id === req.params.cardId);
  if (idx === -1) return res.status(404).json({ message: "Not found" });
  flashcards[idx] = { ...flashcards[idx], ...req.body };
  saveFlashcards();
  res.json(flashcards[idx]);
});

app.delete("/api/cards/:cardId", basicAuth, (req, res) => {
  const before = flashcards.length;
  flashcards = flashcards.filter(fc => fc.id !== req.params.cardId);
  if (flashcards.length === before) return res.status(404).json({ message: "Not found" });
  saveFlashcards();
  res.json({ message: "Flashcard deleted" });
});


app.get("/api/user/stats", basicAuth, (req, res) => {
  try {
    const userId = req.user.id;
    const userCollections = collections.filter(
      c => c.userId === userId || userId === "env-admin"
    );
    const totalCollections = userCollections.length;
    const totalFlashcards = flashcards.filter(fc =>
      userCollections.some(c => c.id === fc.collectionId)
    ).length;
    const studySessions = 0; 
    const publicCollections = userCollections.filter(c => c.isPublic).length;

    res.json({ totalCollections, totalFlashcards, studySessions, publicCollections });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
