import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PixelCard from "../animation/pixelcard";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  onSnapshot,
} from "../Login/firebase/firebase";
import { auth } from "../Login/firebase/firebase";
import useDoctorHolding from "../hooks/doctorholdings";
import "./RegisterLeave.css";
import { motion, AnimatePresence } from "framer-motion";

interface RegisterLeaveProps {
  onLeaveRegistered: (message: string) => void;
  onError: (message: string) => void;
}

const RegisterLeave: React.FC<RegisterLeaveProps> = ({
  onLeaveRegistered,
  onError,
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const [leaveDate, setLeaveDate] = useState<Date | null>(null);
  const [leaveReason, setLeaveReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [doctorData, setDoctorData] = useState<any | null>(null);
  const { loading, error } = useDoctorHolding();

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        if (!auth.currentUser) {
          throw new Error("User not authenticated.");
        }

        const userUid = auth.currentUser.uid;
        const db = getFirestore();
        const docRef = doc(db, "doctors", userUid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setDoctorData(docSnap.data());
        } else {
          setDoctorData(null);
        }
      } catch (err: any) {
        console.error("Error fetching doctor data:", err.message);
        onError(err.message);
      }
    };

    fetchDoctorData();
  }, [onError]);

  useEffect(() => {
    if (!auth.currentUser) return;

    const userUid = auth.currentUser.uid;
    const db = getFirestore();
    const doctorLeaveCollectionRef = collection(db, "doctorleave");

    const unsubscribe = onSnapshot(doctorLeaveCollectionRef, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "modified") {
          const changedData = change.doc.data();
          if (
            changedData.doctorId === userUid &&
            changedData.status === "accepted"
          ) {
            alert("Your leave request has been approved by the admin.");
          }
        }
      });
    });

    return () => unsubscribe();
  }, []);

  const handleLeaveSubmit = async () => {
    if (!leaveDate || leaveReason.trim() === "" || !doctorData) {
      let alertMessage = "Please select a date and enter a reason.";
      if (!doctorData) {
        alertMessage = "Doctor data is not available. Please try again later.";
      }
      alert(alertMessage);
      return;
    }

    setIsSubmitting(true);

    try {
      if (!auth.currentUser) {
        throw new Error("User not authenticated.");
      }

      const userUid = auth.currentUser.uid;
      const db = getFirestore();
      const doctorLeaveCollectionRef = collection(db, "doctorleave");

      await addDoc(doctorLeaveCollectionRef, {
        userId: userUid,
        doctorName: doctorData.name || "Unknown",
        leaveDate: leaveDate,
        leaveReason: leaveReason,
        timestamp: serverTimestamp(),
        hospital: doctorData.hospital,
        speciality: doctorData.specialization,
        contact: doctorData.mobileNumber,
        doctorId: userUid,
      });

      setShowPopup(false);
      onLeaveRegistered("Leave registered successfully.");
    } catch (error: any) {
      console.error("Error registering leave:", error.message);
      onError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    
    <div className="register-leave-container">
      
      <div className="register-leave-card">
        <h2 className="register-leave-title">Doctor Details</h2>
        {loading ? (
          <p>Loading doctor details...</p>
        ) : error ? (
          <p className="register-leave-error">{error}</p>
        ) : doctorData ? (
          <div className="doctor-details">
            <p>
              <strong>Name:</strong> {doctorData.name}
            </p>
            <p>
              <strong>Hospital:</strong> {doctorData.hospital}
            </p>
          </div>
        ) : (
          <p className="no-details">Doctor details not available.</p>
        )}

        <div className="register-leave-button-container">
          <button
            onClick={() => setShowPopup(true)}
            className="register-leave-button"
          >
            Register Leave
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="register-leave-popup"
          >
            <div className="register-leave-popup-content">
              <h2 className="register-leave-popup-title">Register Leave</h2>
              <div className="leave-date-input">
                <label className="leave-label">Leave Date:</label>
                <DatePicker
                  selected={leaveDate}
                  onChange={(date: Date) => setLeaveDate(date)}
                  className="leave-date-picker"
                  placeholderText="Select leave date"
                />
              </div>
              <div className="leave-reason-input">
                <label className="leave-label">Leave Reason:</label>
                <textarea
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  className="leave-reason-textarea"
                  placeholder="Enter leave reason"
                  rows={4}
                />
              </div>
              <div className="popup-button-container">
                <button
                  onClick={handleLeaveSubmit}
                  className={`submit-button ${
                    isSubmitting ? "disabled-button" : ""
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
                <button
                  onClick={() => setShowPopup(false)}
                  className="cancel-button"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RegisterLeave;
