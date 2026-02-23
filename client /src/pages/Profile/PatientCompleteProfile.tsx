import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import styles from './Profile.module.css';

const PatientCompleteProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    age: '',
    blood_group: '',
    sex: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/patient/profile/complete', {
        ...formData,
        age: parseInt(formData.age)
      });
      navigate('/patient/dashboard');
    } catch (error) {
      alert('Failed to save profile. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Patient Details</h2>
        <p className={styles.subtitle}>Please provide your medical details to continue.</p>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Full Name</label>
            <input 
              type="text" className={styles.input} required 
              value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} 
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Phone Number</label>
            <input 
              type="tel" className={styles.input} required 
              value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} 
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Age</label>
            <input 
              type="number" min="0" max="120" className={styles.input} required 
              value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} 
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Blood Group</label>
            <select className={styles.input} required value={formData.blood_group} onChange={(e) => setFormData({...formData, blood_group: e.target.value})}>
              <option value="" disabled>Select...</option>
              <option value="A+">A+</option><option value="A-">A-</option>
              <option value="B+">B+</option><option value="B-">B-</option>
              <option value="AB+">AB+</option><option value="AB-">AB-</option>
              <option value="O+">O+</option><option value="O-">O-</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Sex</label>
            <select className={styles.input} required value={formData.sex} onChange={(e) => setFormData({...formData, sex: e.target.value})}>
              <option value="" disabled>Select...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Saving...' : 'Save Profile & Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PatientCompleteProfile;