import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userId = localStorage.getItem("userId");
      if (userId) setUser({ userId: userId });
      setLoading(false);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    if (userData && userData.userId) {
      localStorage.setItem("userId", userData.userId);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.clear("userId");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
