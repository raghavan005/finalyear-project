import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  where,
} from "../Login/firebase/firebase";
import { auth } from "../Login/firebase/firebase";
import "./Report.css";

const LeaveReport = () => {
  const [leaveReports, setLeaveReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userUid, setUserUid] = useState(null);

  useEffect(() => {
    const fetchUserUid = async () => {
      try {
        if (!auth.currentUser) {
          throw new Error("User not authenticated.");
        }
        setUserUid(auth.currentUser.uid);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserUid();
  }, []);

  useEffect(() => {
    if (!userUid) return;

    const fetchLeaveReports = async () => {
      try {
        if (!auth.currentUser) {
          throw new Error("User not authenticated.");
        }

        const db = getFirestore();
        const leaveCollectionRef = collection(db, "doctorleave");
        const q = query(leaveCollectionRef, where("doctorId", "==", userUid));

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const reports = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setLeaveReports(reports);
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchLeaveReports();
  }, [userUid]);

  if (loading) {
    return <p>Loading leave reports...</p>;
  }

  if (error) {
    return <p className="error">Error: {error}</p>;
  }

  if (leaveReports.length === 0) {
    return <p>No leave reports found for this user.</p>;
  }

  return (
    <div className="leave-report-container">
      <h2>Your Leave Reports</h2>
      <table>
        <thead>
          <tr>
            <th>Leave Date</th>
            <th>Timestamp</th>
            <th>Hospital</th>
            <th>Reason</th>
            <th>Contact</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {leaveReports.map((report) => (
            <tr key={report.id}>
              <td>
                {report.leaveDate &&
                  report.leaveDate.toDate().toLocaleDateString()}
              </td>
              <td>
                {report.timestamp && report.timestamp.toDate().toLocaleString()}
              </td>
              <td>{report.hospital}</td>
              <td>{report.leaveReason}</td>
              <td>{report.contact}</td>
              <td>
                {report.status === "accepted" ? (
                  <span className="status-accepted">Accepted</span>
                ) : report.status === "rejected" ? (
                  <span className="status-rejected">Rejected</span>
                ) : (
                  <span className="status-pending">Pending</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveReport;
