// DoctorDetailsComponent.tsx
import React from "react";
import useDoctorHolding from "../hooks/doctorholdings"; // Adjust the path
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Stepper, { Step } from "../welcome/animation/stepper/stepper";
import { useState } from "react";

const DoctorDetailsComponent = () => {
  const { saveDoctorDetails, loading, error } = useDoctorHolding();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [hospital, setHospital] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [experience, setExperience] = useState("");

  const handleSubmit = async () => {
    const details = {
      name,
      age,
      gender,
      mobileNumber,
      district,
      city,
      hospital,
      specialization,
      experience,
    };

    const errorMessage = await saveDoctorDetails(details);
    if (!errorMessage) {
      navigate("/doctor-dashboard");
    }
  };

  return (
    <motion.div>
      <Stepper
        initialStep={1}
        onFinalStepCompleted={handleSubmit}
        backButtonText="Previous"
        nextButtonText="Next"
      >
        {/* Your Stepper Steps with input fields */}
        <Step>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="age">Age:</label>
            <input
              type="number"
              id="age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="gender">Gender:</label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="mobileNumber">Mobile Number:</label>
            <input
              type="tel"
              id="mobileNumber"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              required
            />
          </div>
        </Step>
        {/* add other steps*/}
        <Step>
          <h2>Final Step</h2>
          <p>Click "Finish" to save your details.</p>
          <motion.button
            type="button"
            className="submit-button"
            onClick={handleSubmit}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            {loading ? "Saving..." : "Finish"}
          </motion.button>
        </Step>
      </Stepper>
      {error && <p className="error-message">{error}</p>}
    </motion.div>
  );
};

export default DoctorDetailsComponent;
