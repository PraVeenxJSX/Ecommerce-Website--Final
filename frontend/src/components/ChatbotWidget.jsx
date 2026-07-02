import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChatBubbleLeftRightIcon, PaperAirplaneIcon, XMarkIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { streamChatResponse } from "../services/api";

const QUICK_PROMPTS = [
  "Show me products",
  "What are your returns?",
  "How do I check my order?",
  "What payment methods do you accept?",
  "Contact support",
];

const makeMessage = (role, content, extra = {}) => ({
  id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  role,
  content,
  ...extra,
});

const buildHistory = (messages, nextUserMessage) =>
  [...messages, nextUserMessage]
    .filter((item) => item.role === "user" || item.role === "assistant")
    .slice(-8)
    .map(({ role, content }) => ({ role, content }));

const ChatbotWidget = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    makeMessage("assistant", "Hi, I can help with products, orders, shipping, returns, and payments."),
  ]);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, open]);

  const patchAssistant = (assistantId, updater) => {
    setMessages((current) =>
      current.map((message) => {
        if (message.id !== assistantId) return message;
        const next = updater(message);
        return { ...message, ...next };
      })
    );
  };

  const sendMessage = async (rawText) => {
    const text = rawText.trim();
    if (!text || loading) return;

    const userMessage = makeMessage("user", text);
    const assistantId = makeMessage("assistant", "").id;

    setMessages((current) => [
      ...current,
      userMessage,
      {
        id: assistantId,
        role: "assistant",
        content: "",
        products: [],
        streaming: true,
      },
    ]);
    setInput("");
    setLoading(true);

    const history = buildHistory(messages, userMessage);

    try {
      await streamChatResponse({
        message: text,
        history,
        onMeta: (payload) => {
          if (Array.isArray(payload.products)) {
            patchAssistant(assistantId, () => ({ products: payload.products }));
          }
        },
        onDelta: (chunk) => {
          patchAssistant(assistantId, (message) => ({
            content: `${message.content}${chunk}`,
          }));
        },
      });
    } catch {
      patchAssistant(assistantId, () => ({
        content: "I’m having trouble reaching the assistant right now. Please try again in a moment.",
      }));
    } finally {
      patchAssistant(assistantId, () => ({ streaming: false }));
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Close chatbot" : "Open chatbot"}
        onClick={() => setOpen((value) => !value)}
        className="chatbot-launcher"
      >
        {open ? <XMarkIcon className="chatbot-launcher-icon" /> : <ChatBubbleLeftRightIcon className="chatbot-launcher-icon" />}
      </button>

      {open && (
        <section className="chatbot-panel" aria-label="Customer support chatbot">
          <header className="chatbot-header">
            <div className="chatbot-header-title">
              <SparklesIcon className="chatbot-header-icon" />
              <div>
                <div className="chatbot-title">Store Assistant</div>
                <div className="chatbot-subtitle">Live shopping help</div>
              </div>
            </div>
            <button type="button" aria-label="Close chatbot" onClick={() => setOpen(false)} className="chatbot-close">
              <XMarkIcon className="chatbot-close-icon" />
            </button>
          </header>

          <div className="chatbot-body">
            {messages.map((message) => (
              <div key={message.id} className={`chatbot-row ${message.role}`}>
                <div className={`chatbot-bubble ${message.role}`}>
                  <p className="chatbot-text">{message.content || (message.streaming ? "Typing..." : "")}</p>

                  {message.products?.length > 0 && (
                    <div className="chatbot-products">
                      {message.products.map((product) => (
                        <Link key={product._id} to={`/product/${product._id}`} className="chatbot-product-card">
                          <img src={product.image} alt={product.name} className="chatbot-product-image" />
                          <div className="chatbot-product-meta">
                            <div className="chatbot-product-name">{product.name}</div>
                            <div className="chatbot-product-price">₹{product.price}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="chatbot-row assistant">
                <div className="chatbot-bubble assistant">
                  <span className="chatbot-typing">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="chatbot-quick-actions">
            {QUICK_PROMPTS.map((prompt) => (
              <button key={prompt} type="button" className="chatbot-chip" onClick={() => sendMessage(prompt)}>
                {prompt}
              </button>
            ))}
          </div>

          <form className="chatbot-form" onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about products, orders, returns, or anything else"
              aria-label="Type your message"
              className="chatbot-input"
            />
            <button type="submit" className="chatbot-send" aria-label="Send message" disabled={loading || !input.trim()}>
              <PaperAirplaneIcon className="chatbot-send-icon" />
            </button>
          </form>
        </section>
      )}

      <style>{`
        .chatbot-launcher {
          position: fixed;
          right: 20px;
          bottom: 20px;
          width: 56px;
          height: 56px;
          border-radius: 999px;
          border: 0;
          background: linear-gradient(135deg, #22d3ee, #8b5cf6);
          color: #fff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
          cursor: pointer;
          z-index: 70;
        }

        .chatbot-launcher-icon {
          width: 24px;
          height: 24px;
        }

        .chatbot-panel {
          position: fixed;
          right: 20px;
          bottom: 88px;
          width: 380px;
          max-width: calc(100vw - 24px);
          max-height: min(72vh, 680px);
          background: rgba(10, 10, 15, 0.96);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(18px);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          z-index: 70;
        }

        .chatbot-header {
          padding: 16px 16px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.03);
        }

        .chatbot-header-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .chatbot-header-icon {
          width: 22px;
          height: 22px;
          color: #67e8f9;
        }

        .chatbot-title {
          color: #fff;
          font-size: 15px;
          font-weight: 700;
        }

        .chatbot-subtitle {
          color: rgba(255, 255, 255, 0.45);
          font-size: 12px;
          margin-top: 2px;
        }

        .chatbot-close {
          width: 36px;
          height: 36px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .chatbot-close-icon,
        .chatbot-send-icon {
          width: 18px;
          height: 18px;
        }

        .chatbot-body {
          padding: 16px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex: 1;
        }

        .chatbot-row {
          display: flex;
        }

        .chatbot-row.user {
          justify-content: flex-end;
        }

        .chatbot-row.assistant {
          justify-content: flex-start;
        }

        .chatbot-bubble {
          max-width: 92%;
          border-radius: 18px;
          padding: 12px 14px;
        }

        .chatbot-bubble.user {
          background: linear-gradient(135deg, rgba(34, 211, 238, 0.18), rgba(139, 92, 246, 0.16));
          border: 1px solid rgba(34, 211, 238, 0.22);
        }

        .chatbot-bubble.assistant {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .chatbot-text {
          color: rgba(255, 255, 255, 0.9);
          font-size: 14px;
          line-height: 1.6;
          margin: 0;
          white-space: pre-wrap;
        }

        .chatbot-products {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
          margin-top: 12px;
        }

        .chatbot-product-card {
          display: flex;
          gap: 10px;
          align-items: center;
          text-decoration: none;
          padding: 10px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .chatbot-product-image {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          object-fit: cover;
          flex-shrink: 0;
        }

        .chatbot-product-meta {
          min-width: 0;
        }

        .chatbot-product-name {
          color: #fff;
          font-size: 13px;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 220px;
        }

        .chatbot-product-price {
          color: #67e8f9;
          font-size: 12px;
          font-weight: 700;
          margin-top: 2px;
        }

        .chatbot-typing {
          color: rgba(255, 255, 255, 0.55);
          font-size: 13px;
        }

        .chatbot-quick-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          padding: 0 16px 14px;
        }

        .chatbot-chip {
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.8);
          border-radius: 999px;
          font-size: 12px;
          padding: 8px 10px;
          cursor: pointer;
        }

        .chatbot-form {
          display: flex;
          gap: 10px;
          padding: 0 16px 16px;
        }

        .chatbot-input {
          flex: 1;
          min-width: 0;
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.04);
          color: #fff;
          padding: 12px 14px;
          font-size: 14px;
          outline: none;
        }

        .chatbot-input::placeholder {
          color: rgba(255, 255, 255, 0.35);
        }

        .chatbot-send {
          width: 46px;
          height: 46px;
          border-radius: 14px;
          border: 0;
          background: linear-gradient(135deg, #22d3ee, #8b5cf6);
          color: #fff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .chatbot-send:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        @media (max-width: 640px) {
          .chatbot-launcher {
            right: 14px;
            bottom: 14px;
          }

          .chatbot-panel {
            right: 12px;
            left: 12px;
            width: auto;
            bottom: 82px;
          }
        }
      `}</style>
    </>
  );
};

export default ChatbotWidget;
