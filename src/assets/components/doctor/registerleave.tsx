import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "../Login/firebase/firebase";
import { auth } from "../Login/firebase/firebase";
import useDoctorHolding from "../hooks/doctorholdings"; // Import the hook

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
  const [doctorData, setDoctorData] = useState<any | null>(null); // Store entire doctor data
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
          setDoctorData(docSnap.data()); // Store entire doctor data
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

  const handleLeaveSubmit = async () => {
    if (!leaveDate || !leaveReason || !doctorData) {
      alert(
        "Please select a date and enter a reason. Doctor information not loaded."
      );
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Doctor Details</h2>
        {loading ? (
          <p>Loading doctor details...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : doctorData ? (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <p>
              <strong>Name:</strong> {doctorData.name}
            </p>
            <p>
              <strong>Hospital:</strong> {doctorData.hospital}
            </p>
            <p>
              <strong>Speciality:</strong> {doctorData.specialization}
            </p>
            <p>
              <strong>Contact:</strong> {doctorData.mobileNumber}
            </p>
          </div>
        ) : (
          <p className="text-center">Doctor details not available.</p>
        )}

        <div className="flex justify-center">
          <button
            onClick={() => setShowPopup(true)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Register Leave
          </button>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Register Leave
            </h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Leave Date:
              </label>
              <DatePicker
                selected={leaveDate}
                onChange={(date: Date) => setLeaveDate(date)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholderText="Select leave date"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Leave Reason:
              </label>
              <textarea
                value={leaveReason}
                onChange={(e) => setLeaveReason(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter leave reason"
                rows={4}
              />
            </div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleLeaveSubmit}
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterLeave;
