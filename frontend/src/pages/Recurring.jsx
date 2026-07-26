import { useEffect, useState } from "react";
import {
  createRecurring,
  getRecurring,
  deleteRecurring,
} from "../services/financeService";

const CATEGORIES = [
  "Food",
  "Transport",
  "Entertainment",
  "Utilities",
  "Shopping",
  "Health",
  "Salary",
  "Investment",
  "Other",
];

export default function Recurring() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Utilities",
    type: "EXPENSE",
    description: "",
    dayOfMonth: 1,
  });

  useEffect(() => {
    getRecurring().then(setItems).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newItem = await createRecurring({
        ...form,
        amount: parseFloat(form.amount),
        dayOfMonth: parseInt(form.dayOfMonth),
      });
      setItems([...items, newItem]);
      setForm({
        title: "",
        amount: "",
        category: "Utilities",
        type: "EXPENSE",
        description: "",
        dayOfMonth: 1,
      });
      setShowForm(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Stop this recurring transaction?")) return;
    try {
      await deleteRecurring(id);
      setItems(items.filter((i) => i.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const fmt = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

  const getDaySuffix = (day) => {
    if (day === 1 || day === 21 || day === 31) return `${day}st`;
    if (day === 2 || day === 22) return `${day}nd`;
    if (day === 3 || day === 23) return `${day}rd`;
    return `${day}th`;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Recurring Transactions
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Auto-added every month on the set date
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all"
        >
          + Add Recurring
        </button>
      </div>

      {showForm && (
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <h2 className="text-white font-medium mb-4">
            New Recurring Transaction
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input
              placeholder="Title (e.g. Netflix, Rent)"
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value,
                })
              }
              className="bg-slate-700 text-white rounded-xl px-4 py-3 text-sm border border-slate-600 focus:outline-none focus:border-blue-500"
              required
            />
            <input
              type="number"
              placeholder="Amount"
              value={form.amount}
              onChange={(e) =>
                setForm({
                  ...form,
                  amount: e.target.value,
                })
              }
              className="bg-slate-700 text-white rounded-xl px-4 py-3 text-sm border border-slate-600 focus:outline-none focus:border-blue-500"
              required
            />
            <select
              value={form.category}
              onChange={(e) =>
                setForm({
                  ...form,
                  category: e.target.value,
                })
              }
              className="bg-slate-700 text-white rounded-xl px-4 py-3 text-sm border border-slate-600 focus:outline-none focus:border-blue-500"
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <select
              value={form.type}
              onChange={(e) =>
                setForm({
                  ...form,
                  type: e.target.value,
                })
              }
              className="bg-slate-700 text-white rounded-xl px-4 py-3 text-sm border border-slate-600 focus:outline-none focus:border-blue-500"
            >
              <option value="EXPENSE">Expense</option>
              <option value="INCOME">Income</option>
            </select>
            <div className="col-span-2">
              <label className="text-slate-400 text-xs mb-1 block">
                Day of month to auto-add
              </label>
              <input
                type="number"
                min="1"
                max="28"
                placeholder="Day (1-28)"
                value={form.dayOfMonth}
                onChange={(e) =>
                  setForm({
                    ...form,
                    dayOfMonth: e.target.value,
                  })
                }
                className="w-full bg-slate-700 text-white rounded-xl px-4 py-3 text-sm border border-slate-600 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <input
              placeholder="Description (optional)"
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
              className="bg-slate-700 text-white rounded-xl px-4 py-3 text-sm border border-slate-600 focus:outline-none focus:border-blue-500 col-span-2"
            />
            <div className="col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-sm font-medium disabled:opacity-50"
              >
                {loading ? "Saving..." : "Create Recurring"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.length === 0 ? (
          <div className="col-span-2 bg-slate-800 rounded-2xl p-8 text-center border border-slate-700">
            <div className="text-4xl mb-3">🔄</div>
            <p className="text-slate-400 text-sm">
              No recurring transactions yet.
            </p>
            <p className="text-slate-500 text-xs mt-1">
              Add Netflix, Rent, EMI etc. to auto-track monthly
            </p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="bg-slate-800 rounded-2xl p-5 border border-slate-700"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-white font-medium">{item.title}</h3>
                  <p className="text-slate-400 text-xs mt-0.5">
                    {item.category} · Every {getDaySuffix(item.dayOfMonth)} of
                    month
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-medium ${item.type === "INCOME" ? "text-green-400" : "text-red-400"}`}
                  >
                    {item.type === "INCOME" ? "+" : "-"}
                    {fmt(item.amount)}
                  </span>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-slate-500 hover:text-red-400 transition-all"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-green-900 text-green-400 text-xs px-2 py-0.5 rounded-full">
                  ✅ Active
                </span>
                <span className="text-slate-500 text-xs">
                  Auto-adds on {getDaySuffix(item.dayOfMonth)} every month
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
