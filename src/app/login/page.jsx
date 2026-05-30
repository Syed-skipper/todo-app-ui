"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import { authApi } from "../../lib/api";
import "./login.css";

export default function Login() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    setError("");
    try {
      const response = await authApi.login({ email, password });
      saveSession(response.data);
      router.push("/dashboard");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await authApi.register({ name, email, password });
      saveSession(response.data);
      router.push("/dashboard");
    } catch {
      setError("Failed to register. Email may already exist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-brand">
          <div className="login-brand-icon">
            <AccountBalanceWalletOutlinedIcon sx={{ fontSize: 28 }} />
          </div>
          <h1>Family Expense</h1>
          <p>
            {isLogin
              ? "A calm space to track shared spending together"
              : "Join your family and manage expenses with ease"}
          </p>
        </div>

        <p className="login-form-title">{isLogin ? "Welcome back" : "Create account"}</p>

        <form onSubmit={isLogin ? handleLogin : handleSignUp}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          )}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              py: 1.5,
              mt: 1,
              borderRadius: 3,
              fontSize: "0.95rem",
              boxShadow: "0 4px 14px rgba(107, 144, 128, 0.3)",
            }}
          >
            {loading ? "Please wait…" : isLogin ? "Sign in" : "Create account"}
          </Button>
        </form>

        {error && <p className="error-message">{error}</p>}

        <p
          onClick={() => {
            setIsLogin(!isLogin);
            setError("");
          }}
          className="toggle-link"
        >
          {isLogin ? "New here? Create an account" : "Already have an account? Sign in"}
        </p>
      </div>
    </div>
  );
}
