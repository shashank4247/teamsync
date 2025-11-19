require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        // For listing models, we don't need to get a specific model first.
        // But the SDK doesn't have a direct 'listModels' method on the client instance in some versions.
        // Actually, looking at the docs/SDK, usually there is a ModelService or we can try to just generate with a known fallback.
        // However, let's try to use the model manager if exposed, or just try a different model 'gemini-1.0-pro'.

        // Let's try to just run a generation with 'gemini-1.0-pro' which is often the specific version for 'gemini-pro'.
        const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
        const result = await model.generateContent("Hello");
        console.log("gemini-1.0-pro worked!");
    } catch (error) {
        console.error("gemini-1.0-pro failed:", error.message);
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });
        const result = await model.generateContent("Hello");
        console.log("gemini-1.5-flash-001 worked!");
    } catch (error) {
        console.error("gemini-1.5-flash-001 failed:", error.message);
    }
}

listModels();
