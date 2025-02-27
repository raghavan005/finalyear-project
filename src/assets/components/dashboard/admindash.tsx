import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUserMd, FaCalendarCheck, FaUsers } from "react-icons/fa";
import { auth } from "../Login/firebase/firebase"; // Adjust path as needed
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null); // Use 'any' or a more specific type
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // Redirect to welcome page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!user) {
    return <div>Loading...</div>; // Or redirect to login
  }

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="sidebar bg-dark text-white p-3 vh-100">
        <h3 className="mb-4">Admin Dashboard</h3>
        <ul className="nav flex-column">
          <li className="nav-item">
            <a href="#" className="nav-link text-white">
              Home
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link text-white">
              Appointments
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link text-white">
              Patients
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link text-white">
              Reports
            </a>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="container p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-0">Welcome, {user.email}</h2>
          </div>
          <div>
            <button className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="mb-4">
          <h4>User Profile</h4>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          {/* Add more user details as needed */}
        </div>

        {/* Animated Cards */}
        <div className="row">
          <motion.div className="col-md-4" whileHover={{ scale: 1.05 }}>
            <div className="card shadow-sm p-3 text-center">
              <FaUserMd size={40} className="text-primary mb-2" />
              <h5>Total Patients</h5>
              <p className="fs-4">120</p>
            </div>
          </motion.div>

          <motion.div className="col-md-4" whileHover={{ scale: 1.05 }}>
            <div className="card shadow-sm p-3 text-center">
              <FaCalendarCheck size={40} className="text-success mb-2" />
              <h5>Appointments Today</h5>
              <p className="fs-4">15</p>
            </div>
          </motion.div>

          <motion.div className="col-md-4" whileHover={{ scale: 1.05 }}>
            <div className="card shadow-sm p-3 text-center">
              <FaUsers size={40} className="text-warning mb-2" />
              <h5>Attendance</h5>
              <p className="fs-4">90%</p>
            </div>
          </motion.div>
        </div>

        {/* Recent Activities Table */}
        <div className="mt-5">
          <h4>Recent Activities</h4>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Appointment Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>John Doe</td>
                <td>10:30 AM</td>
                <td className="text-success">Completed</td>
              </tr>
              <tr>
                <td>Jane Smith</td>
                <td>11:00 AM</td>
                <td className="text-warning">Pending</td>
              </tr>
              <tr>
                <td>Alex Johnson</td>
                <td>12:00 PM</td>
                <td className="text-danger">Cancelled</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
