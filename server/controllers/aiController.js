const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.analyzeIssue = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!description) {
            return res.status(400).json({ message: "Description is required for analysis" });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });

        const prompt = `
      Analyze the following issue description for a project management tool.
      
      Title: ${title || "Untitled"}
      Description: ${description}

      Return a JSON object with the following fields:
      - suggestedPriority: "low", "medium", or "high" based on urgency and impact.
      - autoTags: an array of short, relevant string tags (max 5).
      - summary: a concise 1-sentence summary of the description.
      - improvements: an array of strings suggesting how to make the task description better (e.g. "Add acceptance criteria", "Specify deadline").
      - missingFields: an array of strings listing important missing information (e.g. "No assignee", "No due date").

      Output ONLY valid JSON. Do not include markdown formatting.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Cleanup if markdown code blocks are present
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();

        const data = JSON.parse(text);

        res.json(data);
    } catch (error) {
        console.error("AI Analysis Error Details:", error);
        if (!process.env.GEMINI_API_KEY) {
            console.error("CRITICAL: GEMINI_API_KEY is missing in environment variables.");
        }
        res.status(500).json({ message: "Failed to analyze issue", error: error.message, details: error.toString() });
    }
};

exports.aiSuggest = exports.analyzeIssue; // Alias for backward compatibility or specific new route usage
