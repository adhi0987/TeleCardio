// // import React, { useState } from 'react';
// // import { useParams, useNavigate } from 'react-router-dom';

// // import { toast } from 'react-toastify';
// // import '../styles/Auth.css';
// // import { patientApi, doctorApi, adminApi } from '../api/api';
// // import { useAuth } from '../context/AuthContext';

// // const Login: React.FC = () => {
// //     const { role } = useParams<{ role: string }>(); 
// //     const navigate = useNavigate();
// //     const { login } = useAuth();
    
// //     const [email, setEmail] = useState<string>('');
// //     const [password, setPassword] = useState<string>(''); // For Admin
// //     const [otp, setOtp] = useState<string>('');
// //     const [step, setStep] = useState<number>(1); // 1: Email/Pwd, 2: OTP

// //     const handleSendOtp = async () => {
// //         try {
// //             if (role === 'patient') await patientApi.sendOtp(email);
// //             else if (role === 'doctor') await doctorApi.sendOtp(email);
// //             setStep(2);
// //             toast.success('OTP Sent!');
// //         } catch (err) {
// //             toast.error('Failed to send OTP');
// //         }
// //     };

// //     const handleVerifyOtp = async () => {
// //         try {
// //             let res;
// //             if (role === 'patient') res = await patientApi.verifyOtp(email, otp);
// //             else if (role === 'doctor') res = await doctorApi.verifyOtp(email, otp);

// //             if (res && res.data) {
// //                 // Assuming backend response includes a flag 'is_active' or similar to check if profile is complete
// //                 // For this example, we'll assume a successful login. 
// //                 // You might need to adjust logic if your backend returns a 404 for incomplete profiles.
                
// //                 // login(res.data.user, res.data.access_token, role?.toUpperCase() || 'PATIENT');
                
// //                 // Navigate to dashboard or profile completion
// //                 // Logic: If user name is null or specific flag is set, go to profile
// //                 // if (!res.data.user || !res.data.user.id) {
// //                 //      navigate(`/profile-complete/${role}`);
// //                 // } else {
// //                 //      navigate(`/${role}-dashboard`);
// //                 // }
// //                 console.log('Login successful, but profile completion logic is not implemented yet.');
// //                 login(res.data.user, res.data.access_token, role?.toUpperCase() || 'PATIENT');

// //             }
// //         } catch (err) {
// //             toast.error('Invalid OTP or Login Failed');
// //         }
// //     };

// //     const handleAdminLogin = async () => {
// //         try {
// //             const res = await adminApi.login(email, password);
// //             login(res.data.user, res.data.access_token, 'ADMIN');
// //             navigate('/admin-dashboard');
// //         } catch (err) {
// //             toast.error('Admin Login Failed');
// //         }
// //     };

// //     return (
// //         <div className="auth-container">
// //             <div className="card auth-card">
// //                 <h2 style={{textTransform: 'capitalize'}}>{role} Login</h2>
                
// //                 {role === 'admin' ? (
// //                     <>
// //                         <input className="form-input" placeholder="Username" onChange={e => setEmail(e.target.value)} />
// //                         <input className="form-input" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
// //                         <button className="btn btn-primary full-width" onClick={handleAdminLogin}>Login</button>
// //                     </>
// //                 ) : (
// //                     <>
// //                         {step === 1 && (
// //                             <>
// //                                 <input className="form-input" placeholder="Enter Email" value={email} onChange={e => setEmail(e.target.value)} />
// //                                 <button className="btn btn-primary full-width" onClick={handleSendOtp}>Send OTP</button>
// //                             </>
// //                         )}
// //                         {step === 2 && (
// //                             <>
// //                                 <input className="form-input" placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} />
// //                                 <button className="btn btn-success full-width" onClick={handleVerifyOtp}>Verify & Login</button>
// //                             </>
// //                         )}
// //                     </>
// //                 )}
// //             </div>
// //         </div>
// //     );
// // };

// // export default Login;

// // client/src/Auth/Login.tsx
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '../api/api'; // Assuming you have an axios instance setup here

// type Role = 'patient' | 'doctor' | 'admin';

