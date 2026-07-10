
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth";
import Layout from "./pages/components/Layout";
import Sidebar from "./pages/components/Sidebar";
import { initialTopics } from "./data/topics";
import { API_URL } from "./config";

export default function App() {
  const [user, setUser] = useState(localStorage.getItem("userName"));
  const [topics, setTopics] = useState(initialTopics);

  useEffect(() => {
    if (!user) return;
    fetch(`${API_URL}/dsa-progress`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          const merged = initialTopics.map((t) => {
            const found = data.find((d) => d.topicId === t.id);
            return found ? { ...t, solved: found.solved, status: found.status } : t;
          });
          setTopics(merged);
        }
      })
      .catch(() => {});
  }, [user]);

  const handleLogout=() => { setUser(null); setTopics(initialTopics); }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" /> : <Auth onLogin={(name) => setUser(name)} />}
        />
        <Route
          path="/*"
          element={
            user ? (
              <Layout
                user={user}
                topics={topics}
                setTopics={setTopics}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
