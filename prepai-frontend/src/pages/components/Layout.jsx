import { useNavigate, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Dashboard from "../Dashboard";
import MockInterview from "../MockInterview";
import DSAPractice from "../DSAPractice";
import ResumeAnalyzer from "../ResumeAnalyzer";
import Analytics from "../Analytics";

export default function Layout({ user, topics, setTopics, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    onLogout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-950 text-white">
      <Sidebar user={user} onLogout={handleLogout} />
      <div className="flex-1 overflow-auto">
        <Routes>
          <Route path="/dashboard" element={<Dashboard user={user} topics={topics} />} />
          <Route path="/mock-interview" element={<MockInterview />} />
          <Route path="/dsa-practice" element={<DSAPractice topics={topics} setTopics={setTopics} />} />
          <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
          <Route path="/analytics" element={<Analytics topics={topics} />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </div>
  );
}