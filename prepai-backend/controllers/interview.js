import dotenv from "dotenv";
dotenv.config();
import Groq from "groq-sdk";
import Interview from "../models/Interview.js";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const interview = {
  generateQuestion: async (req, res) => {
    const { company, type } = req.body;
    try {
      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: `Generate one ${type} interview question for ${company}. Only return the question, nothing else.` }],
        model: "llama-3.3-70b-versatile",
      });
      res.json({ question: completion.choices[0].message.content });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  generateFeedback: async (req, res) => {
    const { question, answer } = req.body;
    try {
      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: `You are an expert technical interviewer.\n\nQuestion: ${question}\nCandidate's Answer: ${answer}\n\nGive constructive feedback. Cover:\n1. What was good\n2. What was missing\n3. How to improve\n\nKeep it concise.` }],
        model: "llama-3.3-70b-versatile",
      });
      res.json({ feedback: completion.choices[0].message.content });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

export const saveInterview = async (req, res) => {
  const { company, type, score } = req.body;
  try {
    await Interview.create({ userId: req.userId, company, type, score });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

 export const generateOaQuestion = async (req, res) => {
  const { company } = req.body;
  try {
    if (company === "Amazon") {
      const completion = await groq.chat.completions.create({
        messages: [{
          role: "user", content: `Generate Amazon OA with:
                 1. 5 debugging MCQ questions
                 2. 2 coding problems

                 Return as JSON:
                {
                 "debuggingMCQ": [{"question": "", "options": ["A) ", "B) ", "C) ", "D) "], "answer": "A"}],
                 "codingProblems": [{"title": "", "description": "", "difficulty": "Medium", "topic": "Arrays"}]
                 }

                Return ONLY JSON, no explanation.` }],
        model: "llama-3.3-70b-versatile",
      });
      const text = completion.choices[0].message.content;
      const json = JSON.parse(text.replace(/```json|```/g, "").trim());
      res.json(json);
    } else {
      const completion = await groq.chat.completions.create({
        messages: [{
          role: "user", content: `Generate ${company} OA with 2 coding problems.

          Return as JSON:
         {
         "debuggingMCQ": [],
         "codingProblems": [{"title": "", "description": "", "difficulty": "Medium", "topic": "Arrays"}]
         }

      Return ONLY JSON, no explanation.` }],
        model: "llama-3.3-70b-versatile",
      });
      const text = completion.choices[0].message.content;
      const json = JSON.parse(text.replace(/```json|```/g, "").trim());
      res.json(json);
    }
  } catch (err) {
    console.log("ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};


