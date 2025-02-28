import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaHome,
  FaUserMd,
  FaUser,
  FaFileAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import {
  auth,
  getFirestore,
  collection,
  getDocs,
} from "../Login/firebase/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

interface DoctorDetails {
  uid: string;
  name?: string;
  age?: string;
  gender?: string;
  mobileNumber?: string;
  district?: string;
  city?: string;
  hospital?: string;
  specialization?: string;
  experience?: string;
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [allDoctors, setAllDoctors] = useState<DoctorDetails[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        await fetchAllDoctors();
      } else {
        setLoadingDoctors(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchAllDoctors = async () => {
    setLoadingDoctors(true);
    try {
      const db = getFirestore();
      const doctorsCollection = collection(db, "doctors");
      const querySnapshot = await getDocs(doctorsCollection);

      const doctorsList: DoctorDetails[] = [];
      querySnapshot.forEach((doc) => {
        doctorsList.push({ uid: doc.id, ...doc.data() } as DoctorDetails);
      });

      setAllDoctors(doctorsList);
    } catch (error) {
      console.error("Error fetching all doctor details:", error);
      setAllDoctors([]);
    } finally {
      setLoadingDoctors(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!user) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="sidebar bg-dark text-white p-3 vh-100 d-flex flex-column">
        <h3 className="mb-4 text-center">Admin Dashboard</h3>
        <ul className="nav flex-column">
          <li className="nav-item">
            <a
              href="#"
              className="nav-link text-white d-flex align-items-center"
            >
              <FaHome className="me-2" /> Home
            </a>
          </li>
          <li className="nav-item">
            <a
              href="#"
              className="nav-link text-white d-flex align-items-center"
            >
              <FaUserMd className="me-2" /> Appointments
            </a>
          </li>
          <li className="nav-item">
            <a
              href="#"
              className="nav-link text-white d-flex align-items-center"
            >
              <FaUser className="me-2" /> Patients
            </a>
          </li>
          <li className="nav-item">
            <a
              href="#"
              className="nav-link text-white d-flex align-items-center"
            >
              <FaFileAlt className="me-2" /> Reports
            </a>
          </li>
        </ul>
        <button
          className="btn btn-danger mt-auto w-100 d-flex align-items-center justify-content-center"
          onClick={handleLogout}
        >
          <FaSignOutAlt className="me-2" /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="container p-4 flex-grow-1">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Welcome, {user.email}</h2>
        </div>

        {/* All Doctor Details Section */}
        <div className="mb-4">
          <h4 className="mb-3">All Doctor Details</h4>
          {loadingDoctors ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">
                  Loading doctor details...
                </span>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Name</th>
                    <th>Specialization</th>
                    <th>Mobile</th>
                    <th>Hospital</th>
                    <th>Experience</th>
                  </tr>
                </thead>
                <tbody>
                  {allDoctors.map((doctor) => (
                    <tr key={doctor.uid}>
                      <td>{doctor.name || "N/A"}</td>
                      <td>{doctor.specialization || "N/A"}</td>
                      <td>{doctor.mobileNumber || "N/A"}</td>
                      <td>{doctor.hospital || "N/A"}</td>
                      <td>{doctor.experience || "N/A"} years</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
