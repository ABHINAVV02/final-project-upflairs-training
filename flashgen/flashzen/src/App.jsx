import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Collections from "./pages/Collections";
import CollectionDetails from "./pages/CollectionDetails";
import PublicCollectionDetails from "./pages/PublicCollectionDetails";
import StudyMode from "./pages/StudyMode";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";

import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/explore/:id" element={<PublicCollectionDetails />} />
        <Route path="/explore/:id/study" element={<StudyMode readOnly />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/profile"
          element={<PrivateRoute><Profile /></PrivateRoute>}
        />
        <Route
          path="/collections"
          element={<PrivateRoute><Collections /></PrivateRoute>}
        />
        <Route
          path="/collections/:id"
          element={<PrivateRoute><CollectionDetails /></PrivateRoute>}
        />
        <Route
          path="/collections/:id/study"
          element={<PrivateRoute><StudyMode /></PrivateRoute>}
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </>
  );
}
