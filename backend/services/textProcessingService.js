const { GoogleGenAI } = require("@google/genai");


const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const extractInsightsFromText = async (extractedText, prompt) => {
  try {
    const combinedPrompt  = `${prompt} ${extractedText}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: combinedPrompt ,
    });

    const responseText = response.candidates[0].content.parts[0].text;

    return responseText;
  } catch (err) {
    console.error("Error parsing JSON:", err);
  }
};

module.exports = extractInsightsFromText;
