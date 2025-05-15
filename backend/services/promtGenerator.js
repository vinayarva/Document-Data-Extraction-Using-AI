const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const promptGenerator = async (extractedText) => {
  try {
    const prompt = `You are a prompt generator. Given the following text, generate a clear and concise prompt that asks an AI to extract key-value pairs from it and return them in a JSON format. Do NOT include any sample JSON or explanation — only return the prompt string.
    tell the in the promt what type text document in the promt
Text:
${extractedText}

Only return the prompt:`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    // Access response text (adjust based on your SDK's actual response shape)
    const responseText = response.candidates[0].content.parts[0].text;
    // console.log(responseText)
    return responseText;
  } catch (err) {
    console.error("Error generating prompt response:", err);
    throw err;
  }
};

module.exports = promptGenerator;
