import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import "./register.css";
import logo from "../../images/Screenshot_2025-02-26_135248-removebg-preview.png";
import googleLogo from "../../images/icons8-google-400.png";
import Waves from "../welcome/animation/lightining/waves"; // Import Waves animation

import {
  auth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "./firebase/firebase";

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [redirectPath, setRedirectPath] = useState<string>("/admin/login");

  const containerRef = useRef(null);

  useEffect(() => {
    const fromDoctorLogin = location.state && location.state.from === "doctor";
    if (fromDoctorLogin) {
      setRedirectPath("/doctor/login");
    } else {
      setRedirectPath("/admin/login");
    }
  }, [location.state]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log("Registration successful!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Registration failed:", error.message);
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
      console.log("Google Sign-Up successful!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Google Sign-Up failed:", error.message);
      setErrorMessage(error.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="register-page">
      <div className="login-container">
        {/* Waves Background */}
        <div className="waves-background">
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

        <motion.div
          className="login-content"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.form
            className="login-form"
            onSubmit={handleRegister}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.img
              src={logo}
              alt="Providance Logo"
              className="login-logo"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            />

            <h2>Register</h2>
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

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {isLoading ? "Registering..." : "Register"}
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
              <h1 className="google-signin-text">Sign up with Google</h1>
            </motion.div>

            <motion.button
              type="button"
              className="register-button"
              onClick={() => navigate(redirectPath)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Already have an account? Login
            </motion.button>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );

};

export default RegisterForm;
