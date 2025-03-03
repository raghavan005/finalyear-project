import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Waves from "../welcome/animation/lightining/waves"; // Importing Waves animation
import "./AdminLogin.css";
import logo from "../../images/Screenshot_2025-02-26_135248-removebg-preview.png";
import googleLogo from "../../images/icons8-google-400.png";
import {
  auth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "./firebase/firebase";

const AdminLoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Admin logged in successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Admin login failed:", error.message);
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
    <div className="admin-login-container">
      {/* Waves Background */}
      <div className="admin-waves-background">
        <Waves
          lineColor="#fff"
          backgroundColor="rgba(255, 255, 255, 0.2)"
          waveSpeedX={0.02}
          waveSpeedY={0.01}
          waveAmpX={40}
          waveAmpY={20}
          friction={0.9}
          tension={0.01}
          maxCursorMove={120}
          xGap={12}
          yGap={36}
        />
      </div>

      {/* Admin Login Form */}
      <motion.div
        className="admin-login-form"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.img
          src={logo}
          alt="Providance Logo"
          className="admin-login-logo"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
        <motion.form
          className="admin-login-form-content"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2>Admin Login</h2>
          {errorMessage && (
            <p className="admin-error-message">{errorMessage}</p>
          )}
          <div className="admin-form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="admin-form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <motion.button
            type="submit"
            className="admin-login-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </motion.button>
          <motion.div
            className="admin-google-signin-container"
            onClick={handleGoogleSignIn}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.img
              src={googleLogo}
              alt="Google Sign-In"
              className="admin-google-signin"
            />
            <p className="admin-google-signin-text">Sign in with Google</p>
          </motion.div>
          <motion.button
            type="button"
            className="admin-register-button"
            onClick={handleRegisterClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Register
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default AdminLoginForm;
