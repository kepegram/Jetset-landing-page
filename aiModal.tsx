import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyCkk_7p-wdKLgXgBqQmiEfRn9qoyn-EyEE";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const chatSession = model.startChat({
  generationConfig,
  history: [],
});

/**
 * Sends a message to the AI model with retry logic for overload errors.
 * @param {string} input - The input message for the model.
 * @param {number} maxRetries - Maximum number of retries.
 * @returns {Promise<string>} - The model's response text.
 */
export const sendMessageWithRetry = async (
  input: string,
  maxRetries: number = 3
): Promise<string> => {
  let attempts = 0;
  while (attempts < maxRetries) {
    try {
      const result = await chatSession.sendMessage(input);
      return result.response.text();
    } catch (error: any) {
      if (error.message.includes("503") && attempts < maxRetries - 1) {
        console.warn(
          `Model overloaded. Retrying... (Attempt ${
            attempts + 1
          }/${maxRetries})`
        );
        await new Promise(
          (resolve) => setTimeout(resolve, Math.pow(2, attempts) * 1000) // Exponential backoff
        );
        attempts++;
      } else {
        throw new Error(
          `Failed to fetch response after ${maxRetries} attempts: ${error.message}`
        );
      }
    }
  }
  throw new Error("Retries exhausted, model is unavailable.");
};
