import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import styles from './Auth.module.css';

const AuthPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<'PATIENT' | 'DOCTOR' | 'ADMIN'>('PATIENT');
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const endpoint = role === 'PATIENT' ? '/patient/auth/send-otp' : '/doctor/auth/send-otp';
      await api.post(endpoint, { email, role });
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const endpoint = role === 'PATIENT' ? '/patient/auth/verify-otp' : '/doctor/auth/verify-otp';
      const response = await api.post(endpoint, { email, otp_code: otp });
      
      localStorage.setItem('access_token', response.data.access_token);
      
      // Redirect to dashboard OR to signup/profile completion if they are new
      if (response.data.profile_completed) {
        navigate(role === 'PATIENT' ? '/patient/dashboard' : '/doctor/dashboard');
      } else {
        navigate(role === 'PATIENT' ? '/patient/complete-profile' : '/doctor/complete-profile');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const response = await api.post('/admin/auth/login', { username, password });
      localStorage.setItem('access_token', response.data.access_token);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid Credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.tabs}>
          <button className={role === 'PATIENT' ? styles.activeTab : styles.tab} onClick={() => { setRole('PATIENT'); setStep(1); }}>Patient</button>
          <button className={role === 'DOCTOR' ? styles.activeTab : styles.tab} onClick={() => { setRole('DOCTOR'); setStep(1); }}>Doctor</button>
          <button className={role === 'ADMIN' ? styles.activeTab : styles.tab} onClick={() => { setRole('ADMIN'); setStep(1); }}>Admin</button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {role === 'ADMIN' ? (
          <form onSubmit={handleAdminLogin}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Admin Username</label>
              <input type="text" className={styles.input} value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Password</label>
              <input type="password" className={styles.input} value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className={styles.submitBtn} disabled={loading}>Login to Admin</button>
          </form>
        ) : step === 1 ? (
          <form onSubmit={handleSendOtp}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email Address</label>
              <input type="email" className={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Enter to Login or Signup" />
            </div>
            <button type="submit" className={styles.submitBtn} disabled={loading}>{loading ? 'Sending...' : 'Send OTP'}</button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Enter 6-Digit OTP</label>
              <input type="text" maxLength={6} className={styles.input} value={otp} onChange={(e) => setOtp(e.target.value)} required style={{ letterSpacing: '0.5em', textAlign: 'center' }} />
            </div>
            <button type="submit" className={styles.submitBtn} disabled={loading}>Verify & Continue</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthPage;