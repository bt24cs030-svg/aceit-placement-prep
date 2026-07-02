import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mic ,FileText, Triangle,ArrowUp} from "lucide-react";

export const DStartComponent = ({ solved, success }) => {

  const [company, setCompany] = useState("Google");
  const navigate = useNavigate();
  return (<>

    <div className="bg-gray-900 rounded-xl p-4">
      <div className="flex justify-between items-center mb-3">
        <div className="font-semibold flex gap-1 items-center"> <Mic size ={16} />Mock Interview</div>
        <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">AI Powered</span>
      </div>
      <div className="text-sm text-gray-400 mb-2">Select Company</div>
      <select
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm mb-3"
      >
        {["Google", "Microsoft", "Amazon", "Meta", "Apple"].map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[[solved, "Solved"], ["14", "Streak"], [`${success}%`, "Success"]].map(([val, label]) => (
          <div key={label} className="bg-gray-800 rounded-lg p-2 text-center">
            <div className="font-bold text-sm">{val}</div>
            <div className="text-xs text-gray-400">{label}</div>
          </div>
        ))}
      </div>
      <button
        onClick={() => navigate("/mock-interview")}
        className="w-full bg-green-500 text-black font-bold py-2 rounded-lg hover:bg-green-400 transition"
      >
        Start Interview
      </button>
    </div>

    {/* Resume Analyzer Card */}
    <div className="bg-gray-900 rounded-xl p-4">
      <div className="flex justify-between items-center mb-3">
        <div className="font-semibold flex gap-1  items-center"> <FileText size={16} />Resume Analyzer</div>
        <span className="text-xs text-blue-400">AI With Analysis</span>
      </div>
      <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center">
        <div className="text-2xl mb-2 flex justify-center"> <ArrowUp color="gray" /></div>
        <div className="text-sm text-gray-300">Drop your resume here</div>
        <div className="text-xs text-gray-500">or click to browse</div>
      </div>
      <button
        onClick={() => navigate("/resume-analyzer")}
        className="w-full mt-3 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg transition"
      >
        Analyze Resume
      </button>
    </div>
  </>);
};