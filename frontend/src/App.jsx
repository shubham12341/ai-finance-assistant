import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import BudgetAlert from "./components/BudgetAlert";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import AiChat from "./pages/AiChat";
import Budget from "./pages/Budget";
import Profile from "./pages/Profile";
import Recurring from "./pages/Recurring";

const ProtectedLayout = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" />;
  return (
    <div className="flex min-h-screen bg-slate-900">
      <Navbar />
      <main
        className="flex-1 overflow-y-auto
        xl:ml-56 mt-14 xl:mt-0 mb-16 xl:mb-0"
      >
        <BudgetAlert />
        {children}
      </main>
    </div>
  );
};

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Navigate to="/dashboard" /> : <Login />}
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedLayout>
            <Dashboard />
          </ProtectedLayout>
        }
      />
      <Route
        path="/transactions"
        element={
          <ProtectedLayout>
            <Transactions />
          </ProtectedLayout>
        }
      />
      <Route
        path="/recurring"
        element={
          <ProtectedLayout>
            <Recurring />
          </ProtectedLayout>
        }
      />
      <Route
        path="/chat"
        element={
          <ProtectedLayout>
            <AiChat />
          </ProtectedLayout>
        }
      />
      <Route
        path="/budget"
        element={
          <ProtectedLayout>
            <Budget />
          </ProtectedLayout>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedLayout>
            <Profile />
          </ProtectedLayout>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
