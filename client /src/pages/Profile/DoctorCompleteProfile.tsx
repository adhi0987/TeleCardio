import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import styles from './Profile.module.css';

const DoctorCompleteProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    specialization: 'Cardiologist',
    nmr_number: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/doctor/profile/complete', formData);
      navigate('/doctor/dashboard');
    } catch (error) {
      alert('Failed to save profile. Make sure your NMR is unique.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Doctor Registration</h2>
        <p className={styles.subtitle}>Please provide your medical credentials to activate your account.</p>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Full Name (Dr.)</label>
            <input 
              type="text" className={styles.input} required 
              value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} 
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>National Medical Register (NMR) Number</label>
            <input 
              type="text" className={styles.input} required 
              placeholder="e.g. NMR-12345678"
              value={formData.nmr_number} onChange={(e) => setFormData({...formData, nmr_number: e.target.value})} 
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Specialization</label>
            <input 
              type="text" className={styles.input} disabled 
              value={formData.specialization} 
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Verifying...' : 'Complete Registration'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DoctorCompleteProfile;