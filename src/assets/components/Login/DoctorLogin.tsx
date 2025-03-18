import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./DoctorLogin.css"; // Keep this, as we'll modify it
import logo from "../../images/Screenshot_2025-02-26_135248-removebg-preview.png";
import googleLogo from "../../images/icons8-google-400.png";
import Waves from "../welcome/animation/lightining/waves";
import {
  auth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  getFirestore,
  doc,
  getDoc,
} from "../Login/firebase/firebase";

const DoctorLogin: React.FC = () => {
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
      const userCredential = await signInWithEmailAndPassword(
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
      const userCredential = await signInWithPopup(auth, provider);
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
    } catch (error: any) {
      console.error("Google Sign-In failed:", error.message);
      setErrorMessage(error.message);
    }
    setIsLoading(false);
  };

  const handleRegisterClick = () => {
    navigate("/doctor/register"); // Navigate directly to DoctorRegister
  };

  return (
    <div className="doctorLogin_container">
      <div className="doctorLogin_wavesBackground">
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

      <motion.form
        className="doctorLogin_form"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <motion.img
          src={logo}
          alt="Providance Logo"
          className="doctorLogin_logo"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
        <h2 className="doctorLogin_title">Doctor Login</h2>
        {errorMessage && (
          <p className="doctorLogin_errorMessage">{errorMessage}</p>
        )}
        <div className="doctorLogin_formGroup">
          <label htmlFor="email" className="doctorLogin_label">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="doctorLogin_input"
          />
        </div>
        <div className="doctorLogin_formGroup">
          <label htmlFor="password" className="doctorLogin_label">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="doctorLogin_input"
          />
        </div>
        <motion.button
          type="submit"
          className="doctorLogin_button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </motion.button>
        <motion.div
          className="doctorLogin_googleSigninContainer"
          onClick={handleGoogleSignIn}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.img
            src={googleLogo}
            alt="Google Sign-In"
            className="doctorLogin_googleSigninImage"
          />
          <h1 className="doctorLogin_googleSigninText">Sign in with Google</h1>
        </motion.div>
        <motion.button
          type="button"
          className="doctorLogin_registerButton"
          onClick={handleRegisterClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Register
        </motion.button>
      </motion.form>
    </div>
  );
};

export default DoctorLogin;
