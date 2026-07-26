import { chatAPI } from "./api";

export const sendMessage = async (message) => {
  const res = await chatAPI.post("/api/chat/message", { message });
  return res.data;
};

export const getChatHistory = async () => {
  const res = await chatAPI.get("/api/chat/history");
  return res.data;
};

export const clearChatHistory = async () => {
  const res = await chatAPI.delete("/api/chat/history");
  return res.data;
};

export const getMonthlyReport = async () => {
  const res = await chatAPI.post("/api/chat/message", {
    message: `Generate a comprehensive monthly financial report for me. Include:
    1. Total income and expenses summary
    2. Top spending categories
    3. Savings rate analysis
    4. Budget performance
    5. 3 specific tips to improve my finances next month
    Please format it clearly with sections.`,
  });
  return res.data;
};
