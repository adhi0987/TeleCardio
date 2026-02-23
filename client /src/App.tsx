import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PatientLogin from './pages/auth/PatientLogin';
import PatientCompleteProfile from './pages/patient/PatientCompleteProfile'; // <-- Import the new component
import DoctorDashboard from './pages/doctor/DoctorDashboard';

// Placeholders
const Home = () => <div className="p-8 text-center text-2xl">Welcome to TeleCardio 🫀</div>;
const DoctorLogin = () => <div className="p-8 text-center text-xl">Doctor Login (OTP)</div>;
const AdminLogin = () => <div className="p-8 text-center text-xl">Admin Login (Password)</div>;
const PatientDashboard = () => <div className="p-8 text-center text-xl">Patient Dashboard</div>;

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          
          {/* Auth Routes */}
          <Route path="/login/patient" element={<PatientLogin />} />
          <Route path="/login/doctor" element={<DoctorLogin />} />
          <Route path="/login/admin" element={<AdminLogin />} />

          {/* Protected Patient Routes */}
          {/* Swap the placeholder for the real component here: */}
          <Route path="/patient/complete-profile" element={<PatientCompleteProfile />} />
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          
          {/*Down in your Routes section ,swap out the placeholder*/}
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />

          {/*default routes*/}
          <Route path="*" element={<Navigate to="/login/doctor" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;