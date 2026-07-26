import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = isLogin
        ? await login({
            email: form.email,
            password: form.password,
          })
        : await register(form);

      // Pass true if registering (first time)
      loginUser(data, !isLogin);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-slate-900
      flex items-center justify-center p-4"
    >
      <div
        className="bg-slate-800 rounded-2xl p-8
        w-full max-w-md border border-slate-700"
      >
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">💰</div>
          <h1 className="text-2xl font-bold text-white">FinanceAI</h1>
          <p className="text-slate-400 text-sm mt-1">
            AI-Powered Personal Finance Assistant
          </p>
        </div>

        <div
          className="flex bg-slate-700 rounded-xl
          p-1 mb-6"
        >
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 rounded-lg text-sm
              font-medium transition-all ${
                isLogin ? "bg-blue-600 text-white" : "text-slate-400"
              }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 rounded-lg text-sm
              font-medium transition-all ${
                !isLogin ? "bg-blue-600 text-white" : "text-slate-400"
              }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={form.fullName}
              onChange={(e) =>
                setForm({
                  ...form,
                  fullName: e.target.value,
                })
              }
              className="w-full bg-slate-700 text-white
                rounded-xl px-4 py-3 text-sm
                border border-slate-600
                focus:outline-none focus:border-blue-500"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
            className="w-full bg-slate-700 text-white
              rounded-xl px-4 py-3 text-sm
              border border-slate-600
              focus:outline-none focus:border-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
              })
            }
            className="w-full bg-slate-700 text-white
              rounded-xl px-4 py-3 text-sm
              border border-slate-600
              focus:outline-none focus:border-blue-500"
          />

          {error && (
            <p
              className="text-red-400 text-sm
              text-center"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600
              hover:bg-blue-700 text-white font-medium
              py-3 rounded-xl transition-all
              disabled:opacity-50"
          >
            {loading ? "Please wait..." : isLogin ? "Login" : "Create Account"}
          </button>
        </form>

        <p
          className="text-center text-slate-500
          text-xs mt-6"
        >
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-400 hover:text-blue-300"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
