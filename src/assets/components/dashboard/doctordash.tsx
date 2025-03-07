import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./doctordash.css";
import img from "../../images/Screenshot_2025-02-26_135248-removebg-preview.png";

const Home = () => <div className="content-container">Home Content</div>;
const Attendance = () => (
  <div className="content-container">Attendance Content</div>
);
const Report = () => <div className="content-container">Report Content</div>;
const PatientDetails = () => (
  <div className="content-container">Patient Details Content</div>
);

const HealthConnectDashboard = () => {
  const [activeTab, setActiveTab] = useState("Home");

  const renderContent = () => {
    switch (activeTab) {
      case "Home":
        return <Home />;
      case "Attendance":
        return <Attendance />;
      case "Report":
        return <Report />;
      case "PatientDetails":
        return <PatientDetails />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="sidebar-title">Doctor Dashboard</h2>
        <div className="sidebar-menu">
          <button className="sidebar-item" onClick={() => setActiveTab("Home")}>
            Home
          </button>
          <button
            className="sidebar-item"
            onClick={() => setActiveTab("Attendance")}
          >
            Attendance
          </button>
          <button
            className="sidebar-item"
            onClick={() => setActiveTab("Report")}
          >
            Report
          </button>
          <button
            className="sidebar-item"
            onClick={() => setActiveTab("PatientDetails")}
          >
            Patient Details
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Navigation Bar */}
        <div className="navbar-custom">
          <div className="navbar-logo-container">
            <img src={img} alt="Health Connect" className="navbar-logo" />
          </div>
          <FaUserCircle className="fs-1 text-dark" />
        </div>

        {/* Content Area */}
        <main className="content-area">{renderContent()}</main>
      </div>
    </div>
  );
};

export default HealthConnectDashboard;
