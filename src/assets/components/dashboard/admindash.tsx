import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUserMd } from "react-icons/fa";
import {
  auth,
  getFirestore,
  doc,
  getDoc,
  getDocs,
  collection,
} from "../Login/firebase/firebase";
import { useNavigate } from "react-router-dom";
import img from "../../images/Screenshot_2025-02-26_135248-removebg-preview.png";
import { signOut } from "firebase/auth"; // Import signOut
import TamilNaduDistricts from "../admin/District"
import MessageDisplay from "../doctor/currentshift";
const HealthConnectDashboard = () => {
  const [activeTab, setActiveTab] = useState("Home");
  const [userProfileName, setUserProfileName] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [doctorDataList, setDoctorDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    const fetchDoctorsData = async () => {
      setLoading(true);
      setError(null);

      try {
        const db = getFirestore();
        const doctorsCollection = collection(db, "doctors");
        const querySnapshot = await getDocs(doctorsCollection);
        const doctors = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDoctorDataList(doctors);
      } catch (e) {
        setError("Error fetching doctors data: " + e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorsData();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "Home":
        return (
          <>
            {loading && <div>Loading...</div>}
            {error && <div>{error}</div>}
            {!loading && !error && (
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Mobile Number</th>
                    <th>District</th>
                    <th>City</th>
                    <th>Hospital</th>
                    <th>Specialization</th>
                    <th>Experience</th>
                  </tr>
                </thead>
                <tbody>
                  {doctorDataList.map((doctor) => (
                    <tr key={doctor.id}>
                      <td>{doctor.name}</td>
                      <td>{doctor.age}</td>
                      <td>{doctor.gender}</td>
                      <td>{doctor.mobileNumber}</td>
                      <td>{doctor.district}</td>
                      <td>{doctor.city}</td>
                      <td>{doctor.hospital}</td>
                      <td>{doctor.specialization}</td>
                      <td>{doctor.experience}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        );
      case "District Attendance":
        return <div><TamilNaduDistricts /></div>;
      case "Report":
          return (
            <>
              <MessageDisplay />
            </>
          );
      case "PatientDetails":
        return <div>Patient Details Content</div>;
      default:
        return <div>Home Content</div>;
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
        <h2 className="sidebar-title text-center mb-4">Admin Dashboard</h2>
        <div className="sidebar-menu d-flex flex-column">
          {["Home", "District Attendance", "Report", "PatientDetails"].map((tab) => (
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
              className="user-dropdown-button-rectangle d-flex align-items-center"
              onClick={toggleDropdown}
              whileHover={{ scale: 1.05 }}
            >
              <FaUserMd className="me-2" />
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
