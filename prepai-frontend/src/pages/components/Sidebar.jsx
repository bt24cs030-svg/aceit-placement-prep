import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Mic, Code2, FileText, BarChart2, LogOut,Zap } from "lucide-react";

const navItems = [
  { name: "Dashboard", icon: <LayoutDashboard size={16} />, path: "/dashboard" },
  { name: "Mock Interviews", icon: <Mic size={16} />, path: "/mock-interview" },
  { name: "DSA Practice", icon: <Code2 size={16} />, path: "/dsa-practice" },
  { name: "Resume Analyzer", icon: <FileText size={16} />, path: "/resume-analyzer" },
  { name: "Analytics", icon: <BarChart2 size={16} />, path: "/analytics" },
];

export default function Sidebar({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="w-56 bg-gray-900 flex flex-col p-4 gap-1">
      <div className="text-green-400 font-bold text-xl mb-6 px-2 flex justify-start gap-2"><Zap color="#eab308" fill="#eab308" size={26} /> AceIt</div>
      {navItems.map((item) => (
        <button
          key={item.name}
          onClick={() => navigate(item.path)}
          className={`text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition
            ${location.pathname === item.path
              ? "bg-green-500 text-black font-semibold"
              : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
        >
          <span>{item.icon}</span>
          {item.name}
        </button>
      ))}
      <div className="mt-auto">
        <div className="text-xs text-gray-500 px-2 mb-2">{user}</div>
        <button
          onClick={onLogout}
          className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-gray-800 transition flex items-center gap-2"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
}