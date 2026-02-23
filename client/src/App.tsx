import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Landing from './pages/Landing';

import PatientDashboard from './pages/Patient/PatientDashboard';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';
import Login from './Auth/Login';
import ProfileComplete from './Auth/ProfileComplete';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login/:role" element={<Login />} />

          {/* Protected Route for Profile Completion (Any logged in user) */}
          <Route element={<ProtectedRoute />}>
             <Route path="/profile-complete/:role" element={<ProfileComplete />} />
          </Route>

          {/* Role-Based Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['PATIENT']} />}>
            <Route path="/patient-dashboard" element={<PatientDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['DOCTOR']} />}>
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Route>

        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </AuthProvider>
  );
}

export default App;