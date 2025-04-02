import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  Timestamp,
  getDocs,
} from "../Login/firebase/firebase";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const AdminDashboard: React.FC = () => {
  const [currentDoctors, setCurrentDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hospitalCounts, setHospitalCounts] = useState({});

  useEffect(() => {
    const db = getFirestore();
    const attendanceRef = collection(db, "attendance");
    const doctorsRef = collection(db, "doctors");

    const unsubscribe = onSnapshot(attendanceRef, async (snapshot) => {
      const latestAttendance = {};

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const userId = data.userId;
        const timestamp = data.timestamp?.seconds; // Use optional chaining
        const type = data.type;

        // Store only the latest event per doctor
        if (
          !latestAttendance[userId] ||
          (timestamp &&
            latestAttendance[userId]?.timestamp?.seconds &&
            timestamp > latestAttendance[userId].timestamp.seconds)
        ) {
          latestAttendance[userId] = data;
        }
      });

      // Keep only doctors who are currently punched in
      const punchedInDoctors = Object.values(latestAttendance).filter(
        (attendance) => attendance?.type === "in"
      );

      // Fetch doctor details
      const fetchDoctorData = async (attendance) => {
        if (!attendance) return null; // Add null check for attendance

        const doctorQuery = query(
          doctorsRef,
          where("uid", "==", attendance.userId)
        );
        const doctorSnapshot = await getDocs(doctorQuery);
        if (!doctorSnapshot.empty) {
          const doctorData = doctorSnapshot.docs[0].data();
          return {
            name: doctorData.name,
            hospital: doctorData.hospital,
            punchInTime: (attendance.timestamp as Timestamp)?.toDate(), // Use optional chaining
            location: attendance.location,
          };
        }
        return null;
      };

      const doctorDataArray = await Promise.all(
        punchedInDoctors.map(fetchDoctorData)
      );

      // Filter out null responses
      const workingDoctorsData = doctorDataArray.filter(
        (doctor) => doctor !== null
      );
      setCurrentDoctors(workingDoctorsData);

      // Update hospital-wise counts
      const counts = {};
      workingDoctorsData.forEach((doctor) => {
        counts[doctor.hospital] = (counts[doctor.hospital] || 0) + 1;
      });

      setHospitalCounts(counts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const chartData = {
    labels: Object.keys(hospitalCounts),
    datasets: [
      {
        label: "Doctors Punched In",
        data: Object.values(hospitalCounts),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Currently Punched-In Doctors - Statistics (Coimbatore)</h2>

      <div style={{ width: "600px", margin: "20px auto" }}>
        <Bar data={chartData} />
      </div>

      <div style={{ textAlign: "center", margin: "20px" }}>
        <h3>Total Punched-In Doctors: {currentDoctors.length}</h3>
      </div>

      {currentDoctors.length === 0 && <p>No doctors currently punched in.</p>}
    </div>
  );
};

export default AdminDashboard;
