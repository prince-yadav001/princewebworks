"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Define the type for the context value
interface AuthContextType {
  user: any;
  login: (email: string, password: string) => Promise<void>;
  manualLogin: (user: any) => void;
  logout: () => void;
  loading: boolean;
}

const ADMIN_EMAILS = [
  "princeyadavshyam@gmail.com",
  "princebhai0045@gmail.com",
];

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // This logic is for when the page reloads.
    // It checks if user data is in localStorage.
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Could not parse user from localStorage", e);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const handleRedirect = (user: any) => {
    if (user && user.email && ADMIN_EMAILS.includes(user.email)) {
      router.push("/dashboard");
    } else if (user && user.id) {
      router.push(`/${user.id}/dashboard`);
    } else {
      // Fallback to login if user object is not as expected
      router.push('/login');
    }
  };

  const login = async (email: string, password: string) => {
    // This is for the standard login page
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      // On successful login, save user to state and localStorage
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      handleRedirect(data.user);
    } else {
      throw new Error(data.message || "Login failed");
    }
  };

  const manualLogin = (userData: any) => {
    // This is used after OTP verification to log the user in
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    handleRedirect(userData);
  };

  const logout = () => {
    // Clear user from state and localStorage
    setUser(null);
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, manualLogin, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
