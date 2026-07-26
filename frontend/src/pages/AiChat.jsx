import { useEffect, useRef, useState } from "react";
import {
  sendMessage,
  getChatHistory,
  clearChatHistory,
  getMonthlyReport,
} from "../services/chatService";

const suggestions = [
  "How much did I spend this month?",
  "What is my savings rate?",
  "Give me tips to save money",
  "What is my biggest expense?",
  "Am I on track with my budget?",
];

export default function AiChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    getChatHistory()
      .then((h) => setMessages(h || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (msg) => {
    const text = msg || input;
    if (!text.trim() || loading) return;
    const userMsg = {
      role: "USER",
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await sendMessage(text);
      setMessages((prev) => [
        ...prev,
        {
          role: "ASSISTANT",
          content: res.message,
          timestamp: res.timestamp,
        },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMonthlyReport = async () => {
    setReportLoading(true);
    const userMsg = {
      role: "USER",
      content: "📊 Generate my monthly financial report",
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    try {
      const res = await getMonthlyReport();
      setMessages((prev) => [
        ...prev,
        {
          role: "ASSISTANT",
          content: res.message,
          timestamp: res.timestamp,
        },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setReportLoading(false);
    }
  };

  const handleClear = async () => {
    if (!window.confirm("Clear chat history?")) return;
    try {
      await clearChatHistory();
      setMessages([]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 flex flex-col" style={{ height: "100vh" }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            AI Finance Assistant
          </h1>
          <p className="text-slate-400 text-sm mt-1">Powered by Groq AI</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleMonthlyReport}
            disabled={reportLoading}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
          >
            {reportLoading ? "⏳ Generating..." : "📊 Monthly Report"}
          </button>
          {messages.length > 0 && (
            <button
              onClick={handleClear}
              className="bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-white px-3 py-2 rounded-xl text-sm transition-all"
            >
              🗑️ Clear
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 bg-slate-800 rounded-2xl border border-slate-700 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <div className="text-5xl mb-3">🤖</div>
              <p className="text-slate-400 text-sm mb-2">
                Ask me anything about your finances!
              </p>
              <p className="text-slate-500 text-xs mb-4">
                Or click 📊 Monthly Report for a full analysis
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSend(s)}
                    className="bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs px-3 py-2 rounded-xl transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "USER" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "ASSISTANT" && (
                <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-xs mr-2 flex-shrink-0 mt-1">
                  🤖
                </div>
              )}
              <div
                className={`max-w-lg px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                ${
                  msg.role === "USER"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-700 text-slate-100"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {(loading || reportLoading) && (
            <div className="flex justify-start items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-xs flex-shrink-0">
                🤖
              </div>
              <div className="bg-slate-700 px-4 py-3 rounded-2xl flex gap-1 items-center">
                <span
                  className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></span>
                <span
                  className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></span>
                <span
                  className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {messages.length > 0 && (
          <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
            {suggestions.slice(0, 3).map((s) => (
              <button
                key={s}
                onClick={() => handleSend(s)}
                className="bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs px-3 py-1.5 rounded-xl whitespace-nowrap transition-all flex-shrink-0"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="p-4 border-t border-slate-700 flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about your finances..."
            className="flex-1 bg-slate-700 text-white rounded-xl px-4 py-3 text-sm border border-slate-600 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
