import React, { useState } from "react";
import { motion } from "framer-motion";
import "./AdminLogin.css";
import logo from "../../images/Screenshot_2025-02-26_135248-removebg-preview.png";
import googleLogo from "../../images/icons8-google-400.png";
import {
  auth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "./firebase/firebase";
import { useNavigate } from "react-router-dom";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Logged in successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login failed:", error.message);
      setErrorMessage(error.message);
    }
    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      console.log("Google Sign-In successful!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Google Sign-In failed:", error.message);
      setErrorMessage(error.message);
    }
    setIsLoading(false);
  };

  const handleRegisterClick = () => {
    navigate("/register", { state: { from: "admin" } });
  };

  return (
    <motion.div
      className="login-container"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.img
        src={logo}
        alt="Providance Logo"
        className="login-logo"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />
      <motion.form
        className="login-form"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2>Admin Login</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <motion.button
          type="submit"
          className="login-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </motion.button>
        <motion.div
          className="google-signin-container"
          onClick={handleGoogleSignIn}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.img
            src={googleLogo}
            alt="Google Sign-In"
            className="google-signin"
          />
          <h1 className="google-signin-text">Sign in with Google</h1>
        </motion.div>
        <motion.button
          type="button"
          className="register-button"
          onClick={handleRegisterClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Register
        </motion.button>
      </motion.form>
    </motion.div>
  );
};

export default LoginForm;
