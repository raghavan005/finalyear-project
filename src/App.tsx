import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from "./assets/components/welcome/welcome";
import AdminLogin from "./assets/components/Login/AdminLogin";
import DoctorLogin from "./assets/components/Login/DoctorLogin";
import Dashboard from "./assets/components/dashboard/admindash";
import Register from "./assets/components/Login/register";
import DoctorDash from "./assets/components/dashboard/doctordash";
import DoctorDetails from "./assets/components/dashboard/doctordetails";
import DoctorRegisterForm from "./assets/components/Login/doctorregister"; 

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/doctor/login" element={<DoctorLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/doctor-details" element={<DoctorDetails />} />
        <Route path="/doctor-dashboard" element={<DoctorDash />} />
        <Route path="/register" element={<Register />} />
        <Route path="/doctor/register" element={<DoctorRegisterForm />} />{" "}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default App;
