import React, { useState } from "react";
import { db } from "../Login/firebase/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { motion } from "framer-motion";

const DoctorShiftReport: React.FC = () => {
  // State for Patient Details
  const [patientsSeen, setPatientsSeen] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");

  // State for Stock Shortage
  const medicalSupplies = [
    "Antibiotics",
    "Painkillers",
    "Syringes",
    "IV Fluids",
    "Gloves",
    "Masks",
  ];

  const [shortages, setShortages] = useState<
    { item: string; quantity: number }[]
  >([]);

  // Function to handle item selection
  const handleItemChange = (item: string) => {
    setShortages((prev) => {
      if (prev.some((s) => s.item === item)) {
        return prev.filter((s) => s.item !== item); // Remove item if already selected
      } else {
        return [...prev, { item, quantity: 1 }]; // Add item with default quantity
      }
    });
  };

  // Function to update quantity for a selected item
  const handleQuantityChange = (item: string, quantity: number) => {
    setShortages((prev) =>
      prev.map((s) => (s.item === item ? { ...s, quantity } : s))
    );
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    if (patientsSeen < 0) {
      alert("Patients count cannot be negative.");
      return;
    }

    if (shortages.length === 0 && !notes) {
      alert(
        "Please enter either patient details or stock shortage information."
      );
      return;
    }

    try {
      await addDoc(collection(db, "doctor_reports"), {
        patientsSeen,
        shortages,
        notes,
        doctorID: "doctor_123", // Replace with actual doctor ID from auth
        date: Timestamp.now(),
      });

      alert("Report submitted successfully!");
      setPatientsSeen(0);
      setShortages([]);
      setNotes("");
    } catch (error) {
      console.error("Error submitting report: ", error);
    }
  };

  return (
    <motion.div
      className="container mt-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 style={{ color: "grey" }}>Doctor Shift Report</h2>

      {/* Patient Details Section */}
      <motion.div
        className="card p-3 shadow-sm mb-4"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <h3 style={{ color: "blue" }}>Patient Details</h3>

        <label className="form-label" style={{ color: "grey" }}>
          Number of Patients Seen:
        </label>
        <input
          type="number"
          className="form-control"
          value={patientsSeen}
          onChange={(e) => setPatientsSeen(Number(e.target.value))}
          min="0"
          style={{ borderColor: "lightgrey", color: "grey" }}
        />

        <label className="form-label mt-3" style={{ color: "grey" }}>
          Additional Notes:
        </label>
        <textarea
          className="form-control"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={{ borderColor: "lightgrey", color: "grey" }}
        ></textarea>
      </motion.div>

      {/* Stock Shortage Section */}
      <motion.div
        className="card p-3 shadow-sm mb-4"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <h3 style={{ color: "blue" }}>Stock Shortage</h3>

        <label className="form-label" style={{ color: "grey" }}>
          Select Medical Supplies Shortage:
        </label>
        {medicalSupplies.map((supply) => (
          <div key={supply} className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              checked={shortages.some((s) => s.item === supply)}
              onChange={() => handleItemChange(supply)}
            />
            <label className="form-check-label" style={{ color: "grey" }}>
              {supply}
            </label>
          </div>
        ))}

        {shortages.map((shortage) => (
          <div key={shortage.item} className="mt-2">
            <label className="form-label" style={{ color: "grey" }}>
              Quantity needed for {shortage.item}:
            </label>
            <input
              type="number"
              className="form-control"
              value={shortage.quantity}
              min="1"
              onChange={(e) =>
                handleQuantityChange(shortage.item, Number(e.target.value))
              }
              style={{ borderColor: "lightgrey", color: "grey" }}
            />
          </div>
        ))}
      </motion.div>

      {/* Submit Button */}
      <motion.button
        className="btn btn-primary mt-3 w-100"
        onClick={handleSubmit}
        whileHover={{ backgroundColor: "#2979ff" }}
        transition={{ duration: 0.3 }}
      >
        Submit Report
      </motion.button>
    </motion.div>
  );
};

export default DoctorShiftReport;
