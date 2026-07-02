import mongoose from "mongoose";

const dsaSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  topicId: Number,
  name: String,
  solved: Number,
  total: Number,
  status: String,
});

export default mongoose.model("DSATopic", dsaSchema);