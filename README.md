# Flashcard Manager

Flashcard Manager is a full-stack MERN web application for creating, organizing, and studying digital flashcards.  
Designed to enhance learning and retention, it offers interactive study features, user authentication, and a simple interface.

> **Note:** In its current version, the backend uses local JSON files for data persistence instead of a full database.

---

## Features

- **User Authentication:** Secure registration and login.
- **Collections:** Organize flashcards by subject or topic.
- **Flashcard Management:** Add, edit, and delete flashcards within collections.
- **Study Mode:** Review flashcards interactively to reinforce knowledge.
- **Public Collections:** Browse, search, and clone public decks to your personal library.
- **User Profile:** Access personal statistics such as the number of collections and flashcards.

---

## Technology Stack

- **Frontend:** React, React Router DOM, Bootstrap
- **Backend:** Node.js, Express.js
- **Data Storage:** Local JSON files (`collections.js`, `flashcards.js`, `users.js`)

---

## Getting Started

To set up and run the project locally:

### Backend Setup

1. Navigate to the backend directory:

   ```
   cd backend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start the backend server in development mode:
   ```
   npm run dev
   ```
   This will use **nodemon** (or your configured dev script) to automatically restart the server when code changes are detected.

---

### Frontend Setup

1. Open a new terminal window/tab and navigate to the frontend directory:

   ```
   cd flashzen
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start the frontend development server:
   ```
   npm run dev
   ```

The application will be accessible in your browser at:  
[http://localhost:3000](http://localhost:3000)

---

### Backend Setup

1. Open a new terminal window/tab and navigate to the frontend directory:

   ```
   cd Backend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start the frontend development server:
   ```
   npm run dev
   ```

---

## Notes

- Since the backend uses **local JSON files**, changes to flashcards or collections are stored locally.  
  This is suitable for development and prototyping.
- For production use, consider switching to a database (like MongoDB) for scalability and data integrity.

---

## Acknowledgments

- Built using the **MERN stack** (MongoDB, Express.js, React, Node.js)
- Frontend styling powered by [Bootstrap](https://getbootstrap.com/)
