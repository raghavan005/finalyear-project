import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import "./doctordash.css";
import img from "../../images/Screenshot_2025-02-26_135248-removebg-preview.png";
import RegisterLeave from "../doctor/registerleave"
import ReportContent from "../doctor/Report"
import DoctorShiftReport from "../patients/Patient";
import {
  auth,
  getFirestore,
  doc,
  getDoc,
} from "../Login/firebase/firebase";
import { useNavigate } from "react-router-dom";
import RectangleBox from "../doctor/attadence";
import { FaUserMd } from "react-icons/fa"; // Import the doctor icon
import DoctorAttendance from "../doctor/docdetail"
import { signOut } from "firebase/auth";
const tabVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const Home = () => <motion.div variants={tabVariants}>Home Content</motion.div>;
const Attendance = () => (
  <motion.div variants={tabVariants}>Attendance Content</motion.div>
);
const Report = () => (
  <motion.div variants={tabVariants}>Report Content</motion.div>
);
const PatientDetails = () => (
  <motion.div variants={tabVariants}>Patient Details Content</motion.div>
);

const HealthConnectDashboard = () => {
  const [activeTab, setActiveTab] = useState("Home");
  const [userProfileName, setUserProfileName] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfileName = async () => {
      const user = auth.currentUser;
      if (user) {
        const db = getFirestore();
        const userDoc = await getDoc(doc(db, "doctors", user.uid));
        setUserProfileName(
          userDoc.exists() ? userDoc.data().name || "User" : "User"
        );
      }
    };
    fetchUserProfileName();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "Home":
        return (
          <>
            <DoctorAttendance />
          </>
        );
      case "Attendance":
        return (
          <>
            <RectangleBox />
            <RegisterLeave />
          </>
        );
      case "Report":
        return (
          <>
            <ReportContent />
          </>
        );
      case "Shift-Report":
        return <DoctorShiftReport />;
      default:
        return <Home />;
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

    const handleLogout = async () => {
       try {
         await signOut(auth);
         navigate("/");
       } catch (error) {
         console.error("Logout failed:", error);
       }
     };

  return (
    <div className="dashboard-container d-flex">
      <div className="sidebar d-flex flex-column">
        <h2 className="sidebar-title text-center mb-4">Doctor Dashboard</h2>
        <div className="sidebar-menu d-flex flex-column">
          {["Home", "Attendance", "Report", "Shift-Report"].map((tab) => (
            <motion.button
              key={tab}
              className="sidebar-item text-center mb-2"
              onClick={() => setActiveTab(tab)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0, transition: { duration: 0.3 } }}
            >
              {tab}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="main-content d-flex flex-column">
        <div className="navbar-custom d-flex justify-content-between align-items-center">
          <div className="navbar-logo-container">
            <img src={img} alt="Health Connect" className="navbar-logo" />
          </div>
          <div className="user-dropdown" ref={dropdownRef}>
            <motion.button
              className="user-dropdown-button-rectangle d-flex align-items-center" // Add d-flex and align-items-center
              onClick={toggleDropdown}
              whileHover={{ scale: 1.05 }}
            >
              <FaUserMd className="me-2" /> {/* Doctor icon here */}
              {userProfileName}
            </motion.button>
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  className="user-dropdown-content-rectangle"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <button
                    onClick={handleLogout}
                    className="dropdown-rectangle-button"
                  >
                    Logout
                  </button>
                  <button className="dropdown-rectangle-button">
                    Settings
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <main className="content-area flex-grow-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default HealthConnectDashboard;
