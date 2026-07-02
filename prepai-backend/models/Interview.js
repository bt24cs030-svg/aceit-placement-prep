import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  company: String,
  type: String,
  score: Number,
  maxScore: { type: Number, default: 10 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Interview", interviewSchema);