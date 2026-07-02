import { useState } from "react";
import { FileText, FolderSearch2, Bot } from "lucide-react";

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
      const res = await fetch("http://localhost:4000/analyze-resume", {
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
        <div className="bg-gray-900 rounded-xl p-6">
          <div className="text-xs text-green-400 font-medium mb-3">AI FEEDBACK</div>
          <div className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
            {feedback}
          </div>
        </div>
      )}
    </div>
  );
}
