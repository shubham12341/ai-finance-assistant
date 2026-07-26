import { useEffect, useState } from "react";
import { getBudgets } from "../services/financeService";

export default function BudgetAlert() {
  const [alerts, setAlerts] = useState([]);
  const [dismissed, setDismissed] = useState([]);
  const now = new Date();

  useEffect(() => {
    getBudgets(now.getMonth() + 1, now.getFullYear())
      .then((budgets) => {
        const warnings = budgets.filter((b) => {
          const pct = (b.spent / b.monthlyLimit) * 100;
          return pct >= 80;
        });
        setAlerts(warnings);
      })
      .catch(console.error);
  }, []);

  const visible = alerts.filter((a) => !dismissed.includes(a.id));

  if (visible.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-xs">
      {visible.map((b) => {
        const pct = Math.round((b.spent / b.monthlyLimit) * 100);
        const isOver = pct >= 100;
        return (
          <div
            key={b.id}
            className={`rounded-xl p-4 border flex items-start gap-3
              ${
                isOver
                  ? "bg-red-900 border-red-700"
                  : "bg-yellow-900 border-yellow-700"
              }`}
          >
            <span className="text-xl flex-shrink-0">
              {isOver ? "🚨" : "⚠️"}
            </span>
            <div className="flex-1">
              <p
                className={`text-sm font-medium
                ${isOver ? "text-red-300" : "text-yellow-300"}`}
              >
                {isOver ? "Budget exceeded!" : "Budget warning!"}
              </p>
              <p
                className={`text-xs mt-1
                ${isOver ? "text-red-400" : "text-yellow-400"}`}
              >
                {b.category}: {pct}% used — ₹
                {Number(b.spent).toLocaleString("en-IN")} / ₹
                {Number(b.monthlyLimit).toLocaleString("en-IN")}
              </p>
            </div>
            <button
              onClick={() => setDismissed([...dismissed, b.id])}
              className={`text-sm flex-shrink-0
                ${
                  isOver
                    ? "text-red-400 hover:text-red-200"
                    : "text-yellow-400 hover:text-yellow-200"
                }`}
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
}
