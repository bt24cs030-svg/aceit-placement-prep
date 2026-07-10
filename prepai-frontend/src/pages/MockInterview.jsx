import { useState, useEffect, useRef } from "react";
import { Mic ,Zap,TrendingUp} from "lucide-react";
import { API_URL } from "../config";

const companies = ["Google", "Microsoft", "Amazon", "Meta", "Apple"];

const roundTypes = [
  { round: 1, label: "Round 1 — DSA / Coding", type: "Technical" },
  { round: 2, label: "Round 2 — DSA / Coding", type: "Technical" },
  { round: 3, label: "Round 3 — Behavioral / HR", type: "Behavioral" },
];

const oaConfig = {
  Google: { time: 45 * 60, label: "2 DSA Problems · 45 min", type: "coding" },
  Meta:  {  time: 45 * 60, label: "2 DSA Problems · 45 min", type: "coding" },
  Apple: {  time: 45 * 60, label: "2 DSA Problems · 45 min", type: "coding" },
  Microsoft:{ time: 60 * 60, label: "3 Coding Problems · 60 min", type: "coding" },
  Amazon: { time: 90 * 60, label: "5 Debugging MCQ + 2 Coding · 90 min", type: "mixed" },
};

export default function MockInterview() {
  const [company, setCompany] = useState("Google");
  const [phase, setPhase] = useState("start");
  const [oaData, setOaData] = useState(null); 
  const [oaAnswers, setOaAnswers] = useState({}); 
  const [oaScore, setOaScore] = useState(null);
  const [oaLoading, setOaLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentProblem, setCurrentProblem] = useState(0);
  const [problemAnswers, setProblemAnswers] = useState({}); 
  const [problemFeedbacks, setProblemFeedbacks] = useState({});
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const timerRef = useRef(null);

  const [currentRound, setCurrentRound] = useState(1);
  const [currentQ, setCurrentQ] = useState(0);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loadingQ, setLoadingQ] = useState(false);
  const [loadingF, setLoadingF] = useState(false);
  const [roundAnswers, setRoundAnswers] = useState([]);
  const [roundSummary, setRoundSummary] = useState(null);
  const [allRounds, setAllRounds] = useState([]);

  useEffect(() => {
    if (phase === "oa") {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            submitOA();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [phase]);

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const startOA = async () => {
    setOaLoading(true);
    try {
      const res = await fetch(`${API_URL}/generate-oa-questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company }),
      });
      const data = await res.json();
      setOaData(data);
      setOaAnswers({});
      setProblemAnswers({});
      setProblemFeedbacks({});
      setCurrentProblem(0);
      setTimeLeft(oaConfig[company].time);
      setPhase("oa");
    } catch {
      alert("Error loading OA. Please try again.");
    }
    setOaLoading(false);
  };

  const getCodingFeedback = async (idx) => {
    const problem = oaData.codingProblems[idx];
    const userAnswer = problemAnswers[idx];
    if (!userAnswer) return;
    setLoadingFeedback(true);
    try {
      const res = await fetch(`${API_URL}/get-feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: `${problem.title}: ${problem.description}`,
          answer: userAnswer,
        }),
      });
      const data = await res.json();
      setProblemFeedbacks((prev) => ({ ...prev, [idx]: data.feedback }));
    } catch {}
    setLoadingFeedback(false);
  };

  const submitOA = () => {
    clearInterval(timerRef.current);
    const mcqList = oaData?.debuggingMCQ || [];
    let mcqCorrect = 0;
    mcqList.forEach((q, i) => {
      if (oaAnswers[i] === q.answer) mcqCorrect++;
    });
    const codingAttempted = Object.keys(problemAnswers).length;
    const totalProblems = oaData?.codingProblems?.length || 0;
    setOaScore({ mcqCorrect, mcqTotal: mcqList.length, codingAttempted, totalProblems });
    setPhase("oa-result");
  };

  const startInterview = async () => {
    setCurrentRound(1);
    setCurrentQ(1);
    setRoundAnswers([]);
    setAllRounds([]);
    setRoundSummary(null);
    setPhase("interview");
    await generateQuestion(1);
  };

  const generateQuestion = async (round) => {
    const roundInfo = roundTypes[(round || currentRound) - 1];
    setLoadingQ(true);
    setAnswer("");
    setFeedback("");
    setRoundSummary(null);
    try {
      const res = await fetch(`${API_URL}/generate-question`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, type: roundInfo.type }),
      });
      const data = await res.json();
      setQuestion(data.question);
    } catch {
      setQuestion("Error connecting to server.");
    }
    setLoadingQ(false);
  };

  const getFeedback = async () => {
    if (!question || !answer) return;
    setLoadingF(true);
    setFeedback("");
    try {
      const res = await fetch(`${API_URL}/get-feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, answer }),
      });
      const data = await res.json();
      setFeedback(data.feedback);
      setRoundAnswers((prev) => [...prev, { question, answer, feedback: data.feedback }]);
    } catch {
      setFeedback("Error connecting to server.");
    }
    setLoadingF(false);
  };

  const nextQuestion = async () => {
    const roundInfo = roundTypes[currentRound - 1];
    if (currentQ === 2) {
      const summary = {
        round: currentRound,
        label: roundInfo.label,
        answers: [...roundAnswers, { question, answer, feedback }],
      };
      setAllRounds((prev) => [...prev, summary]);
      setRoundSummary(summary);
      setQuestion(""); setAnswer(""); setFeedback("");
      return;
    }
    setCurrentQ(2);
    await generateQuestion();
  };

  const startNextRound = async () => {
    if (currentRound === 3) { setPhase("complete"); return; }
    const next = currentRound + 1;
    setCurrentRound(next);
    setCurrentQ(1);
    setRoundAnswers([]);
    setRoundSummary(null);
    await generateQuestion(next);
  };

  const resetAll = () => {
    setPhase("start");
    setOaData(null);
    setOaAnswers({});
    setOaScore(null);
    setProblemAnswers({});
    setProblemFeedbacks({});
    setCurrentProblem(0);
    setCurrentRound(1);
    setCurrentQ(0);
    setQuestion(""); setAnswer(""); setFeedback("");
    setRoundAnswers([]);
    setRoundSummary(null);
    setAllRounds([]);
  };

  const cfg = oaConfig[company];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-1 flex gap-2 items-center"><Mic color="gray" /> Mock Interview</h1>
      <p className="text-gray-400 text-sm mb-6">Company-specific OA + 3 Rounds </p>
      {phase === "start" && (
        <div className="bg-gray-900 rounded-xl p-6">
          <div className="mb-4">
            <label className="text-sm text-gray-400 mb-1 block">Select Company</label>
            <select
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm"
            >
              {companies.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div className="mb-4 flex flex-col gap-2">
            {[
              { round: "OA", label: `Online Assessment — ${oaConfig[company].type === "mixed" ? "Debugging + Coding" : "Coding Problems"}`, sub: oaConfig[company].label, color: "text-purple-400" },
              { round: "1", label: "Round 1 — DSA / Coding", sub: "2 Questions", color: "text-yellow-400" },
              { round: "2", label: "Round 2 — DSA / Coding", sub: "2 Questions", color: "text-yellow-400" },
              { round: "3", label: "Round 3 — Behavioral / HR", sub: "2 Questions", color: "text-blue-400" },
            ].map(({ round, label, sub, color }) => (
              <div key={round} className="flex items-center gap-3 bg-gray-800 rounded-lg px-4 py-2">
                <div className={`w-7 h-7 rounded-full bg-gray-700 text-xs flex items-center justify-center font-bold ${color}`}>{round}</div>
                <div className="text-sm text-gray-300">{label}</div>
                <div className="ml-auto text-xs text-gray-500">{sub}</div>
              </div>
            ))}
          </div>

          <button
            onClick={startOA}
            disabled={oaLoading}
            className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-lg transition"
          >
            {oaLoading ? `Loading ${company} OA...` : `Start ${company} Interview`}
          </button>
        </div>
      )}

      {/* ===== OA ROUND ===== */}
      {phase === "oa" && oaData && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <span className="bg-purple-500/20 text-purple-400 border border-purple-500/30 px-3 py-1 rounded-full text-sm font-bold">
              {company} OA
            </span>
            <span className={`font-mono text-lg font-bold ${timeLeft < 300 ? "text-red-400" : "text-green-400"}`}>
               {formatTime(timeLeft)}
            </span>
          </div>

          {/* Amazon — Debugging MCQ first */}
          {oaData.debuggingMCQ?.length > 0 && (
            <div className="mb-6">
              <div className="text-sm font-semibold text-orange-400 mb-3">🐛 Section 1: Debugging MCQ</div>
              <div className="flex flex-col gap-4">
                {oaData.debuggingMCQ.map((q, i) => (
                  <div key={i} className="bg-gray-900 rounded-xl p-4">
                    <div className="text-xs text-orange-400 mb-2">Debug Q{i + 1}</div>
                    <p className="text-white text-sm mb-3 whitespace-pre-wrap leading-relaxed">{q.question}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {q.options.map((opt, j) => {
                        const letter = ["A", "B", "C", "D"][j];
                        const selected = oaAnswers[i] === letter;
                        return (
                          <button
                            key={j}
                            onClick={() => setOaAnswers((prev) => ({ ...prev, [i]: letter }))}
                            className={`text-left text-sm px-3 py-2 rounded-lg border transition ${
                              selected ? "bg-orange-500/20 border-orange-500 text-orange-300" : "bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500"
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Coding Problems */}
          <div className="text-sm font-semibold text-green-400 mb-3">
           {oaData.debuggingMCQ?.length > 0 ? "Section 2: " : ""}Coding Problems
          </div>

          {/* Problem tabs */}
          <div className="flex gap-2 mb-4">
            {oaData.codingProblems.map((p, i) => (
              <button
                key={i}
                onClick={() => setCurrentProblem(i)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  currentProblem === i ? "bg-green-500 text-black" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                Problem {i + 1}
                {problemAnswers[i] ? " ✓" : ""}
              </button>
            ))}
          </div>

          {/* Current Problem */}
          {oaData.codingProblems[currentProblem] && (
            <div className="bg-gray-900 rounded-xl p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm font-bold text-white">{oaData.codingProblems[currentProblem].title}</div>
                <div className="flex gap-2">
                  <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">{oaData.codingProblems[currentProblem].topic}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    oaData.codingProblems[currentProblem].difficulty === "Easy" ? "text-green-400 bg-green-500/10" :
                    oaData.codingProblems[currentProblem].difficulty === "Hard" ? "text-red-400 bg-red-500/10" :
                    "text-yellow-400 bg-yellow-500/10"
                  }`}>{oaData.codingProblems[currentProblem].difficulty}</span>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                {oaData.codingProblems[currentProblem].description}
              </p>
            </div>
          )}

          <div className="bg-gray-900 rounded-xl p-4 mb-4">
            <div className="text-xs text-gray-400 mb-2">YOUR SOLUTION (explain your approach)</div>
            <textarea
              value={problemAnswers[currentProblem] || ""}
              onChange={(e) => setProblemAnswers((prev) => ({ ...prev, [currentProblem]: e.target.value }))}
              placeholder="Explain your approach, algorithm, time complexity..."
              rows={6}
              className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-green-500"
            />
            <button
              onClick={() => getCodingFeedback(currentProblem)}
              disabled={loadingFeedback || !problemAnswers[currentProblem]}
              className="w-full mt-3 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg transition disabled:opacity-50"
            >
              {loadingFeedback ? "Analyzing..." : "🤖 Get AI Feedback"}
            </button>
            {problemFeedbacks[currentProblem] && (
              <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div className="text-xs text-blue-400 mb-1">AI FEEDBACK</div>
                <p className="text-gray-300 text-xs whitespace-pre-wrap leading-relaxed">{problemFeedbacks[currentProblem]}</p>
              </div>
            )}
          </div>

          <button
            onClick={submitOA}
            className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-lg transition"
          >
            Submit OA →
          </button>
        </div>
      )}

      {/* ===== OA RESULT ===== */}
      {phase === "oa-result" && oaScore && (
        <div className="bg-gray-900 rounded-xl p-6 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <div className="text-2xl font-bold mb-1">OA Complete!</div>
          <div className="text-gray-400 text-sm mb-4">{company} · Online Assessment</div>

          <div className="bg-gray-800 rounded-xl p-4 mb-4 text-left flex flex-col gap-2">
            {oaScore.mcqTotal > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">🐛 Debugging MCQ</span>
                <span className={oaScore.mcqCorrect >= 3 ? "text-green-400" : "text-red-400"}>
                  {oaScore.mcqCorrect}/{oaScore.mcqTotal} correct
                </span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">💻 Coding Problems</span>
              <span className={oaScore.codingAttempted > 0 ? "text-green-400" : "text-yellow-400"}>
                {oaScore.codingAttempted}/{oaScore.totalProblems} attempted
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={resetAll} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg text-sm">
              Try Again
            </button>
            <button onClick={startInterview} className="flex-1 bg-green-500 hover:bg-green-400 text-black font-bold py-2 rounded-lg">
              Start Round 1 →
            </button>
          </div>
        </div>
      )}

      {/* ===== INTERVIEW ROUNDS ===== */}
      {phase === "interview" && !roundSummary && (
        <>
          <div className="flex gap-2 mb-4">
            {[1, 2, 3].map((r) => (
              <div key={r} className={`flex-1 h-1.5 rounded-full ${r < currentRound ? "bg-green-400" : r === currentRound ? "bg-yellow-400" : "bg-gray-700"}`} />
            ))}
          </div>
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-3 py-1 rounded-full text-sm">Round {currentRound}/3</span>
              <span className="bg-gray-800 text-gray-400 px-3 py-1 rounded-full text-sm">Q{currentQ}/2</span>
              <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full text-sm">{company}</span>
            </div>
            <button onClick={resetAll} className="text-red-400 text-sm border border-red-400/30 px-3 py-1 rounded-lg hover:bg-red-400/10">End</button>
          </div>
          {loadingQ ? (
            <div className="bg-gray-900 rounded-xl p-6 text-center mb-4"><div className="text-green-400">Generating question...</div></div>
          ) : (
            <div className="bg-gray-900 rounded-xl p-4 mb-4">
              <div className="text-xs text-green-400 mb-2 font-medium">{roundTypes[currentRound - 1].label} — Q{currentQ}</div>
              <p className="text-white leading-relaxed">{question}</p>
            </div>
          )}
          {!loadingQ && (
            <div className="bg-gray-900 rounded-xl p-4 mb-4">
              <div className="text-xs text-gray-400 mb-2 font-medium">YOUR ANSWER</div>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here..."
                rows={5}
                className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-green-500"
              />
              <button
                onClick={getFeedback}
                disabled={loadingF || !answer}
                className="w-full mt-3 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg transition disabled:opacity-50"
              >
                {loadingF ? "Analyzing..." : " Get AI Feedback"}
              </button>
            </div>
          )}
          {feedback && (
            <div className="bg-gray-900 rounded-xl p-4 border border-blue-500/30">
              <div className="text-xs text-blue-400 mb-2 font-medium">AI FEEDBACK</div>
              <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">{feedback}</p>
              <button onClick={nextQuestion} disabled={loadingQ} className="w-full mt-4 bg-green-500 hover:bg-green-400 text-black font-bold py-2 rounded-lg transition">
                {currentQ === 2 ? "📊 View Round Summary →" : "⚡ Next Question →"}
              </button>
            </div>
          )}
        </>
      )}

      {/* ===== ROUND SUMMARY ===== */}
      {phase === "interview" && roundSummary && (
        <div className="bg-gray-900 rounded-xl p-6">
          <div className="text-center mb-6">
            <div className="text-3xl mb-2"><TrendingUp className="text-emerald-500" /></div>
            <div className="text-xl font-bold">Round {roundSummary.round} Complete!</div>
            <div className="text-gray-400 text-sm mt-1">{roundSummary.label}</div>
          </div>
          {roundSummary.answers.map((item, i) => (
            <div key={i} className="bg-gray-800 rounded-lg p-4 mb-3">
              <div className="text-xs text-green-400 mb-1">Q{i + 1}</div>
              <div className="text-sm text-white mb-2">{item.question}</div>
              <div className="text-xs text-gray-400 mb-2">Your answer: {item.answer?.slice(0, 150)}...</div>
              <div className="text-xs text-blue-300 whitespace-pre-wrap">{item.feedback?.slice(0, 300)}...</div>
            </div>
          ))}
          <div className="flex gap-3 mt-4">
            <button onClick={resetAll} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg text-sm">End</button>
            <button onClick={startNextRound} className="flex-1 bg-green-500 hover:bg-green-400 text-black font-bold py-2 rounded-lg">
              {currentRound === 3 ? "Finish Interview" : `Start Round ${currentRound + 1} →`}
            </button>
          </div>
        </div>
      )}

      {/* ===== COMPLETE ===== */}
      {phase === "complete" && (
        <div className="bg-gray-900 rounded-xl p-6 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <div className="text-2xl font-bold mb-2">Interview Complete!</div>
          <div className="text-gray-400 mb-6">{company} · OA + 3 Rounds</div>
          {allRounds.map((r) => (
            <div key={r.round} className="bg-gray-800 rounded-lg p-4 mb-3 text-left">
              <div className="text-sm font-medium text-green-400 mb-2">{r.label}</div>
              {r.answers.map((a, i) => (
                <div key={i} className="text-xs text-gray-400 mb-1">Q{i + 1}: {a.question?.slice(0, 80)}...</div>
              ))}
            </div>
          ))}
          <button onClick={resetAll} className="w-full mt-4 bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-lg">
            Start New Interview
          </button>
        </div>
      )}
    </div>
  );
}
