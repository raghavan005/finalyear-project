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
      setError(err.message);import React, { useState, useEffect } from "react";
      import { getFirestore, doc, getDoc } from "../Login/firebase/firebase"; // Adjust path as needed
      import { auth } from "../Login/firebase/firebase"; // Adjust path as needed

      interface BoxProps {
        width?: string | number;
        height?: string | number;
        color?: string;
        radius?: string | number;
      }

      const Box: React.FC<BoxProps> = ({
        width = "300px",
        height = "250px",
        color = "lightgrey",
        radius = "10px",
      }) => {
        const [button1Pressed, setButton1Pressed] = useState(false);
        const [button2Pressed, setButton2Pressed] = useState(false);
        const [doctorData, setDoctorData] = useState(null);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);

        useEffect(() => {
          const fetchData = async () => {
            setLoading(true);
            setError(null);

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
                setError("Doctor data not found");
              }
            } catch (e: any) {
              setError("Error fetching data: " + e.message);
            } finally {
              setLoading(false);
            }
          };

          fetchData();
        }, []);

        const boxStyle: React.CSSProperties = {
          width: typeof width === "number" ? `${width}px` : width,
          height: typeof height === "number" ? `${height}px` : height,
          backgroundColor: color,
          borderRadius: typeof radius === "number" ? `${radius}px` : radius,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "20px",
          boxSizing: "border-box",
        };

        const contentStyle: React.CSSProperties = {
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
        };

        const buttonContainerStyle: React.CSSProperties = {
          display: "flex",
          width: "80%",
          padding: "10px",
          gap: "20px",
        };

        const buttonStyle: React.CSSProperties = {
          width: "50%",
          padding: "10px",
          textAlign: "center",
          border: "none",
          cursor: "pointer",
          boxSizing: "border-box",
          transform:
            button1Pressed || button2Pressed ? "scale(0.95)" : "scale(1)",
          transition: "transform 0.1s ease",
          backgroundColor: "black",
          color: "white",
          borderRadius: "10px",
        };

        const handleButton1Click = () => {
          setButton1Pressed(true);
          setTimeout(() => setButton1Pressed(false), 100);
        };

        const handleButton2Click = () => {
          setButton2Pressed(true);
          setTimeout(() => setButton2Pressed(false), 100);
        };

        if (loading) return <div>Loading...</div>;
        if (error) return <div>{error}</div>;
        if (!doctorData) return null;

        return (
          <div style={boxStyle}>
            <div style={contentStyle}>
              <div>Doctor's Name: {doctorData.name}</div>
              <div>Hospital Name: {doctorData.hospital}</div>
              {doctorData.shift && <div>Shift Timing: {doctorData.shift}</div>}
            </div>
            <div style={buttonContainerStyle}>
              <button style={buttonStyle} onClick={handleButton1Click}>
                Punch In
              </button>
              <button style={buttonStyle} onClick={handleButton2Click}>
                Punch Out
              </button>
            </div>
          </div>
        );
      };

      const App: React.FC = () => {
        const appStyle: React.CSSProperties = {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        };

        return (
          <div style={appStyle}>
            <Box />
          </div>
        );
      };

      export default App;
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
