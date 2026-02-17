const API_URL = "http://localhost:5000/api/ai";

// Get token - checks multiple places where it might be stored
const getToken = () => {
  // Check 'user' key first
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.token) return user.token;
  } catch (e) {}

  // Check 'token' key directly
  const directToken = localStorage.getItem("token");
  if (directToken) return directToken;

  // Check 'authToken' key
  const authToken = localStorage.getItem("authToken");
  if (authToken) return authToken;

  return null;
};

export const sendMessageToAI = async (message, history = []) => {
  const token = getToken();

  // Debug: log what token was found
  console.log("Token found:", token ? "YES ✅" : "NO ❌");

  if (!token) {
    throw new Error("Please login to use the AI assistant");
  }

  const response = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include", // also send cookies
    body: JSON.stringify({ message, history }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to get AI response");
  }

  return data.message;
};

export const getQuickSuggestions = () => [
  "I have chest pain and shortness of breath",
  "My skin has a rash that won't go away",
  "I need a doctor for my 5-year-old child",
  "I've been having severe headaches",
  "I feel anxious and depressed lately",
  "I need a general health checkup",
];
