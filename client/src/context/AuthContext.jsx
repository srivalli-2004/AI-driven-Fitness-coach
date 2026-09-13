import { createContext, useContext, useState, useEffect } from "react";
import apiRequest from "../utils/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("newme_token");
    const savedUser = localStorage.getItem("newme_user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  function login(userData, authToken) {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("newme_token", authToken);
    localStorage.setItem("newme_user", JSON.stringify(userData));
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("newme_token");
    localStorage.removeItem("newme_user");
  }

  async function signup(formData) {
    const data = await apiRequest("/users/signup", { method: "POST", body: formData });
    login(data.user, data.token);

    try {
      await apiRequest("/plans/generate", { method: "POST", token: data.token });
    } catch (err) {
      console.error("Plan generation failed:", err.message);
    }

    return data;
  }

  async function loginWithCredentials(email, password) {
    const data = await apiRequest("/users/login", {
      method: "POST",
      body: { email, password },
    });
    login(data.user, data.token);
    return data;
  }

  return (
    <AuthContext.Provider
      value={{ user, token, loading, signup, loginWithCredentials, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
