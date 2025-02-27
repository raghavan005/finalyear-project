import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./AdminLogin.css";
import logo from "../../images/Screenshot_2025-02-26_135248-removebg-preview.png";
import googleLogo from "../../images/icons8-google-400.png";
import {
  auth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "./firebase/firebase";
import { useNavigate, useLocation } from "react-router-dom";

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [redirectPath, setRedirectPath] = useState<string>("/admin/login");

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
        onSubmit={handleRegister}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
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
  );
};

export default RegisterForm;
