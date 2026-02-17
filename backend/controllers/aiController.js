import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

let groq;

// Initialize Groq safely
try {
  groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });
} catch (err) {
  console.error("Failed to initialize Groq:", err.message);
}

const SYSTEM_PROMPT = `You are HealthCare AI, a helpful medical assistant 
for a doctor appointment booking app.

Your role is to:
1. Help patients understand their symptoms
2. Suggest which type of doctor/specialist they should see
3. Provide simple, clear health advice
4. Guide users to book appointments

Available specialists in our app:
- Cardiologist: heart problems, chest pain, blood pressure
- Dermatologist: skin issues, rashes, acne, hair problems  
- Pediatrician: children health (0-18 years)
- Orthopedic: bone, joint, muscle problems, sports injuries
- Neurologist: headaches, migraines, nerve issues, seizures
- General Physician: fever, cold, flu, general checkups
- Gynecologist: women health, pregnancy, menstrual issues
- Psychiatrist: anxiety, depression, stress, mental health

Rules you must follow:
- Never diagnose diseases, only suggest specialists
- Keep responses short and friendly (3-4 sentences max)
- For emergencies say: Call 911 or go to ER immediately
- Always end by suggesting which specialist to book`;

// @desc    Get AI health advice
// @route   POST /api/ai/chat
// @access  Private
export const getAIAdvice = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Please provide a message",
      });
    }

    if (message.length > 500) {
      return res.status(400).json({
        success: false,
        message: "Message too long. Keep it under 500 characters.",
      });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "AI service not configured. Add GROQ_API_KEY to .env file.",
      });
    }

    if (!groq) {
      return res.status(500).json({
        success: false,
        message: "AI service failed to initialize.",
      });
    }

    const recentHistory = history.slice(-10);
    const messages = [
      ...recentHistory,
      { role: "user", content: message.trim() },
    ];

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // ← changed this
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      max_tokens: 300,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error("No response from AI");
    }

    res.status(200).json({
      success: true,
      message: aiResponse,
    });
  } catch (error) {
    console.error("AI Error:", error.message);

    if (error.status === 401) {
      return res.status(500).json({
        success: false,
        message: "Invalid API key. Check GROQ_API_KEY in .env",
      });
    }

    if (error.status === 429) {
      return res.status(429).json({
        success: false,
        message: "Too many requests. Wait a moment and try again.",
      });
    }

    res.status(500).json({
      success: false,
      message: "AI service error. Please try again.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Test AI connection
// @route   GET /api/ai/test
// @access  Public
export const testAIConnection = async (req, res) => {
  try {
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "GROQ_API_KEY is missing from .env file",
      });
    }

    const completion = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [{ role: "user", content: "Say only: AI is working!" }],
      max_tokens: 20,
    });

    res.status(200).json({
      success: true,
      message: "AI connection successful!",
      aiSays: completion.choices[0]?.message?.content,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "AI connection failed",
      error: error.message,
    });
  }
};
