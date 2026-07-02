import dotenv from "dotenv";
dotenv.config();
import Groq from "groq-sdk";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const analyzeResume = async (req, res) => {
  try {
    console.log("Resume received:", req.file?.originalname);
    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
        content: `You are an expert technical recruiter. First check if this document is a resume/CV or not.

           If it is NOT a resume (e.g., assignment, notes, article, random document), respond with exactly this one word:
             NOT_A_RESUME

          If it IS a resume, analyze it for a software engineering position and provide feedback in this exact format:
          ## Overall Score: X/10

         ## Strengths:
         - point 1
         - point 2

        ## Weaknesses:
        - point 1
        - point 2

        ## Missing Skills:
        - point 1
        - point 2

        ## Suggestions:
        - point 1
        - point 2

        Document to analyze:
        ${resumeText}`,
        },
      ],

      model: "llama-3.3-70b-versatile",
    });

    res.json({ feedback: completion.choices[0].message.content });
  } catch (err) {
    console.log("ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
};

