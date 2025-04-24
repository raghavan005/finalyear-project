import React, { useState, useEffect } from "react";
import { db } from "../Login/firebase/firebase"; // Adjust path as needed
import { collection, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";

const AdminDoctorReports: React.FC = () => {
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "doctor_reports"));
        const fetchedReports = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReports(fetchedReports);
      } catch (error) {
        console.error("Error fetching reports: ", error);
      }
    };

    fetchReports();
  }, []);

  return (
    <motion.div
      className="container mt-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 style={{ color: "grey" }}>Doctor Shift Reports</h2>

      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Doctor ID</th>
              <th>Patients Seen</th>
              <th>Shortages</th>
              <th>Notes</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td>{report.doctorID}</td>
                <td>{report.patientsSeen}</td>
                <td>
                  {report.shortages && Array.isArray(report.shortages)
                    ? report.shortages.map((s) => (
                        <div key={s.item}>
                          {s.item} (Qty: {s.quantity})
                        </div>
                      ))
                    : "No shortages"}
                </td>
                <td>{report.notes}</td>
                <td>
                  {report.date
                    ? report.date.toDate().toLocaleString()
                    : "Date not available"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default AdminDoctorReports;
