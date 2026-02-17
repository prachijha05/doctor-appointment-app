import { useState, useRef, useEffect } from "react";
import { sendMessageToAI, getQuickSuggestions } from "../services/aiService";
import "./AIChatBot.css";

const AIChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "ai",
      text: "👋 Hi! I'm HealthCare AI. I can help you identify your symptoms and suggest the right specialist to see. How are you feeling today?",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [hasNewMessage, setHasNewMessage] = useState(true);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setHasNewMessage(false);
    }
  }, [isOpen]);

  const getTime = () =>
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleSend = async (text = inputText) => {
    const messageText = text.trim();
    if (!messageText || isLoading) return;

    setError("");
    setShowSuggestions(false);
    setInputText("");

    const userMessage = {
      id: Date.now(),
      role: "user",
      text: messageText,
      time: getTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const history = messages.slice(1).map((m) => ({
        role: m.role === "ai" ? "assistant" : "user",
        content: m.text,
      }));

      const aiResponse = await sendMessageToAI(messageText, history);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "ai",
          text: aiResponse,
          time: getTime(),
        },
      ]);
    } catch (err) {
      setError(err.message || "Failed to get response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        role: "ai",
        text: "👋 Hi! I'm HealthCare AI. How are you feeling today?",
        time: getTime(),
      },
    ]);
    setShowSuggestions(true);
    setError("");
  };

  return (
    <>
      <button
        className="chat-bubble-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Talk to HealthCare AI"
      >
        {isOpen ? "✕" : "🤖"}
        {hasNewMessage && !isOpen && <span className="chat-badge">1</span>}
      </button>

      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar">🤖</div>
              <div>
                <h3>HealthCare AI</h3>
                <p>
                  <span className="online-dot"></span>
                  Powered by Groq (Free)
                </p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={clearChat}
                className="chat-close-btn"
                title="Clear chat"
              >
                🗑
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="chat-close-btn"
                title="Close"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.role}`}>
                <div className="message-avatar">
                  {message.role === "ai" ? "🤖" : "👤"}
                </div>
                <div>
                  <div className="message-bubble">{message.text}</div>
                  <div className="message-time">{message.time}</div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="message ai">
                <div className="message-avatar">🤖</div>
                <div className="typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            )}

            {error && <div className="error-message">⚠️ {error}</div>}

            <div ref={messagesEndRef} />
          </div>

          {showSuggestions && (
            <div className="quick-suggestions">
              <p>💡 Quick questions:</p>
              {getQuickSuggestions().map((suggestion, index) => (
                <button
                  key={index}
                  className="suggestion-chip"
                  onClick={() => handleSend(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          <div className="chat-input-area">
            <textarea
              ref={inputRef}
              className="chat-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe your symptoms..."
              rows={1}
              disabled={isLoading}
            />
            <button
              className="chat-send-btn"
              onClick={() => handleSend()}
              disabled={!inputText.trim() || isLoading}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatBot;