// const Login: React.FC = () => {
//   const [role, setRole] = useState<Role>('patient');
//   const [step, setStep] = useState<1 | 2>(1); // Step 1: Request OTP/Login, Step 2: Verify OTP
  
//   // Form States
//   const [email, setEmail] = useState('');
//   const [nmrNumber, setNmrNumber] = useState('');
//   const [isNmrVerified, setIsNmrVerified] = useState(false);
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [otp, setOtp] = useState('');
  
//   const navigate = useNavigate();

//   const handleSendOtp = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       // If doctor, ensure NMR is verified first
//       if (role === 'doctor' && !isNmrVerified) {
//         alert("Please verify your NMR number first.");
//         return;
//       }
      
//       const payload = role === 'doctor' ? { nmrNumber } : { email };
//       await api.post('/api/auth/send-otp', { ...payload, role });
//       setStep(2); // Move to OTP entry step
//     } catch (error) {
//       console.error('Failed to send OTP', error);
//     }
//   };

//   const handleVerifyOtp = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const payload = role === 'doctor' ? { nmrNumber, otp } : { email, otp };
//       const response = await api.post('/api/auth/verify-otp', { ...payload, role });
      
//       // Save token, update AuthContext
//       localStorage.setItem('token', response.data.token);
      
//       // If new user, redirect to ProfileComplete; else Dashboard
//       if (response.data.isNewUser) {
//         navigate('/profile-complete');
//       } else {
//         navigate(`/${role}-dashboard`);
//       }
//     } catch (error) {
//       console.error('Invalid OTP', error);
//     }
//   };

//   const handleVerifyNmr = async () => {
//     // Regex validation for IN followed by 4 digits
//     if (!/^IN\d{4}$/.test(nmrNumber)) {
//       alert("Invalid NMR Format. Must be INXXXX (e.g., IN1234)");
//       return;
//     }
//     try {
//       // Backend validates and returns the attached email
//       const response = await api.post('/api/auth/verify-nmr', { nmrNumber });
//       alert(`NMR Verified! OTP will be sent to attached email: ${response.data.email}`);
//       setIsNmrVerified(true);
//     } catch (error) {
//       alert("NMR Verification failed. Doctor not found in database.");
//     }
//   };

//   const handleAdminLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const response = await api.post('/api/admin/login', { username, password });
//       localStorage.setItem('token', response.data.token);
//       navigate('/admin-dashboard');
//     } catch (error) {
//       console.error('Admin login failed', error);
//     }
//   };

//   return (
//     <div className="auth-container">
//       <h2>TeleCardio Portal</h2>
      
//       {/* Role Selection Tabs */}
//       <div className="role-selector">
//         <button onClick={() => {setRole('patient'); setStep(1);}}>Patient</button>
//         <button onClick={() => {setRole('doctor'); setStep(1);}}>Doctor</button>
//         <button onClick={() => {setRole('admin'); setStep(1);}}>Admin</button>
//       </div>

//       {role === 'admin' ? (
//         <form onSubmit={handleAdminLogin}>
//           <input type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} required />
//           <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
//           <button type="submit">Login</button>
//         </form>
//       ) : (
//         <form onSubmit={step === 1 ? handleSendOtp : handleVerifyOtp}>
//           {step === 1 && role === 'patient' && (
//             <input type="email" placeholder="Email Address" onChange={e => setEmail(e.target.value)} required />
//           )}

//           {step === 1 && role === 'doctor' && (
//              <div className="nmr-group">
//                 <input 
//                   type="text" 
//                   placeholder="NMR Number (e.g., IN1234)" 
//                   value={nmrNumber}
//                   onChange={e => setNmrNumber(e.target.value)} 
//                   disabled={isNmrVerified}
//                   required 
//                 />
//                 {!isNmrVerified && (
//                   <button type="button" onClick={handleVerifyNmr}>Verify NMR</button>
//                 )}
//              </div>
//           )}

//           {step === 2 && (
//              <input type="text" placeholder="Enter OTP" onChange={e => setOtp(e.target.value)} required />
//           )}

