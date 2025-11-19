require('dotenv').config();
const axios = require('axios');

async function listModels() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        console.error("No API Key found");
        return;
    }

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
        const res = await axios.get(url);
        console.log("Models:", JSON.stringify(res.data, null, 2));
    } catch (err) {
        console.error("Error listing models:", err.response ? err.response.data : err.message);
    }
}

listModels();
