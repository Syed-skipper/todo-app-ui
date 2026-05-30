"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import { authApi } from "../../lib/api";
import "./login.css";

export default function Login() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const saveSession = (res) => {
    const d = res.data?.data || res.data;
    localStorage.setItem("token", d.token);
    localStorage.setItem("user_id", d.user_id || d.user?._id);
    localStorage.setItem("user_name", d.user_name || d.user?.name);
    localStorage.setItem("role", d.role || d.user?.role);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await authApi.login({ email, password });
      saveSession(response.data);
      router.push("/dashboard");
    } catch {
      setError("Invalid email or password");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    try {
      const response = await authApi.register({ name, email, password });
      saveSession(response.data);
      router.push("/dashboard");
    } catch {
      setError("Failed to register. Email may already exist.");
    }
  };

  return (
    <div className="flex items-center flex-col justify-center min-h-screen p-8 bg-gradient-to-br from-slate-900 to-slate-700">
      <div className="login-container" style={{ maxWidth: 400, width: "100%" }}>
        <h3 style={{ color: "#0f172a", marginBottom: 8 }}>Family Expense Tracker</h3>
        <p style={{ color: "#64748b", marginBottom: 20, fontSize: 14 }}>
          {isLogin ? "Sign in to manage shared credit card expenses" : "Create your family account"}
        </p>
        <h4 style={{ marginBottom: 16 }}>{isLogin ? "Log in" : "Sign up"}</h4>
        <form onSubmit={isLogin ? handleLogin : handleSignUp}>
          {!isLogin && (
            <input type="text" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
          )}
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {!isLogin && (
            <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          )}
          <div style={{ marginBottom: 15 }}>
            <Button type="submit" variant="contained" fullWidth style={{ backgroundColor: "#0f172a" }}>
              {isLogin ? "Login" : "Sign Up"}
            </Button>
          </div>
        </form>
        {error && <p className="error-message">{error}</p>}
        <p onClick={() => { setIsLogin(!isLogin); setError(""); }} className="toggle-link">
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
}
