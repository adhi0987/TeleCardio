import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { toast } from 'react-toastify';
import '../styles/Auth.css';
import { patientApi, doctorApi, adminApi } from '../api/api';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
    const { role } = useParams<{ role: string }>(); 
    const navigate = useNavigate();
    const { login } = useAuth();
    
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>(''); // For Admin
    const [otp, setOtp] = useState<string>('');
    const [step, setStep] = useState<number>(1); // 1: Email/Pwd, 2: OTP

    const handleSendOtp = async () => {
        try {
            if (role === 'patient') await patientApi.sendOtp(email);
            else if (role === 'doctor') await doctorApi.sendOtp(email);
            setStep(2);
            toast.success('OTP Sent!');
        } catch (err) {
            toast.error('Failed to send OTP');
        }
    };

    const handleVerifyOtp = async () => {
        try {
            let res;
            if (role === 'patient') res = await patientApi.verifyOtp(email, otp);
            else if (role === 'doctor') res = await doctorApi.verifyOtp(email, otp);

            if (res && res.data) {
                // Assuming backend response includes a flag 'is_active' or similar to check if profile is complete
                // For this example, we'll assume a successful login. 
                // You might need to adjust logic if your backend returns a 404 for incomplete profiles.
                
                login(res.data.user, res.data.access_token, role?.toUpperCase() || 'PATIENT');
                
                // Navigate to dashboard or profile completion
                // Logic: If user name is null or specific flag is set, go to profile
                if (!res.data.user || !res.data.user.id) {
                     navigate(`/profile-complete/${role}`);
                } else {
                     navigate(`/${role}-dashboard`);
                }
            }
        } catch (err) {
            toast.error('Invalid OTP or Login Failed');
        }
    };

    const handleAdminLogin = async () => {
        try {
            const res = await adminApi.login(email, password);
            login(res.data.user, res.data.access_token, 'ADMIN');
            navigate('/admin-dashboard');
        } catch (err) {
            toast.error('Admin Login Failed');
        }
    };

    return (
        <div className="auth-container">
            <div className="card auth-card">
                <h2 style={{textTransform: 'capitalize'}}>{role} Login</h2>
                
                {role === 'admin' ? (
                    <>
                        <input className="form-input" placeholder="Username" onChange={e => setEmail(e.target.value)} />
                        <input className="form-input" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
                        <button className="btn btn-primary full-width" onClick={handleAdminLogin}>Login</button>
                    </>
                ) : (
                    <>
                        {step === 1 && (
                            <>
                                <input className="form-input" placeholder="Enter Email" value={email} onChange={e => setEmail(e.target.value)} />
                                <button className="btn btn-primary full-width" onClick={handleSendOtp}>Send OTP</button>
                            </>
                        )}
                        {step === 2 && (
                            <>
                                <input className="form-input" placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} />
                                <button className="btn btn-success full-width" onClick={handleVerifyOtp}>Verify & Login</button>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Login;