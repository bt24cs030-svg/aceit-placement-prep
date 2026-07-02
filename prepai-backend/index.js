import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import Groq from "groq-sdk";
import multer from "multer";
import mongoose from "mongoose";
import { register, login } from "./controllers/home.js";
import { generateOaQuestion, saveInterview ,interview} from "./controllers/interview.js";
import { analyzeResume } from "./controllers/analyzer.js";
import { dsagetProgress, dsapostProgress } from "./controllers/process.js";
import { authMiddleware } from "./middleware/auth.js";
import { analytics } from "./controllers/analytics.js";
import { dailypostChallenge } from "./controllers/dailypostChallenge.js";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => console.log("MongoDB error:", err.message));

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

app.get("/",(req,res)=>{res.send("Welcome to AceIt Backend!")});

app.post("/register", register);
app.post("/login", login);

app.post("/generate-question", interview.generateQuestion);
app.post("/generate-oa-questions", generateOaQuestion);
app.post("/get-feedback", interview.generateFeedback);
app.post("/analyze-resume", upload.single("resume"), analyzeResume);

app.get("/dsa-progress", authMiddleware, dsagetProgress);
app.post("/dsa-progress", authMiddleware, dsapostProgress);

app.post("/save-interview", authMiddleware, saveInterview);
app.get("/analytics", authMiddleware, analytics);

app.post("/daily-challenge", dailypostChallenge);

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});

