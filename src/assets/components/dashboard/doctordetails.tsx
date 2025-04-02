import React, { useState } from "react";
import { motion } from "framer-motion";
import Stepper, { Step } from "../welcome/animation/stepper/stepper";
import { getFirestore, doc, setDoc } from "../Login/firebase/firebase";
import { auth } from "../Login/firebase/firebase";
import { useNavigate } from "react-router-dom";
import "./doctordetails.css"; // Import the CSS file
import Hyperspeed from "./Hyperspeed";

interface DoctorDetailsProps {}

const DoctorDetails: React.FC<DoctorDetailsProps> = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [hospital, setHospital] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [experience, setExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const tamilNaduDistricts = [
    "Ariyalur",
    "Chennai",
    "Coimbatore",
    "Cuddalore",
    "Dharmapuri",
    "Dindigul",
    "Erode",
    "Kallakurichi",
    "Kanchipuram",
    "Kanyakumari",
    "Karur",
    "Krishnagiri",
    "Madurai",
    "Nagapattinam",
    "Namakkal",
    "Nilgiris",
    "Perambalur",
    "Pudukkottai",
    "Ramanathapuram",
    "Ranipet",
    "Salem",
    "Sivaganga",
    "Tenkasi",
    "Thanjavur",
    "Theni",
    "Thoothukudi",
    "Tiruchirappalli",
    "Tirunelveli",
    "Tirupathur",
    "Tiruppur",
    "Tiruvallur",
    "Tiruvannamalai",
    "Tiruvarur",
    "Vellore",
    "Viluppuram",
    "Virudhunagar",
  ];

  const citiesByDistrict: { [key: string]: string[] } = {
    Chennai: ["Chennai City"],
    Coimbatore: [
      "Coimbatore North",
      "Coimbatore South",
      "Pollachi",
      "Mettupalayam",
    ],
  };

  const hospitalsByCity: { [key: string]: string[] } = {
    "Chennai City": [
      "Primary Health Center (T. Nagar)",
      "Primary Health Center (Velachery)",
    ],
    "Coimbatore North": [
      "Primary Health Center (Ukkadam)",
      "Primary Health Center (Gandhipuram)",
    ],
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDistrict(e.target.value);
    setCity("");
    setHospital("");
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCity(e.target.value);
    setHospital("");
  };

  const handleSubmit = async () => {
    setErrorMessage(null);
    setLoading(true);
    try {
      if (!auth.currentUser) {
        throw new Error("User not authenticated.");
      }

      const userUid = auth.currentUser.uid;
      const db = getFirestore();
      const doctorDocRef = doc(db, "doctors", userUid);

      await setDoc(doctorDocRef, {
        uid: userUid,
        name,
        age,
        gender,
        mobileNumber,
        district,
        city,
        hospital,
        specialization,
        experience,
      });

      console.log("Doctor details saved successfully!");
      navigate("/doctor-dashboard");
    } catch (error: any) {
      console.error("Error saving doctor details:", error.message);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <motion.div
      className="doctor-details-container"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Stepper
        initialStep={1}
        onStepChange={(step) => {
          console.log(step);
        }}
        onFinalStepCompleted={handleSubmit}
        backButtonText="Previous"
        nextButtonText="Next"
      >
        
        <Step>
          <div className="form-group-grid">
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
          </div>
        </Step>
        <Step>
          <div className="form-group-grid">
            <div className="form-group">
              <label htmlFor="district">District:</label>
              <select
                id="district"
                value={district}
                onChange={handleDistrictChange}
                required
              >
                <option value="">Select District</option>
                {tamilNaduDistricts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            {district && (
              <div className="form-group">
                <label htmlFor="city">City:</label>
                <select
                  id="city"
                  value={city}
                  onChange={handleCityChange}
                  required
                >
                  <option value="">Select City</option>
                  {citiesByDistrict[district]?.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {city && (
              <div className="form-group">
                <label htmlFor="hospital">Hospital:</label>
                <select
                  id="hospital"
                  value={hospital}
                  onChange={(e) => setHospital(e.target.value)}
                  required
                >
                  <option value="">Select Hospital</option>
                  {hospitalsByCity[city]?.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </Step>
        <Step>
          <div className="form-group-grid">
            <div className="form-group">
              <label htmlFor="specialization">Specialization:</label>
              <select
                id="specialization"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                required
              >
                <option value="">Select Specialization</option>
                <option value="doctor">Doctor</option>
                <option value="nurse">Nurse</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="experience">Experience:</label>
              <input
                type="number"
                id="experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                required
              />
            </div>
          </div>
        </Step>
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
    </motion.div>
  );
};

export default DoctorDetails;