import { useState } from "react";
import { FileText, FolderSearch2, Bot, Star, ThumbsUp, ThumbsDown, PuzzleIcon, Lightbulb } from "lucide-react";
import { API_URL } from "../config";

const SECTION_ICONS = {
  "Overall Score": Star,
  "Strengths": ThumbsUp,
  "Weaknesses": ThumbsDown,
  "Missing Skills": PuzzleIcon,
  "Suggestions": Lightbulb,
};

function parseFeedback(raw) {
  const sections = raw.split(/\n(?=##\s)/).map((s) => s.trim()).filter(Boolean);
  return sections.map((section) => {
    const headingMatch = section.match(/^##\s*(.+?)\s*(?:\n|$)/);
    let title = headingMatch ? headingMatch[1].replace(/:$/, "") : "Feedback";
    const scoreMatch = title.match(/Overall Score:\s*(.+)/i);
    const score = scoreMatch ? scoreMatch[1].trim() : null;
    if (score) title = "Overall Score";
    const body = section.replace(/^##.*(\n|$)/, "").trim();
    const points = body
      .split("\n")
      .map((line) => line.replace(/^-+\s*/, "").trim())
      .filter(Boolean);
    return { title, score, points };
  });
}

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const analyzeResume = async (selectedFile) => {
    if (!selectedFile) return;
    setLoading(true);
    setFeedback("");

    const formData = new FormData();
    formData.append("resume", selectedFile);

    try {
      const res = await fetch(`${API_URL}/analyze-resume`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.feedback.trim() === "NOT_A_RESUME") {
        setFeedback("This doesn't look like a resume! Please upload your actual resume PDF.");
      } else {
        setFeedback(data.feedback);
      }
    } catch {
      setFeedback("Error connecting to server.");
    }
    setLoading(false);
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === "application/pdf") {
      setFile(selected);
      analyzeResume(selected);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type === "application/pdf") {
      setFile(dropped);
      analyzeResume(dropped);
    }
  };

  const handleDragOver=(e) => { e.preventDefault(); setDragOver(true); }

   const handleDragLeave =() => setDragOver(false)

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-1 flex items-center justify-start gap-2"><FileText size={20} /> Resume Analyzer</h1>
      <p className="text-gray-400 text-sm mb-6">
        Upload your resume and get  feedback from AI
      </p>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById("fileInput").click()}
        className={`bg-gray-900 rounded-xl p-10 text-center cursor-pointer border-2 border-dashed transition mb-4
          ${dragOver ? "border-green-400 bg-green-400/5" : "border-gray-700 hover:border-gray-500"}`}
      >
        <div className="text-4xl mb-3 flex justify-center"> <FolderSearch2 className="text-blue-500" size={25} /></div>
        {file ? (
          <div>
            <div className="text-green-400 font-medium">{file.name}</div>
            <div className="text-gray-400 text-sm mt-1">Click to change file</div>
          </div>
        ) : (
          <div>
            <div className="text-white font-medium">Drop your resume here</div>
            <div className="text-gray-400 text-sm mt-1">or click to browse (PDF only)</div>
          </div>
        )}
        <input
          id="fileInput"
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {loading && (
        <div className="bg-gray-900 rounded-xl p-6 text-center">
          <div className="text-green-400 text-lg mb-2 flex justify-center items-center gap-2">
            <Bot color="#1d4ed8" size={20} /> Analyzing your resume...
          </div>
          <div className="text-gray-400 text-sm">This may take a few seconds</div>
        </div>
      )}

      {feedback && !loading && (
        feedback.includes("##") ? (
          <div className="flex flex-col gap-3">
            {parseFeedback(feedback).map((section, i) => {
              const Icon = SECTION_ICONS[section.title] || FileText;
              return (
                <div key={i} className="bg-gray-900 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon size={16} className="text-green-400" />
                    <div className="text-sm font-semibold text-white">{section.title}</div>
                    {section.score && (
                      <span className="ml-auto text-sm font-bold text-green-400">{section.score}</span>
                    )}
                  </div>
                  {section.points.length > 0 && (
                    <ul className="flex flex-col gap-2">
                      {section.points.map((point, j) => (
                        <li key={j} className="text-gray-300 text-sm leading-relaxed flex gap-2">
                          <span className="text-green-400 mt-0.5">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-gray-900 rounded-xl p-6">
            <div className="text-xs text-green-400 font-medium mb-3">AI FEEDBACK</div>
            <div className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
              {feedback}
            </div>
          </div>
        )
      )}
    </div>
  );
}
