
import { useState, useEffect } from "react";

const statusColors = {
  "Done": "bg-green-500/20 text-green-400 border border-green-500/30",
  "In Progress": "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  "Not Started": "bg-gray-700 text-gray-400 border border-gray-600",
};

const progressColors = {
  "Done": "bg-green-400",
  "In Progress": "bg-yellow-400",
  "Not Started": "bg-gray-600",
};

export default function DSAPractice({ topics, setTopics }) {
  const [filter, setFilter] = useState("All");
  const [saved, setSaved] = useState(false);

  // Save to database
  const saveProgress = async () => {
    await fetch("http://localhost:4000/dsa-progress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ topics }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const totalSolved = topics.reduce((acc, t) => acc + t.solved, 0);
  const totalProblems = topics.reduce((acc, t) => acc + t.total, 0);
  const doneCount = topics.filter((t) => t.status === "Done").length;

  const updateSolved = (id, value) => {
    setTopics((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const solved = Math.min(Math.max(0, Number(value)), t.total);
        const status =
          solved === 0 ? "Not Started" : solved === t.total ? "Done" : "In Progress";
        return { ...t, solved, status };
      })
    );
  };

  const filtered = filter === "All" ? topics : topics.filter((t) => t.status === filter);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-1">
        <h1 className="text-2xl font-bold">💻 DSA Practice</h1>
        <button
          onClick={saveProgress}
          className="bg-green-500 hover:bg-green-400 text-black font-bold px-4 py-2 rounded-lg text-sm transition"
        >
          {saved ? "Saved!" : "Save Progress"}
        </button>
      </div>
      <p className="text-gray-400 text-sm mb-6">Track your DSA progress topic by topic</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-900 rounded-xl p-4">
          <div className="text-gray-400 text-sm">Total Solved</div>
          <div className="text-3xl font-bold mt-1">{totalSolved}</div>
          <div className="text-gray-500 text-xs mt-1">out of {totalProblems}</div>
        </div>
        <div className="bg-gray-900 rounded-xl p-4">
          <div className="text-gray-400 text-sm">Topics Completed</div>
          <div className="text-3xl font-bold mt-1 text-green-400">{doneCount}</div>
          <div className="text-gray-500 text-xs mt-1">out of {topics.length}</div>
        </div>
        <div className="bg-gray-900 rounded-xl p-4">
          <div className="text-gray-400 text-sm">Overall Progress</div>
          <div className="text-3xl font-bold mt-1">
            {Math.round((totalSolved / totalProblems) * 100)}%
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1.5 mt-2">
            <div
              className="bg-green-400 h-1.5 rounded-full"
              style={{ width: `${(totalSolved / totalProblems) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4">
        {["All", "Not Started", "In Progress", "Done"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-lg text-sm transition ${filter === f
              ? "bg-green-500 text-black font-medium"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Topics List */}
      <div className="flex flex-col gap-3">
        {filtered.map((topic) => (
          <div key={topic.id} className="bg-gray-900 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium">{topic.name}</div>
              <span className={`text-xs px-2 py-1 rounded-full ${statusColors[topic.status]}`}>
                {topic.status}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-800 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${progressColors[topic.status]}`}
                  style={{ width: `${(topic.solved / topic.total) * 100}%` }}
                />
              </div>
              <div className="flex items-center gap-1 text-sm">
                <input
                  type="number"
                  value={topic.solved}
                  onChange={(e) => updateSolved(topic.id, e.target.value)}
                  className="w-12 bg-gray-800 text-white text-center rounded px-1 py-0.5 text-sm"
                />
                <span className="text-gray-500">/ {topic.total}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}