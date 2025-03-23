"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Button from "@mui/material/Button";
import config from '../config.json';
import './login.css';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${config.local_url}auth/login`, {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user_id", response.data.user);
      localStorage.setItem("user_name", response.data.user_name);
      router.push("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  const handlePageChange = () => {
    setEmail("");
    setPassword("");
    setError("");
    setIsLogin(!isLogin);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    try {
      await axios.post(`${config.local_url}auth/register`, {
        email,
        password,
      });
      setIsLogin(true);
      setError("");
      alert("Registration successful, you can now log in.");
    } catch (err) {
      setError("Failed to register");
    }
  };

  return (
    <div className="flex items-center flex-col justify-items-center min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <img src="/TODO.png" alt="todo logo" style={{width: '200px'}}/>
      <div className="login-container">
        <h3>{isLogin ? "Log in to todo" : "Sign Up"}</h3>
        <form onSubmit={isLogin ? handleLogin : handleSignUp}>
          <input
            type="email"
            placeholder="Email"
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
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          )}
          <div style={{marginBottom: '15px'}}> 
            <Button type="submit" variant="contained" className="authbutton" style={{backgroundColor: '#202d48'}}>
              {isLogin ? "Login" : "Sign Up"}
            </Button>
          </div>
        </form>

        {error && <p className="error-message">{error}</p>}

        <p onClick={handlePageChange} className="toggle-link">
          {isLogin
            ? "Don't have an account? Sign up"
            : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
}
