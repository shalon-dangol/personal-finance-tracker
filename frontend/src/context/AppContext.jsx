import { createContext, useContext, useState, useEffect, useRef } from "react";
import API, { setAccessToken, setAuthFailureHandler } from "../services/api";

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // Guards against React StrictMode's double effect run in dev, which
  // would call /refresh twice and rotate the token out from under us.
  const sessionRestored = useRef(false);

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
    const { data } = await API.post("/users/register", {
      name,
      email,
      password,
    });
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
      if (sessionRestored.current) return;
      sessionRestored.current = true;
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

  // When a token refresh fails (session expired/revoked), reset the app to
  // logged-out state so the UI stops calling APIs with a dead token.
  useEffect(() => {
    setAuthFailureHandler(() => {
      setAccessToken(null);
      setUser(null);
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
