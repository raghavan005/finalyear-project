// WelcomePage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUserShield, FaUserMd, FaHeartbeat } from "react-icons/fa";
import "./welcom.css"; // Import your CSS file

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleAdminLogin = () => navigate("/admin/login");
  const handleDoctorLogin = () => navigate("/doctor/login");

  return (
    <div className="welcome-container">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="welcome-content"
      >
        {/* Animated Welcome Text */}
        <h1 className="welcome-title">
          Welcome to the Healthcare Monitoring System
        </h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="welcome-description"
        >
          Monitor real-time healthcare services, track doctor attendance, and
          manage facilities efficiently.
        </motion.p>

        {/* Login Buttons */}
        <div className="button-container">
          <motion.button
            className="admin-button"
            onClick={handleAdminLogin}
            whileHover={{ scale: 1.1 }}
          >
            <FaUserShield size={24} /> Admin Login
          </motion.button>
          <motion.button
            className="doctor-button"
            onClick={handleDoctorLogin}
            whileHover={{ scale: 1.1 }}
          >
            <FaUserMd size={24} /> Doctor Login
          </motion.button>
        </div>

        {/* Feature Highlights */}
        <div className="features-section">
          <motion.div
            className="feature-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <FaHeartbeat size={40} className="feature-icon" />
            <h3>Live Monitoring</h3>
            <p>
              Get real-time updates on doctor availability and patient stats.
            </p>
          </motion.div>
          <motion.div
            className="feature-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <FaUserMd size={40} className="feature-icon" />
            <h3>Doctor Tracking</h3>
            <p>Check attendance records and manage shifts effortlessly.</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default WelcomePage;
