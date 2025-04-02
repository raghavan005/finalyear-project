import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  getDocs,
  updateDoc,
  doc,
} from "../Login/firebase/firebase";
import { format } from "date-fns";

const LeaveReport = () => {
  const [leaveReports, setLeaveReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaveReports = async () => {
      setLoading(true);
      setError(null);
      try {
        const db = getFirestore();
        const doctorLeaveCollectionRef = collection(db, "doctorleave");
        const q = query(doctorLeaveCollectionRef);
        const querySnapshot = await getDocs(q);
        const reports = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          leaveDate: doc.data().leaveDate.toDate(),
          leaveReason: doc.data().leaveReason,
          timestamp: doc.data().timestamp.toDate(),
          doctorName: doc.data().doctorName,
          hospital: doc.data().hospital,
          speciality: doc.data().speciality,
          contact: doc.data().contact,
          status: doc.data().status || "pending",
        }));
        setLeaveReports(reports);
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching leave reports:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveReports();
  }, []);

  const handleAccept = async (reportId) => {
    const db = getFirestore();
    const reportDocRef = doc(db, "doctorleave", reportId);
    try {
      await updateDoc(reportDocRef, {
        status: "accepted",
      });
      setLeaveReports(
        leaveReports.map((report) =>
          report.id === reportId ? { ...report, status: "accepted" } : report
        )
      );
    } catch (err) {
      console.error("Error accepting leave report:", err);
    }
  };

  const handleReject = async (reportId) => {
    const db = getFirestore();
    const reportDocRef = doc(db, "doctorleave", reportId);
    try {
      await updateDoc(reportDocRef, {
        status: "rejected",
      });
      setLeaveReports(
        leaveReports.map((report) =>
          report.id === reportId ? { ...report, status: "rejected" } : report
        )
      );
    } catch (err) {
      console.error("Error rejecting leave report:", err);
    }
  };

  if (loading) {
    return <div>Loading leave reports...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ overflowX: "auto" }}>
      {" "}
      {/* Added overflowX: "auto" */}
      <h2>All Leave Reports</h2>
      {leaveReports.length === 0 ? (
        <p>No leave reports found.</p>
      ) : (
        <table className="min-w-full leading-normal" style={{ width: "100%" }}>
          {" "}
          {/* Added width: "100%" */}
          <thead>
            <tr>
              <th className="px-3 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Leave Date
              </th>
              <th className="px-3 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Leave Reason
              </th>
              <th className="px-3 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-3 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Doctor Name
              </th>
              <th className="px-3 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Hospital
              </th>
              <th className="px-3 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Speciality
              </th>
              <th className="px-3 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-3 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-3 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {leaveReports.map((report) => (
              <tr key={report.id}>
                <td className="px-3 py-3 border-b border-gray-200 bg-white text-sm">
                  {format(report.leaveDate, "yyyy-MM-dd")}
                </td>
                <td className="px-3 py-3 border-b border-gray-200 bg-white text-sm">
                  {report.leaveReason}
                </td>
                <td className="px-3 py-3 border-b border-gray-200 bg-white text-sm">
                  {format(report.timestamp, "yyyy-MM-dd HH:mm:ss")}
                </td>
                <td className="px-3 py-3 border-b border-gray-200 bg-white text-sm">
                  {report.doctorName}
                </td>
                <td className="px-3 py-3 border-b border-gray-200 bg-white text-sm">
                  {report.hospital}
                </td>
                <td className="px-3 py-3 border-b border-gray-200 bg-white text-sm">
                  {report.speciality}
                </td>
                <td className="px-3 py-3 border-b border-gray-200 bg-white text-sm">
                  {report.contact}
                </td>
                <td className="px-3 py-3 border-b border-gray-200 bg-white text-sm">
                  {report.status}
                </td>
                <td className="px-3 py-3 border-b border-gray-200 bg-white text-sm">
                  {report.status === "pending" && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAccept(report.id)}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-3 rounded text-xs" // Reduced padding and font size
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(report.id)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded text-xs" // Reduced padding and font size
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LeaveReport;
