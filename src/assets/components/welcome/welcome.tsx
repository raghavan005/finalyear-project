import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUserShield, FaUserMd, FaHeartbeat } from "react-icons/fa";
import "./welcome.css";
import logo from "../../images/Screenshot_2025-02-26_135248-removebg-preview.png";
import VariableProximity from "./animation/BlurText";
import Waves from "./animation/lightining/waves";
import { CircularProgress } from "@heroui/react";

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  return (
    <div className="welcome-container">
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
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="welcome-content"
      >
        {/* Logo Section */}
        <motion.img
          src={logo}
          alt="Healthcare Logo"
          className="logo"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Animated Welcome Text */}
        <h1 className="welcome-title">
          <div ref={containerRef} style={{ position: "relative" }}>
            <VariableProximity
              label="Welcome to the Future of Healthcare Monitoring – Where Precision Meets Efficiency"
              className="variable-proximity-demo"
              fromFontVariationSettings="'wght' 400, 'opsz' 9"
              toFontVariationSettings="'wght' 1000, 'opsz' 40"
              containerRef={containerRef}
              radius={100}
              falloff="linear"
            />
          </div>
        </h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="welcome-description"
        >
          <VariableProximity
            label=" Monitor real-time healthcare services, track doctor attendance, and manage facilities efficiently."
            className="variable-proximity-demo"
            fromFontVariationSettings="'wght' 400, 'opsz' 9"
            toFontVariationSettings="'wght' 1000, 'opsz' 40"
            containerRef={containerRef}
            radius={100}
            falloff="linear"
          />
        </motion.p>

        {/* Login Buttons */}
        <div className="button-container">
          <motion.button
            className="admin-button"
            onClick={() => navigate("/admin/login")}
            whileHover={{ scale: 1.1 }}
          >
            <FaUserShield size={24} /> Admin Login
          </motion.button>
          <motion.button
            className="doctor-button"
            onClick={() => navigate("/doctor/login")}
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
              <VariableProximity
                label=" Get real-time updates on doctor availability and patient stats."
                className="variable-proximity-demo"
                fromFontVariationSettings="'wght' 400, 'opsz' 9"
                toFontVariationSettings="'wght' 1000, 'opsz' 40"
                containerRef={containerRef}
                radius={100}
                falloff="linear"
              />
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
            <p>
              {" "}
              <VariableProximity
                label="Check attendance records and manage shifts effortlessly."
                className="variable-proximity-demo"
                fromFontVariationSettings="'wght' 400, 'opsz' 9"
                toFontVariationSettings="'wght' 1000, 'opsz' 40"
                containerRef={containerRef}
                radius={100}
                falloff="linear"
              />
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default WelcomePage;
