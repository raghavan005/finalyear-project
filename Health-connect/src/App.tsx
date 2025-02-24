import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from "./components/welcome/welcome";
import AdminLogin from "./components/Login/AdminLogin"; // Import Admin Login Page
import DoctorLogin from "./components/Login/DoctorLogin"; // Import Doctor Login Page

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/doctor/login" element={<DoctorLogin />} />
        {/* Add more routes if needed */}
      </Routes>
    </Router>
  );
};

export default App;
