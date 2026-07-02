import { useState } from "react";

export default function Analytics({ topics }) {
  const [activeTab, setActiveTab] = useState("topics");
  const totalSolved = topics.reduce((acc, t) => acc + t.solved, 0);
  const totalProblems = topics.reduce((acc, t) => acc + t.total, 0);
  const doneCount = topics.filter((t) => t.status === "Done").length;
  const inProgressCount = topics.filter((t) => t.status === "In Progress").length;
  const notStartedCount = topics.filter((t) => t.status === "Not Started").length;
  const progress = totalProblems > 0 ? Math.round((totalSolved / totalProblems) * 100) : 0;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">📊 Analytics</h1>
      <p className="text-gray-400 text-sm mb-6">Track your overall preparation progress</p>

      {/* Top Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Solved", value: totalSolved, sub: `out of ${totalProblems}`, color: "text-green-400" },
          { label: "Topics Done", value: `${doneCount}/${topics.length}`, sub: `In Progress: ${inProgressCount}`, color: "text-purple-400" },
          { label: "Overall Progress", value: `${progress}%`, sub: `${notStartedCount} topics not started`, color: "text-blue-400" },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="bg-gray-900 rounded-xl p-4">
            <div className="text-gray-400 text-sm">{label}</div>
            <div className={`text-2xl font-bold mt-1 ${color}`}>{value}</div>
            <div className="text-gray-500 text-xs mt-1">{sub}</div>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-900 rounded-xl p-4 mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-semibold">Overall Progress</span>
          <span className="text-green-400">{progress}%</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-3">
          <div
            className="bg-green-400 h-3 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Topic Progress */}
      <div className="bg-gray-900 rounded-xl p-4 mb-4">
        <div className="font-semibold mb-4">Topic Progress</div>
        <div className="flex flex-col gap-3">
          {topics.map(({ id, name, solved, total, status }) => (
            <div key={id}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-300">{name}</span>
                <span className="text-gray-400">{solved}/{total}</span>
              </div>
              <div className="bg-gray-800 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all ${
                    status === "Done" ? "bg-green-400" :
                    status === "In Progress" ? "bg-yellow-400" : "bg-gray-600"
                  }`}
                  style={{ width: total > 0 ? `${(solved / total) * 100}%` : "0%" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interview History */}
      <div className="bg-gray-900 rounded-xl p-4">
        <div className="font-semibold mb-4">Mock Interview History</div>
        <div className="text-gray-500 text-sm text-center py-4">
          No interviews yet — start a mock interview to see history here
        </div>
      </div>
    </div>
  );
}