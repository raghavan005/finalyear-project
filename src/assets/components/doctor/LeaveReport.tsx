import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "../Login/firebase/firebase";
import { auth } from "../Login/firebase/firebase";
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
        if (!auth.currentUser) {
          throw new Error("User not authenticated.");
        }

        const userUid = auth.currentUser.uid;
        const db = getFirestore();
        const doctorLeaveCollectionRef = collection(db, "doctorleave");
        const q = query(
          doctorLeaveCollectionRef,
          where("userId", "==", userUid)
        );
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

  if (loading) {
    return <div>Loading leave reports...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Leave Report</h2>
      {leaveReports.length === 0 ? (
        <p>No leave reports found.</p>
      ) : (
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Leave Date
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Leave Reason
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Doctor Name
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Hospital
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Speciality
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Contact
              </th>
            </tr>
          </thead>
          <tbody>
            {leaveReports.map((report) => (
              <tr key={report.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {format(report.leaveDate, "yyyy-MM-dd")}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {report.leaveReason}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {format(report.timestamp, "yyyy-MM-dd HH:mm:ss")}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {report.doctorName}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {report.hospital}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {report.speciality}
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  {report.contact}
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
