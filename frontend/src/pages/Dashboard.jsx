import { useEffect, useState } from "react";
import {
  getMonthlySummary,
  getTransactions,
  getMonthlyTrend,
} from "../services/financeService";
import { useAuth } from "../context/AuthContext";
import { Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return { text: "Good Morning", emoji: "🌅" };
  if (hour >= 12 && hour < 17) return { text: "Good Afternoon", emoji: "☀️" };
  if (hour >= 17 && hour < 21) return { text: "Good Evening", emoji: "🌆" };
  if (hour >= 21 && hour < 24) return { text: "Working Late", emoji: "🌙" };
  // midnight to 5am
  return { text: "Burning Midnight Oil", emoji: "🔥" };
};

const getMotivation = (savingsRate) => {
  if (savingsRate >= 50) return "You're crushing your savings goals! 🚀";
  if (savingsRate >= 30) return "Great progress on your finances! 💪";
  if (savingsRate >= 10) return "Keep going, every rupee counts! 💰";
  return "Let's work on improving your savings! 🎯";
};

const StatCard = ({ title, value, icon, color, sub }) => (
  <div
    className="bg-slate-800 rounded-2xl p-5
    border border-slate-700"
  >
    <div
      className="flex items-center gap-2
      text-slate-400 text-sm mb-3"
    >
      <span>{icon}</span>
      <span>{title}</span>
    </div>
    <div className={`text-2xl font-bold ${color}`}>{value}</div>
    {sub && <div className="text-slate-500 text-xs mt-1">{sub}</div>}
  </div>
);

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [trend, setTrend] = useState([]);
  const { user, isFirstLogin } = useAuth();
  const now = new Date();
  const greeting = getGreeting();
  const firstName = user?.fullName?.split(" ")[0] || "there";

  useEffect(() => {
    getMonthlySummary(now.getMonth() + 1, now.getFullYear())
      .then(setSummary)
      .catch(console.error);
    getTransactions().then(setTransactions).catch(console.error);
    getMonthlyTrend().then(setTrend).catch(console.error);
  }, []);

  const fmt = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

  const categoryMap = {};
  transactions
    .filter((t) => t.type === "EXPENSE")
    .forEach((t) => {
      categoryMap[t.category] =
        (categoryMap[t.category] || 0) + Number(t.amount);
    });

  const donutData = {
    labels: Object.keys(categoryMap),
    datasets: [
      {
        data: Object.values(categoryMap),
        backgroundColor: [
          "#378ADD",
          "#1D9E75",
          "#EF9F27",
          "#E24B4A",
          "#7F77DD",
          "#5DCAA5",
          "#D85A30",
          "#639922",
        ],
        borderWidth: 0,
      },
    ],
  };

  const donutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#94a3b8",
          padding: 12,
          font: { size: 11 },
        },
      },
    },
    cutout: "65%",
  };

  const lineData = {
    labels: trend.map((t) => t.label),
    datasets: [
      {
        label: "Income",
        data: trend.map((t) => t.totalIncome || 0),
        borderColor: "#1D9E75",
        backgroundColor: "rgba(29,158,117,0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#1D9E75",
        pointRadius: 4,
      },
      {
        label: "Expense",
        data: trend.map((t) => t.totalExpense || 0),
        borderColor: "#E24B4A",
        backgroundColor: "rgba(226,75,74,0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#E24B4A",
        pointRadius: 4,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "#94a3b8",
          font: { size: 11 },
        },
      },
    },
    scales: {
      y: {
        ticks: { color: "#94a3b8" },
        grid: { color: "#1e293b" },
      },
      x: {
        ticks: { color: "#94a3b8" },
        grid: { display: false },
      },
    },
  };

  return (
    <div className="p-6 space-y-6">
      {/* Greeting Section */}
      <div
        className="bg-gradient-to-r from-slate-800
        to-slate-700 rounded-2xl p-6
        border border-slate-600"
      >
        <div
          className="flex items-start
          justify-between"
        >
          <div>
            <div
              className="flex items-center
              gap-2 mb-1"
            >
              <span className="text-3xl">{greeting.emoji}</span>
              <h1
                className="text-2xl font-bold
                text-white"
              >
                {greeting.text}, {firstName}!
              </h1>
            </div>

            <p className="text-slate-400 text-sm mt-1">
              {isFirstLogin ? (
                <>
                  Welcome to{" "}
                  <span
                    className="text-blue-400
                    font-medium"
                  >
                    FinanceAI
                  </span>{" "}
                  — your AI-powered finance assistant 🎉
                </>
              ) : (
                <>
                  Welcome back to{" "}
                  <span
                    className="text-blue-400
                    font-medium"
                  >
                    FinanceAI
                  </span>{" "}
                  — your AI-powered finance assistant
                </>
              )}
            </p>

            {isFirstLogin ? (
              <div
                className="mt-3 bg-blue-600
                bg-opacity-20 border border-blue-700
                rounded-xl px-4 py-3"
              >
                <p
                  className="text-blue-400 text-sm
                  font-medium"
                >
                  🎯 Getting started:
                </p>
                <ul
                  className="text-slate-300
                  text-xs mt-1 space-y-1"
                >
                  <li>• Add your first transaction in 💸 Transactions</li>
                  <li>• Set monthly budgets in 🎯 Budget</li>
                  <li>• Ask AI anything in 🤖 AI Chat</li>
                </ul>
              </div>
            ) : (
              <p
                className="text-slate-300 text-sm
                mt-3 font-medium"
              >
                {getMotivation(summary?.savingsRate || 0)}
              </p>
            )}
          </div>

          <div
            className="hidden xl:block text-right
            flex-shrink-0 ml-4"
          >
            <p className="text-slate-400 text-sm">
              {now.toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <p className="text-slate-500 text-xs mt-1">
              {now.toLocaleString("default", { month: "long" })}{" "}
              {now.getFullYear()} overview
            </p>
          </div>
        </div>

        {/* Quick stats pills */}
        {!isFirstLogin && (
          <div className="flex flex-wrap gap-2 mt-4">
            <span
              className="bg-slate-700
              text-slate-300 text-xs px-3 py-1.5
              rounded-full border border-slate-600"
            >
              💸 {transactions.length} transactions
            </span>
            <span
              className="bg-slate-700
              text-slate-300 text-xs px-3 py-1.5
              rounded-full border border-slate-600"
            >
              📊 Savings: {summary?.savingsRate || 0}%
            </span>
            <span
              className={`text-xs px-3 py-1.5
              rounded-full border
              ${
                (summary?.balance || 0) >= 0
                  ? "bg-green-900 text-green-400 border-green-800"
                  : "bg-red-900 text-red-400 border-red-800"
              }`}
            >
              {(summary?.balance || 0) >= 0 ? "✅" : "⚠️"} Balance:{" "}
              {fmt(summary?.balance)}
            </span>
          </div>
        )}
      </div>

      {/* Stat Cards */}
      <div
        className="grid grid-cols-2
        xl:grid-cols-4 gap-4"
      >
        <StatCard
          title="Total Income"
          value={fmt(summary?.totalIncome)}
          icon="📈"
          color="text-green-400"
          sub={now.toLocaleString("default", { month: "long" })}
        />
        <StatCard
          title="Total Expense"
          value={fmt(summary?.totalExpense)}
          icon="📉"
          color="text-red-400"
          sub={`${Object.keys(categoryMap).length} categories`}
        />
        <StatCard
          title="Balance"
          value={fmt(summary?.balance)}
          icon="💰"
          color="text-blue-400"
          sub="Available funds"
        />
        <StatCard
          title="Savings Rate"
          value={`${summary?.savingsRate || 0}%`}
          icon="🎯"
          color="text-yellow-400"
          sub={
            summary?.savingsRate >= 20 ? "Great job! 🌟" : "Try to save more"
          }
        />
      </div>

      {/* Donut + Recent Transactions */}
      <div
        className="grid grid-cols-1
        xl:grid-cols-2 gap-6"
      >
        <div
          className="bg-slate-800 rounded-2xl
          p-5 border border-slate-700"
        >
          <h2 className="text-white font-medium mb-4">Expense by category</h2>
          {Object.keys(categoryMap).length === 0 ? (
            <div
              className="flex flex-col items-center
              justify-center h-48 text-slate-400
              text-sm gap-2"
            >
              <span className="text-3xl">📊</span>
              <span>No expense data yet</span>
              <span className="text-xs text-slate-500">
                Add transactions to see breakdown
              </span>
            </div>
          ) : (
            <div className="flex justify-center">
              <div
                style={{
                  width: "260px",
                  height: "260px",
                }}
              >
                <Doughnut data={donutData} options={donutOptions} />
              </div>
            </div>
          )}
        </div>

        <div
          className="bg-slate-800 rounded-2xl
          p-5 border border-slate-700"
        >
          <h2 className="text-white font-medium mb-4">Recent transactions</h2>
          <div className="space-y-1">
            {transactions.slice(0, 6).map((t) => (
              <div
                key={t.id}
                className="flex items-center
                  justify-between py-2.5 border-b
                  border-slate-700 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full
                    flex items-center justify-center
                    text-sm
                    ${t.type === "INCOME" ? "bg-green-900" : "bg-red-900"}`}
                  >
                    {t.type === "INCOME" ? "📈" : "📉"}
                  </div>
                  <div>
                    <p
                      className="text-white text-sm
                      font-medium"
                    >
                      {t.title}
                    </p>
                    <p
                      className="text-slate-400
                      text-xs mt-0.5"
                    >
                      {t.category}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-sm font-medium
                  ${t.type === "INCOME" ? "text-green-400" : "text-red-400"}`}
                >
                  {t.type === "INCOME" ? "+" : "-"}
                  {fmt(t.amount)}
                </span>
              </div>
            ))}
            {transactions.length === 0 && (
              <div
                className="flex flex-col
                items-center justify-center py-8
                text-slate-400 text-sm gap-2"
              >
                <span className="text-3xl">💸</span>
                <span>No transactions yet</span>
                <span
                  className="text-xs
                  text-slate-500"
                >
                  Add your first transaction
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Line Chart */}
      <div
        className="bg-slate-800 rounded-2xl
        p-5 border border-slate-700"
      >
        <h2 className="text-white font-medium mb-4">
          6 month trend — income vs expense
        </h2>
        {trend.length === 0 ? (
          <div
            className="flex items-center
            justify-center h-48 text-slate-400 text-sm"
          >
            Loading trend data...
          </div>
        ) : (
          <Line data={lineData} options={lineOptions} />
        )}
      </div>
    </div>
  );
}
