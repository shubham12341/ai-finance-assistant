import { useEffect, useState } from "react";
import {
  addTransaction,
  getTransactions,
  deleteTransaction,
  updateTransaction,
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

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editTx, setEditTx] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Food",
    type: "EXPENSE",
    description: "",
  });

  useEffect(() => {
    getTransactions()
      .then((data) => {
        setTransactions(data);
        setFiltered(data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    let result = [...transactions];
    if (search)
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          t.category.toLowerCase().includes(search.toLowerCase()),
      );
    if (filterType !== "ALL")
      result = result.filter((t) => t.type === filterType);
    if (filterCategory !== "ALL")
      result = result.filter((t) => t.category === filterCategory);
    setFiltered(result);
  }, [search, filterType, filterCategory, transactions]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editTx) {
        const updated = await updateTransaction(editTx.id, {
          ...form,
          amount: parseFloat(form.amount),
        });
        setTransactions(
          transactions.map((t) => (t.id === editTx.id ? updated : t)),
        );
        setEditTx(null);
      } else {
        const newTx = await addTransaction({
          ...form,
          amount: parseFloat(form.amount),
        });
        setTransactions([newTx, ...transactions]);
      }
      setForm({
        title: "",
        amount: "",
        category: "Food",
        type: "EXPENSE",
        description: "",
      });
      setShowForm(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (tx) => {
    setEditTx(tx);
    setForm({
      title: tx.title,
      amount: tx.amount,
      category: tx.category,
      type: tx.type,
      description: tx.description || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    try {
      await deleteTransaction(id);
      setTransactions(transactions.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleExport = () => {
    const headers = [
      "Title",
      "Amount",
      "Type",
      "Category",
      "Description",
      "Date",
    ];
    const rows = filtered.map((t) => [
      t.title,
      t.amount,
      t.type,
      t.category,
      t.description || "",
      new Date(t.transactionDate).toLocaleDateString("en-IN"),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
  };

  const fmt = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Transactions</h1>
          <p className="text-slate-400 text-sm mt-1">
            {filtered.length} transactions
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all"
          >
            📥 Export CSV
          </button>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditTx(null);
              setForm({
                title: "",
                amount: "",
                category: "Food",
                type: "EXPENSE",
                description: "",
              });
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all"
          >
            + Add
          </button>
        </div>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <h2 className="text-white font-medium mb-4">
            {editTx ? "Edit Transaction" : "New Transaction"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="bg-slate-700 text-white rounded-xl px-4 py-3 text-sm border border-slate-600 focus:outline-none focus:border-blue-500"
              required
            />
            <input
              type="number"
              placeholder="Amount"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="bg-slate-700 text-white rounded-xl px-4 py-3 text-sm border border-slate-600 focus:outline-none focus:border-blue-500"
              required
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="bg-slate-700 text-white rounded-xl px-4 py-3 text-sm border border-slate-600 focus:outline-none focus:border-blue-500"
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="bg-slate-700 text-white rounded-xl px-4 py-3 text-sm border border-slate-600 focus:outline-none focus:border-blue-500"
            >
              <option value="EXPENSE">Expense</option>
              <option value="INCOME">Income</option>
            </select>
            <input
              placeholder="Description (optional)"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="bg-slate-700 text-white rounded-xl px-4 py-3 text-sm border border-slate-600 focus:outline-none focus:border-blue-500 col-span-2"
            />
            <div className="col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-sm font-medium disabled:opacity-50"
              >
                {loading ? "Saving..." : editTx ? "Update" : "Add Transaction"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditTx(null);
                }}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search + Filter */}
      <div className="flex flex-wrap gap-3">
        <input
          placeholder="🔍 Search transactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-48 bg-slate-800 text-white rounded-xl px-4 py-2.5 text-sm border border-slate-700 focus:outline-none focus:border-blue-500"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-slate-800 text-white rounded-xl px-4 py-2.5 text-sm border border-slate-700 focus:outline-none"
        >
          <option value="ALL">All Types</option>
          <option value="INCOME">Income</option>
          <option value="EXPENSE">Expense</option>
        </select>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-slate-800 text-white rounded-xl px-4 py-2.5 text-sm border border-slate-700 focus:outline-none"
        >
          <option value="ALL">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Transaction List */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700">
        <div className="divide-y divide-slate-700">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              No transactions found
            </div>
          ) : (
            filtered.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between p-4 hover:bg-slate-750"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${t.type === "INCOME" ? "bg-green-900" : "bg-red-900"}`}
                  >
                    {t.type === "INCOME" ? "📈" : "📉"}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{t.title}</p>
                    <p className="text-slate-400 text-xs">
                      {t.category} ·{" "}
                      {new Date(t.transactionDate).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p
                    className={`font-medium text-sm ${t.type === "INCOME" ? "text-green-400" : "text-red-400"}`}
                  >
                    {t.type === "INCOME" ? "+" : "-"}
                    {fmt(t.amount)}
                  </p>
                  <button
                    onClick={() => handleEdit(t)}
                    className="text-slate-400 hover:text-blue-400 text-xs px-2 py-1 rounded-lg hover:bg-slate-700 transition-all"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="text-slate-400 hover:text-red-400 text-xs px-2 py-1 rounded-lg hover:bg-slate-700 transition-all"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
