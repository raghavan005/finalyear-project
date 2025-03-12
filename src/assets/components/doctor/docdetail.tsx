import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  auth,
  doc,
  getDoc,
} from "../Login/firebase/firebase";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import "bootstrap/dist/css/bootstrap.min.css";
import "./DoctorAttendance.css";

const DoctorAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attendancePercentage, setAttendancePercentage] = useState(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!auth.currentUser) {
          throw new Error("User not authenticated.");
        }

        const userUid = auth.currentUser.uid;
        const db = getFirestore();

        const doctorDoc = await getDoc(doc(db, "doctors", userUid));
        if (doctorDoc.exists()) {
          setDoctorData(doctorDoc.data());
        } else {
          setError("Doctor data not found.");
        }

        const attendanceQuery = query(
          collection(db, "attendance"),
          where("userId", "==", userUid)
        );

        const unsubscribe = onSnapshot(attendanceQuery, (querySnapshot) => {
          const attendanceList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setAttendanceData(attendanceList);
        });

        return () => unsubscribe();
      } catch (e: any) {
        setError("Error fetching data: " + e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  useEffect(() => {
    if (attendanceData.length > 0) {
      calculateAttendancePercentage();

      const monthlyData = {};
      attendanceData.forEach((item) => {
        const date = item.date?.toDate();
        if (date) {
          const monthYear = date.toLocaleString("default", {
            month: "long",
            year: "numeric",
          });
          if (!monthlyData[monthYear]) {
            monthlyData[monthYear] = 0;
          }
          if (
            item.type === "in" &&
            attendanceData.some(
              (out) =>
                out.type === "out" &&
                out.date?.toDate().getMonth() === date.getMonth() &&
                out.date?.toDate().getFullYear() === date.getFullYear()
            )
          ) {
            monthlyData[monthYear]++;
          }
        }
      });

      const chartDataArray = Object.entries(monthlyData).map(
        ([month, count]) => ({
          month: month,
          attendance: count,
        })
      );
      setChartData(chartDataArray);
    }
  }, [attendanceData]);

  const calculateAttendancePercentage = () => {
    const dates = new Set(
      attendanceData.map((item) => item.date?.toDate().toLocaleDateString())
    );
    const totalDays = dates.size;
    let presentDays = 0;

    dates.forEach((date) => {
      const dailyAttendance = attendanceData.filter(
        (item) => item.date?.toDate().toLocaleDateString() === date
      );
      if (
        dailyAttendance.some((item) => item.type === "in") &&
        dailyAttendance.some((item) => item.type === "out")
      ) {
        presentDays++;
      }
    });

    const percentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;
    setAttendancePercentage({ present: percentage, absent: 100 - percentage });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!doctorData) return <div>Doctor data not found.</div>;

  const organizedAttendance = attendanceData.reduce((acc, attendance) => {
    const date = attendance.date?.toDate().toLocaleDateString();
    if (!acc[date]) {
      acc[date] = {};
    }
    if (attendance.type === "in") {
      acc[date].punchIn = attendance.timestamp?.toDate();
    } else if (attendance.type === "out") {
      acc[date].punchOut = attendance.timestamp?.toDate();
    }
    return acc;
  }, {});

  const pieChartData = attendancePercentage
    ? [
        { name: "Present", value: attendancePercentage.present },
        { name: "Absent", value: attendancePercentage.absent },
      ]
    : [];

  const COLORS = ["#0088FE", "#FF8042"];

  return (
    <div className="doctor-attendance-container">
      <div className="attendance-details">
        <h2>Doctor Attendance Details</h2>
        <div>
          <strong>Name:</strong> {doctorData.name}
        </div>
        <div className="attendance-details">
          <strong>Hospital:</strong> {doctorData.hospital}
        </div>
        <div className="attendance-details">
          <strong>Shift:</strong> 9:00am to 5:00pm
        </div>
      </div>

      <div className="flex-row">
        <div className="box attendance-records-box">
          <h3>Attendance Records</h3>
          {Object.keys(organizedAttendance).length > 0 ? (
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>In Time (Punch-in)</th>
                  <th>Out Time (Punch-out)</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(organizedAttendance).map(([date, times]) => (
                  <tr key={date}>
                    <td>{date}</td>
                    <td>
                      {times.punchIn
                        ? times.punchIn.toLocaleString("en-IN", {
                            timeZone: "Asia/Kolkata",
                          })
                        : "N/A"}
                    </td>
                    <td>
                      {times.punchOut
                        ? times.punchOut.toLocaleString("en-IN", {
                            timeZone: "Asia/Kolkata",
                          })
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div>No attendance records found.</div>
          )}
        </div>

        {attendancePercentage && (
          <div className="box pie-chart-container">
            <h3>Attendance Percentage</h3>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <PieChart width={800} height={350}>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value.toFixed(2)}%`}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </div>
          </div>
        )}

        <div className="box chart-box">
          <h3>Monthly Attendance Chart</h3>
          <LineChart width={400} height={300} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="attendance"
              stroke="#8884d8"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </div>
      </div>
    </div>
  );
};

export default DoctorAttendance;
