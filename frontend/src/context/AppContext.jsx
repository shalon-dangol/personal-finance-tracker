import { createContext, useContext, useState, useEffect, useCallback } from "react";
import API, { setAccessToken } from "../services/api";

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  const applyAuth = (data) => {
    setAccessToken(data.accessToken);
    setUser(data.user);
  };

  const login = async (email, password) => {
    const { data } = await API.post("/users/login", { email, password });
    applyAuth(data);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await API.post("/users/register", { name, email, password });
    applyAuth(data);
    return data;
  };

  const logout = async () => {
    try {
      await API.post("/users/logout");
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { data } = await API.post("/users/refresh");
        applyAuth(data);
      } catch {
        setAccessToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, []);

  return (
    <AppContext.Provider
      value={{ user, setUser, isAuthenticated, isLoading, login, register, logout }}
    >
      {children}
    </AppContext.Provider>
  );
};