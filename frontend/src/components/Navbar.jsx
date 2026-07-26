import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/dashboard", icon: "🏠", label: "Home" },
  { to: "/transactions", icon: "💸", label: "Transactions" },
  { to: "/recurring", icon: "🔄", label: "Recurring" },
  { to: "/budget", icon: "🎯", label: "Budget" },
  { to: "/chat", icon: "🤖", label: "AI Chat" },
  { to: "/profile", icon: "👤", label: "Profile" },
];

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  const goHome = () => {
    navigate("/dashboard");
    setOpen(false);
  };

  return (
    <>
      {/* Mobile top bar */}
      <div className="xl:hidden fixed top-0 left-0 right-0 z-50 bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center justify-between">
        <div
          onClick={goHome}
          className="flex items-center gap-2 cursor-pointer"
        >
          <span className="text-xl">💰</span>
          <span className="font-bold text-white">FinanceAI</span>
        </div>
        <button onClick={() => setOpen(!open)} className="text-white text-2xl">
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu overlay */}
      {open && (
        <div
          className="xl:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed top-0 left-0 h-full z-50
        w-56 bg-slate-800 border-r border-slate-700
        flex flex-col p-4
        transition-transform duration-300
        xl:translate-x-0
        ${open ? "translate-x-0" : "-translate-x-full xl:translate-x-0"}
      `}
      >
        {/* Logo — clickable → goes to Home */}
        <div
          onClick={goHome}
          className="flex items-center gap-2 mb-8 px-2 mt-2 xl:mt-0 cursor-pointer group"
        >
          <span className="text-2xl group-hover:scale-110 transition-transform">
            💰
          </span>
          <div>
            <span className="font-bold text-white text-lg group-hover:text-blue-400 transition-colors">
              Finance
            </span>
            <span className="font-bold text-blue-400 text-lg group-hover:text-blue-300 transition-colors">
              AI
            </span>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium bg-blue-600 text-white"
                  : "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-700 hover:text-white"
              }
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-700 pt-4">
          <div className="flex items-center gap-3 px-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
              {user?.fullName?.charAt(0) || "U"}
            </div>
            <div>
              <p className="text-white text-xs font-medium truncate w-32">
                {user?.fullName || "User"}
              </p>
              <p className="text-slate-400 text-xs truncate w-32">
                {user?.email || ""}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-slate-400 hover:text-white hover:bg-slate-700 py-2 rounded-xl text-sm transition-all"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="xl:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-800 border-t border-slate-700 flex justify-around py-2">
        {links.slice(0, 5).map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-xs
              ${isActive ? "text-blue-400" : "text-slate-500"}`
            }
          >
            <span className="text-lg">{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </div>
    </>
  );
}
