import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(sessionStorage.getItem("user") || "null"),
  );
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  const loginUser = (userData, isNew = false) => {
    sessionStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setIsFirstLogin(isNew);
  };

  const logoutUser = () => {
    sessionStorage.removeItem("user");
    setUser(null);
    setIsFirstLogin(false);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser, isFirstLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
