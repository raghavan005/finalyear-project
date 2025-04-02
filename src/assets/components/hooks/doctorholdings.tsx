// hooks/doctorHolding.tsx

import { useState } from "react";
import { getFirestore, doc, setDoc } from "../Login/firebase/firebase"; // Adjust path as needed
import { auth } from "../Login/firebase/firebase"; // Adjust path as needed

interface DoctorDetails {
  name: string;
  age: string;
  gender: string;
  mobileNumber: string;
  district: string;
  city: string;
  hospital: string;
  specialization: string;
  experience: string;
}

interface DoctorHoldingResult {
  saveDoctorDetails: (details: DoctorDetails) => Promise<string | null>;
  loading: boolean;
  error: string | null;
}

const useDoctorHolding = (): DoctorHoldingResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveDoctorDetails = async (
    details: DoctorDetails
  ): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      if (!auth.currentUser) {
        throw new Error("User not authenticated.");
      }

      const userUid = auth.currentUser.uid;
      const db = getFirestore();
      const doctorDocRef = doc(db, "doctors", userUid);

      await setDoc(doctorDocRef, {
        uid: userUid,
        ...details,
        attendanceLogs: [],
        otherDetails: {},
      });

      console.log("Doctor details saved successfully!");
      return null; // Success, no error
    } catch (err: any) {
      console.error("Error saving doctor details:", err.message);
      setError(err.message);
      return err.message; // Return the error message
    } finally {
      setLoading(false);
    }
  };

  return {
    saveDoctorDetails,
    loading,
    error,
  };
};

export default useDoctorHolding;