//           <button type="submit">
//             {step === 1 ? 'Send OTP' : 'Verify & Login/Signup'}
//           </button>
//         </form>
//       )}
//     </div>
//   );
// };

// export default Login;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import '../styles/Auth.css';

type Role = 'patient' | 'doctor' | 'admin';

const Login: React.FC = () => {
  const [role, setRole] = useState<Role>('patient');
  const [step, setStep] = useState<1 | 2>(1);
  const navigate = useNavigate();

  // Form States
  const [email, setEmail] = useState('');
  const [nmrNumber, setNmrNumber] = useState('');
  const [isNmrVerified, setIsNmrVerified] = useState(false);
  const [otp, setOtp] = useState('');
  
  // Admin
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleVerifyNMR = async () => {
    if (!/^IN\d{4}$/.test(nmrNumber)) {
      alert("Invalid NMR Format. Must be INXXXX (e.g., IN1234)");
      return;
    }
    try {
      const res = await api.post('/api/auth/verify-nmr', { nmrNumber });
      alert(`NMR Verified! Linked email: ${res.data.email}`);
      setIsNmrVerified(true);
    } catch (error: any) {
      alert(error.response?.data?.detail || "NMR Verification failed.");
    }
  };

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'doctor' && !isNmrVerified) {
      alert("Please verify your NMR number first.");
      return;
    }
    try {
      const payload = role === 'doctor' ? { nmrNumber, role } : { email, role };
      await api.post('/api/auth/send-otp', payload);
      setStep(2);
    } catch (error: any) {
      alert(error.response?.data?.detail || "Failed to send OTP.");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (role === 'admin') {
        const res = await api.post('/api/auth/admin-login', { username, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userRole', 'admin');
        navigate('/admin-dashboard');
      } else {
        const payload = role === 'doctor' ? { nmrNumber, otp, role } : { email, otp, role };
        const res = await api.post('/api/auth/verify-otp', payload);
        
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userRole', role);
        localStorage.setItem('userIdentity', role === 'doctor' ? nmrNumber : email);

        if (res.data.isNewUser) {
          navigate('/profile-complete');
        } else {
          navigate(`/${role}-dashboard`);
        }
      }
    } catch (error: any) {
      alert(error.response?.data?.detail || "Authentication Failed.");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">Welcome to TeleCardio</h2>
        <p className="auth-subtitle">Select your account type to proceed</p>

        <div className="role-tabs">
          <button className={role === 'patient' ? 'active' : ''} onClick={() => {setRole('patient'); setStep(1);}}>Patient</button>
          <button className={role === 'doctor' ? 'active' : ''} onClick={() => {setRole('doctor'); setStep(1);}}>Doctor</button>
          <button className={role === 'admin' ? 'active' : ''} onClick={() => {setRole('admin'); setStep(1);}}>Admin</button>
        </div>

        <form onSubmit={step === 1 && role !== 'admin' ? handleRequestOTP : handleLogin} className="auth-form">
          {/* PATIENT INPUTS */}
          {role === 'patient' && step === 1 && (
            <input 
              type="email" 
              placeholder="Enter your Email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
          )}

          {/* DOCTOR INPUTS */}
          {role === 'doctor' && step === 1 && (
            <div className="nmr-input-group">
              <input 
                type="text" 
                placeholder="NMR Number (e.g., IN1234)" 
                value={nmrNumber} 
                onChange={e => setNmrNumber(e.target.value)} 
                disabled={isNmrVerified}
                required 
              />
              {!isNmrVerified && (
                <button type="button" className="btn-secondary" onClick={handleVerifyNMR}>
                  Verify
                </button>
              )}
            </div>
          )}

          {/* ADMIN INPUTS */}
          {role === 'admin' && (
            <>
              <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
              <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
            </>
          )}

          {/* OTP INPUT */}
          {step === 2 && role !== 'admin' && (
            <input 
              type="text" 
              placeholder="Enter 6-digit OTP" 
              value={otp} 
              onChange={e => setOtp(e.target.value)} 
              required 
            />
          )}

          <button type="submit" className="btn-primary">
            {role === 'admin' ? 'Login as Admin' : (step === 1 ? 'Get OTP' : 'Verify & Login')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;