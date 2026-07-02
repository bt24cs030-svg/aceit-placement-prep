import DSATopic from "../models/DSATopic.js";
 export const dsagetProgress = async (req, res) => {
  try {
    const topics = await DSATopic.find({ userId: req.userId });
    res.json(topics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const dsapostProgress = async (req, res) => {
  try {
    const { topics } = req.body;
    for (const topic of topics) {
      await DSATopic.findOneAndUpdate(
        { topicId: topic.id, userId: req.userId },
        { ...topic, topicId: topic.id, userId: req.userId },
        { upsert: true }
      );
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
