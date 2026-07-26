import { useEffect, useState } from "react";
import { createBudget, getBudgets } from "../services/financeService";

const CATEGORIES = [
  "Food",
  "Transport",
  "Entertainment",
  "Utilities",
  "Shopping",
  "Health",
  "Other",
];

export default function Budget() {
  const [budgets, setBudgets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    category: "Food",
    monthlyLimit: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const now = new Date();

  useEffect(() => {
    getBudgets(now.getMonth() + 1, now.getFullYear())
      .then(setBudgets)
      .catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const b = await createBudget({
        ...form,
        monthlyLimit: parseFloat(form.monthlyLimit),
      });
      setBudgets([...budgets, b]);
      setShowForm(false);
      setForm({
        category: "Food",
        monthlyLimit: "",
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const fmt = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

  const getPct = (spent, limit) => Math.min((spent / limit) * 100, 100);

  const getBarColor = (pct) => {
    if (pct >= 90) return "bg-red-500";
    if (pct >= 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getBadgeClass = (pct) => {
    if (pct >= 90) return "bg-red-900 text-red-400";
    if (pct >= 70) return "bg-yellow-900 text-yellow-400";
    return "bg-green-900 text-green-400";
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Budget Tracker</h1>
          <p className="text-slate-400 text-sm mt-1">
            {now.toLocaleString("default", { month: "long" })}{" "}
            {now.getFullYear()}
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700
            text-white px-4 py-2 rounded-xl
            text-sm font-medium transition-all"
        >
          + Add Budget
        </button>
      </div>

      {showForm && (
        <div
          className="bg-slate-800 rounded-2xl p-6
          border border-slate-700"
        >
          <h2 className="text-white font-medium mb-4">New Budget</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <select
              value={form.category}
              onChange={(e) =>
                setForm({
                  ...form,
                  category: e.target.value,
                })
              }
              className="bg-slate-700 text-white
                rounded-xl px-4 py-3 text-sm
                border border-slate-600
                focus:outline-none focus:border-blue-500"
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Monthly Limit (₹)"
              value={form.monthlyLimit}
              onChange={(e) =>
                setForm({
                  ...form,
                  monthlyLimit: e.target.value,
                })
              }
              className="bg-slate-700 text-white
                rounded-xl px-4 py-3 text-sm
                border border-slate-600
                focus:outline-none focus:border-blue-500"
              required
            />
            <div className="col-span-2 flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-blue-600
                  hover:bg-blue-700 text-white py-3
                  rounded-xl text-sm font-medium"
              >
                Create Budget
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-slate-700
                  hover:bg-slate-600 text-white py-3
                  rounded-xl text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div
        className="grid grid-cols-1 md:grid-cols-2
        gap-4"
      >
        {budgets.length === 0 ? (
          <div
            className="col-span-2 bg-slate-800
            rounded-2xl p-8 text-center
            border border-slate-700 text-slate-400
            text-sm"
          >
            No budgets yet. Create your first budget!
          </div>
        ) : (
          budgets.map((b) => {
            const pct = getPct(b.spent, b.monthlyLimit);
            return (
              <div
                key={b.id}
                className="bg-slate-800 rounded-2xl
                  p-5 border border-slate-700"
              >
                <div
                  className="flex justify-between
                  items-center mb-3"
                >
                  <h3 className="text-white font-medium">{b.category}</h3>
                  <span
                    className={`text-xs px-2 py-1
                    rounded-lg ${getBadgeClass(pct)}`}
                  >
                    {pct.toFixed(0)}%
                  </span>
                </div>
                <div
                  className="flex justify-between
                  text-xs text-slate-400 mb-2"
                >
                  <span>Spent: {fmt(b.spent)}</span>
                  <span>Limit: {fmt(b.monthlyLimit)}</span>
                </div>
                <div
                  className="w-full bg-slate-700
                  rounded-full h-2"
                >
                  <div
                    className={`h-2 rounded-full
                      transition-all
                      ${getBarColor(pct)}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
