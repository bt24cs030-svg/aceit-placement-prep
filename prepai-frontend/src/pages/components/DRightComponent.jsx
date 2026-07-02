import { useNavigate } from "react-router-dom";
import { Target, AlertTriangle, Zap, ArrowRight } from "lucide-react";
import { useState } from "react";

export const DRightComponent = ({ topics }) => {
  const navigate = useNavigate();
  const [goal, setGoal] = useState(5);
  const [todaySolved, setTodaySolved] = useState(0);
  const [challenge, setChallenge] = useState(null);
  const [loadingChallenge, setLoadingChallenge] = useState(false);

  const weakTopics = topics.filter((t) => t.solved / t.total < 0.5);

  const getDailyChallenge = async () => {
    setLoadingChallenge(true);
    try {
      const res = await fetch("http://localhost:4000/daily-challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setChallenge(data);
    } catch {
      setChallenge(null);
    }
    setLoadingChallenge(false);
  };
  return (
    <div className="flex flex-col gap-4">

      <div className="bg-gray-900 rounded-xl p-4">
        <div className="font-semibold flex items-center gap-2 mb-3">
          <Target size={16} className="text-green-400" />
          Today's Goal
        </div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm text-gray-400">Daily target:</span>
          <input
            type="number"
            value={goal}
            onChange={(e) => setGoal(Number(e.target.value))}
            className="w-12 bg-gray-800 text-white text-center rounded px-2 py-1 text-sm"
          />
          <span className="text-sm text-gray-400">problems</span>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm text-gray-400">Solved today:</span>
          <input
            type="number"
            value={todaySolved}
            onChange={(e) => setTodaySolved(Number(e.target.value))}
            className="w-12 bg-gray-800 text-white text-center rounded px-2 py-1 text-sm"
          />
        </div>
        <div className="bg-gray-800 rounded-full h-2 mb-2">
          <div
            className="bg-green-400 h-2 rounded-full transition-all"
            style={{ width: `${Math.min((todaySolved / goal) * 100, 100)}%` }}
          />
        </div>
        <div className="text-xs text-gray-400 text-right">
          {todaySolved}/{goal} — {todaySolved >= goal ? " Goal Complete!" : `${goal - todaySolved} remaining`}
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl p-4">
        <div className="font-semibold flex items-center gap-2 mb-3">
          <AlertTriangle size={16} className="text-yellow-400" />
          Weak Topics
        </div>
        {weakTopics.length === 0 ? (
          <div className="text-green-400 text-sm"> No weak topics!</div>
        ) : (
          weakTopics.slice(0, 4).map((t) => (
            <div key={t.id} className="mb-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-300">{t.name}</span>
                <span className="text-red-400">{Math.round((t.solved / t.total) * 100)}%</span>
              </div>
              <div className="bg-gray-800 rounded-full h-1.5">
                <div
                  className="bg-red-400 h-1.5 rounded-full"
                  style={{ width: `${(t.solved / t.total) * 100}%` }}
                />
              </div>
            </div>
          ))
        )}
        <button
          onClick={() => navigate("/dsa-practice")}
          className="w-full mt-2 bg-gray-800 hover:bg-gray-700 text-white py-1.5 rounded-lg text-xs transition flex gap-2 justify-center"
        >
          Practice Now  <ArrowRight color="gray" size={16} />
        </button>
      </div>
      <div className="bg-gray-900 rounded-xl p-4">
        <div className="font-semibold flex items-center gap-2 mb-3">
          <Zap size={16} className="text-yellow-400" />
          Daily Challenge
        </div>
        {challenge ? (
          <div className="mb-3">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm font-medium text-white">{challenge.title}</div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${challenge.difficulty === "Easy" ? "bg-green-500/20 text-green-400" :
                  challenge.difficulty === "Medium" ? "bg-yellow-500/20 text-yellow-400" :
                    "bg-red-500/20 text-red-400"
                }`}>{challenge.difficulty}</span>
            </div>
            <div className="text-gray-300 text-xs leading-relaxed mb-2">{challenge.description}</div>
            <div className="bg-gray-800 rounded px-3 py-2 text-xs text-gray-400">{challenge.example}</div>
          </div>
        ) : (
          <div className="text-gray-500 text-sm mb-3">Click to get today's challenge!</div>
        )}
        <button
          onClick={getDailyChallenge}
          disabled={loadingChallenge}
          className="w-full bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 text-yellow-400 font-medium py-2 rounded-lg text-sm transition disabled:opacity-50"
        >
          {loadingChallenge ? "Loading..." : challenge ? "New Challenge ↺" : "Get Challenge ⚡"}
        </button>
      </div>

    </div>
  );
};