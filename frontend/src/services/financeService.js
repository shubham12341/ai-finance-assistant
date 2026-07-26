import { financeAPI } from "./api";

export const addTransaction = async (data) => {
  const res = await financeAPI.post("/api/finance/transactions", data);
  return res.data;
};

export const getTransactions = async () => {
  const res = await financeAPI.get("/api/finance/transactions");
  return res.data;
};

export const updateTransaction = async (id, data) => {
  const res = await financeAPI.put(`/api/finance/transactions/${id}`, data);
  return res.data;
};

export const deleteTransaction = async (id) => {
  await financeAPI.delete(`/api/finance/transactions/${id}`);
};

export const getMonthlySummary = async (month, year) => {
  const res = await financeAPI.get(
    `/api/finance/summary?month=${month}&year=${year}`,
  );
  return res.data;
};

export const getMonthlyTrend = async () => {
  const now = new Date();
  const promises = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    promises.push(
      financeAPI
        .get(
          `/api/finance/summary?month=${date.getMonth() + 1}&year=${date.getFullYear()}`,
        )
        .then((res) => ({
          ...res.data,
          label: date.toLocaleString("default", { month: "short" }),
        })),
    );
  }
  return Promise.all(promises);
};

export const createBudget = async (data) => {
  const res = await financeAPI.post("/api/finance/budgets", data);
  return res.data;
};

export const getBudgets = async (month, year) => {
  const res = await financeAPI.get(
    `/api/finance/budgets?month=${month}&year=${year}`,
  );
  return res.data;
};

export const createRecurring = async (data) => {
  const res = await financeAPI.post("/api/finance/recurring", data);
  return res.data;
};

export const getRecurring = async () => {
  const res = await financeAPI.get("/api/finance/recurring");
  return res.data;
};

export const deleteRecurring = async (id) => {
  await financeAPI.delete(`/api/finance/recurring/${id}`);
};
