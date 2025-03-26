import React, { useState, useEffect } from "react";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "../Login/firebase/firebase";
import { auth } from "../Login/firebase/firebase";
import { motion } from "framer-motion";

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
  const defaultShift = "9:00 AM - 6:00 PM";
  const [punchInDisabled, setPunchInDisabled] = useState(false);
  const [punchOutDisabled, setPunchOutDisabled] = useState(true);
  const [popupMessage, setPopupMessage] = useState("");
  const [location, setLocation] = useState(null);

  // Coimbatore location coordinates and radius
  const coimbatoreLocation = {
    latitude: 11.05028,
    longitude: 77.03103,
    radius: 50000, // 5000 meters (5 kilometers) - Adjust as needed
  };

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
          const data = docSnap.data();
          setDoctorData({ ...data, shift: data.shift || defaultShift });
        } else {
          setDoctorData({ shift: defaultShift });
        }
      } catch (e: any) {
        setError("Error fetching data: " + e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
          setError("Location access denied or unavailable.");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, [defaultShift]);

  const boxStyle: React.CSSProperties = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
    backgroundColor: color,
    borderRadius: typeof radius === "number" ? `${radius}px` : radius,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  const contentStyle: React.CSSProperties = {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    fontFamily: "Georgia, serif",
    fontSize: "1.1em",
    fontWeight: "500",
    color: "#333",
  };

  const buttonContainerStyle: React.CSSProperties = {
    display: "flex",
    width: "50%",
    marginBottom: "50px",
    gap: "20px",
  };

  const buttonStyle: React.CSSProperties = {
    width: "50%",
    padding: "10px",
    textAlign: "center",
    border: "none",
    cursor: "pointer",
    boxSizing: "border-box",
    backgroundColor: "#282828",
    color: "white",
    borderRadius: "10px",
    fontFamily: "Verdana, sans-serif",
    fontWeight: "600",
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const handlePunch = async (type: "in" | "out") => {
    try {
      if (!auth.currentUser) {
        throw new Error("User not authenticated.");
      }
      if (!location) {
        throw new Error("Location not available.");
      }

      // Check if location is within Coimbatore for punch in
      if (type === "in") {
        const distance = calculateDistance(
          location.latitude,
          location.longitude,
          coimbatoreLocation.latitude,
          coimbatoreLocation.longitude
        );

        if (distance > coimbatoreLocation.radius) {
          throw new Error("You are not within Coimbatore to punch in.");
        }
      }

      const userUid = auth.currentUser.uid;
      const db = getFirestore();
      const attendanceCollectionRef = collection(db, "attendance");

      await addDoc(attendanceCollectionRef, {
        userId: userUid,
        type: type,
        timestamp: serverTimestamp(),
        date: new Date(),
        location: location,
      });

      if (type === "in") {
        setButton1Pressed(true);
        setTimeout(() => setButton1Pressed(false), 100);
        setPunchInDisabled(true);
        setPunchOutDisabled(false);
        setPopupMessage("Attendance registered: Punch In");
      } else {
        setButton2Pressed(true);
        setTimeout(() => setButton2Pressed(false), 100);
        setPunchInDisabled(false);
        setPunchOutDisabled(true);
        setPopupMessage("Attendance registered: Punch Out");
      }

      console.log(`Punch ${type} recorded.`);
    } catch (error: any) {
      console.error("Error recording attendance:", error.message);
      setError(error.message);
    }
  };

  useEffect(() => {
    if (popupMessage) {
      const timer = setTimeout(() => {
        setPopupMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [popupMessage]);

  if (loading)
    return (
      <div style={boxStyle}>
        <div style={contentStyle}>Loading...</div>
        <div style={buttonContainerStyle}>
          <motion.button style={buttonStyle} disabled>
            Punch In
          </motion.button>
          <motion.button style={buttonStyle} disabled>
            Punch Out
          </motion.button>
        </div>
      </div>
    );
  if (error)
    return (
      <div style={boxStyle}>
        <div style={contentStyle}>{error}</div>
        <div style={buttonContainerStyle}>
          <motion.button style={buttonStyle} disabled>
            Punch In
          </motion.button>
          <motion.button style={buttonStyle} disabled>
            Punch Out
          </motion.button>
        </div>
      </div>
    );
  if (!doctorData)
    return (
      <div style={boxStyle}>
        <div style={contentStyle}>No Data</div>
        <div style={buttonContainerStyle}>
          <motion.button style={buttonStyle} disabled>
            Punch In
          </motion.button>
          <motion.button style={buttonStyle} disabled>
            Punch Out
          </motion.button>
        </div>
      </div>
    );

  return (
    <div style={boxStyle}>
      <div style={contentStyle}>
        <div>Doctor's Name: {doctorData.name}</div>
        <div>Hospital Name: {doctorData.hospital}</div>
        <div>Shift Timing: {doctorData.shift}</div>
        {popupMessage && <div>{popupMessage}</div>}
      </div>
      <div style={buttonContainerStyle}>
        <motion.button
          style={buttonStyle}
          onClick={() => handlePunch("in")}
          disabled={punchInDisabled}
          whileTap={{ scale: 0.95 }}
        >
          Punch In
        </motion.button>
        <motion.button
          style={buttonStyle}
          onClick={() => handlePunch("out")}
          disabled={punchOutDisabled}
          whileTap={{ scale: 0.95 }}
        >
          Punch Out
        </motion.button>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const appStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "40vh",
  };

  return (
    <div style={appStyle}>
      <Box width="80%" height="300px" radius="15px" />
    </div>
  );
};

export default App;
