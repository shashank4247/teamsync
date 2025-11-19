const https = require('https');
require('dotenv').config();

const key = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.models) {
                console.log("Available Models:");
                json.models.forEach(m => {
                    if (m.name.includes('gemini')) {
                        console.log(m.name);
                    }
                });
            } else {
                console.log("No models found or error:", json);
            }
        } catch (e) {
            console.error("Error parsing JSON:", e.message);
            console.log("Raw data:", data);
        }
    });
}).on('error', (e) => {
    console.error("Request error:", e.message);
});
