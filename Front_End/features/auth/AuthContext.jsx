import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "../../lib/axios";
import toast from "react-hot-toast";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("auth_token"));
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const authHeaders = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : {}),
    [token],
  );

  useEffect(() => {
    const loadCurrentUser = async () => {
      if (!token) {
        setIsAuthLoading(false);
        return;
      }

      try {
        const response = await axios.get("/api/auth/me", {
          headers: authHeaders,
        });
        setUser(response.data?.user || null);
      } catch {
        localStorage.removeItem("auth_token");
        setToken(null);
        setUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    };

    loadCurrentUser();
  }, [token, authHeaders]);

  const register = async ({ name, email, password }) => {
    const response = await axios.post("/api/auth/register", {
      name,
      email,
      password,
    });

    const nextToken = response.data?.token;
    const nextUser = response.data?.user;

    if (!nextToken || !nextUser) {
      throw new Error("Invalid register response");
    }

    localStorage.setItem("auth_token", nextToken);
    setToken(nextToken);
    setUser(nextUser);
    toast.success("Account created");
    return nextUser;
  };

  const login = async ({ email, password }) => {
    const response = await axios.post("/api/auth/login", {
      email,
      password,
    });

    const nextToken = response.data?.token;
    const nextUser = response.data?.user;

    if (!nextToken || !nextUser) {
      throw new Error("Invalid login response");
    }

    localStorage.setItem("auth_token", nextToken);
    setToken(nextToken);
    setUser(nextUser);
    toast.success("Logged in successfully");
    return nextUser;
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setToken(null);
    setUser(null);
    toast.success("Logged out");
  };

  const updateProfile = async (payload) => {
    const response = await axios.put("/api/auth/me", payload, {
      headers: authHeaders,
    });
    const nextUser = response.data?.user;
    setUser(nextUser || null);
    toast.success("Profile updated");
    return nextUser;
  };

  const deleteAccount = async () => {
    await axios.delete("/api/auth/me", {
      headers: authHeaders,
    });

    localStorage.removeItem("auth_token");
    setToken(null);
    setUser(null);
    toast.success("Account deleted");
  };

  const value = {
    token,
    authHeaders,
    user,
    isAuthenticated: Boolean(token && user),
    isAuthLoading,
    login,
    register,
    logout,
    updateProfile,
    deleteAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
