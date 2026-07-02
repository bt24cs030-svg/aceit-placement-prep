import Interview from "../models/Interview.js";
import DSATopic from "../models/DSATopic.js";

 export const analytics = async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.userId }).sort({ createdAt: -1 }).limit(10);
    const dsaTopics = await DSATopic.find({ userId: req.userId });
    const totalSolved = dsaTopics.reduce((acc, t) => acc + t.solved, 0);
    const totalInterviews = interviews.length;

    res.json({ interviews, dsaTopics, totalSolved, totalInterviews });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
