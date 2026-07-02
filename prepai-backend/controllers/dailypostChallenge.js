 
 import Groq from "groq-sdk";
 const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
 export const dailypostChallenge = async (req, res) => {
  try {
    const completion = await groq.chat.completions.create({
      messages: [{
        role: "user",
        content: `Generate one DSA coding problem. Include:
                   1. Problem title
                   2. Problem description
                   3. Example input/output
                   4. Difficulty (Easy/Medium/Hard)

                  Return as JSON:
                {"title": "", "description": "", "example": "", "difficulty": ""}`
                 }],
                 
                 model: "llama-3.3-70b-versatile",
    });
    const text = completion.choices[0].message.content;
    const json = JSON.parse(text.replace(/\`\`\`json|\`\`\`/g, "").trim());
    res.json(json);
  } catch (err) {
    console.log("ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
}

