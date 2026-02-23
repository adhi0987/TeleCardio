import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from '../src/pages/Home/Home';
import AuthPage from '../src/pages/Auth/AuthPage';
import PatientCompleteProfile from '../src/pages/Profile/DoctorCompleteProfile';
import DoctorCompleteProfile from '../src/pages/Profile/DoctorCompleteProfile';
import PatientDashboard from '../src/pages/patient/PatientDashboard';
import DoctorDashboard from '../src/pages/doctor/DoctorDashboard';

import LandingPage from '../src/pages/LandingPage';
import PatientLogin from './pages/Auth/PatientLogin';
// Make sure you import your Signup component here!
import PatientSignup from '../src/pages/Auth/PatientSignup';

function App() {
  return (
    <Router>
      <Routes>
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />

        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<PatientLogin />} />
        <Route path="/signup" element={<PatientSignup />} />
        <Route path="/auth" element={<AuthPage />} />
        
        {/* Profile Completion (Signup Details) */}
        <Route path="/patient/complete-profile" element={<PatientCompleteProfile />} />
        <Route path="/doctor/complete-profile" element={<DoctorCompleteProfile />} />
        
        {/* Dashboards */}
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;