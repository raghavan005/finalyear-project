import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./doctorRegister.css";
import logo from "../../images/Screenshot_2025-02-26_135248-removebg-preview.png";
import googleLogo from "../../images/icons8-google-400.png";
import Waves from "../welcome/animation/lightining/waves";
import {
  auth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  getFirestore,
  doc,
  getDoc,
} from "./firebase/firebase";

const DoctorRegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      if (user) {
        const db = getFirestore();
        const doctorDocRef = doc(db, "doctors", user.uid);
        const doctorDoc = await getDoc(doctorDocRef);

        if (doctorDoc.exists()) {
          navigate("/doctor-dashboard");
        } else {
          navigate("/doctor-details");
        }
      }
      console.log("Doctor registration successful!");
    } catch (error) {
      console.error("Doctor registration failed:", error.message);
      setErrorMessage(error.message);
    }

    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const userCredential = await signInWithPopup(
        auth,
        new GoogleAuthProvider()
      );
      const user = userCredential.user;
      if (user) {
        const db = getFirestore();
        const doctorDocRef = doc(db, "doctors", user.uid);
        const doctorDoc = await getDoc(doctorDocRef);

        if (doctorDoc.exists()) {
          navigate("/doctor-dashboard");
        } else {
          navigate("/doctor-details");
        }
      }
      console.log("Doctor Google Sign-Up successful!");
    } catch (error) {
      console.error("Doctor Google Sign-Up failed:", error.message);
      setErrorMessage(error.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="doctor-register-page">
      <div className="doctor-register-container">
        <div className="doctor-waves-background">
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
          className="doctor-register-content"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.form
            className="doctor-register-form"
            onSubmit={handleRegister}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.img
              src={logo}
              alt="Doctor Logo"
              className="doctor-register-logo"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            />

            <h2>Doctor Register</h2>
            {errorMessage && (
              <p className="doctor-error-message">{errorMessage}</p>
            )}

            <div className="doctor-form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="doctor-form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="doctor-form-group">
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
              className="doctor-register-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Register"}
            </motion.button>

            <motion.div
              className="doctor-google-signin-container"
              onClick={handleGoogleSignIn}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.img
                src={googleLogo}
                alt="Google Sign-In"
                className="doctor-google-signin"
              />
              <h1 className="doctor-google-signin-text">Sign up with Google</h1>
            </motion.div>

            <motion.button
              type="button"
              className="doctor-login-redirect-button"
              onClick={() => navigate("/doctor/login")}
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

export default DoctorRegisterForm;
