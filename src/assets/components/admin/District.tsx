import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TamilNaduDistricts = () => {
  const districts = [
    { name: "Ariyalur" },
    { name: "Chennai" },
    { name: "Coimbatore" },
    { name: "Cuddalore" },
    { name: "Dharmapuri" },
    { name: "Dindigul" },
    { name: "Erode" },
    { name: "Kallakurichi" },
    { name: "Kanchipuram" },
    { name: "Kanyakumari" },
    { name: "Karur" },
    { name: "Krishnagiri" },
    { name: "Madurai" },
    { name: "Mayiladuthurai" },
    { name: "Nagapattinam" },
    { name: "Namakkal" },
    { name: "Nilgiris" },
    { name: "Perambalur" },
    { name: "Pudukkottai" },
    { name: "Ramanathapuram" },
    { name: "Ranipet" },
    { name: "Salem" },
    { name: "Sivaganga" },
    { name: "Tenkasi" },
    { name: "Thanjavur" },
    { name: "Theni" },
    { name: "Thoothukudi" },
    { name: "Tiruchirappalli" },
    { name: "Tirunelveli" },
    { name: "Tirupathur" },
    { name: "Tiruppur" },
    { name: "Tiruvallur" },
    { name: "Tiruvannamalai" },
    { name: "Tiruvarur" },
    { name: "Vellore" },
    { name: "Viluppuram" },
    { name: "Virudhunagar" },
  ];

  const [selectedDistrict, setSelectedDistrict] = useState(null);

  const containerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "40px",
    padding: "40px",
  };

  const districtStyle = {
    textAlign: "center",
    border: "1px solid #ddd",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
  };

  const popupStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "white",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    zIndex: 1001,
  };

  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.3)",
    backdropFilter: "blur(5px)",
    zIndex: 1000,
  };

  const getRandomValue = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const handleDistrictClick = (districtName) => {
    setSelectedDistrict(districtName);
  };

  const closePopup = () => {
    setSelectedDistrict(null);
  };

  return (
    <div style={containerStyle}>
      {districts.map((district) => (
        <motion.div
          key={district.name}
          style={districtStyle}
          whileHover={{
            scale: 1.05,
            boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.2)",
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
          onClick={() => handleDistrictClick(district.name)}
        >
          <h3>{district.name}</h3>
        </motion.div>
      ))}

      <AnimatePresence>
        {selectedDistrict && (
          <>
            <motion.div
              style={overlayStyle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closePopup}
            />
            <motion.div
              style={popupStyle}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <h2>{selectedDistrict} District Details</h2>
              <p>Number of PHCs: {getRandomValue(10, 50)}</p>
              <p>Available Doctors: {getRandomValue(50, 200)}</p>
              <p>Present Doctors: {getRandomValue(30, 150)}</p>
              <button onClick={closePopup}>Close</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TamilNaduDistricts;
