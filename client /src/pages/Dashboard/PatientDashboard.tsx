import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarPlus, FileText, Download, LogOut, X } from 'lucide-react';
import api from '../../api/axios';
import styles from './Dashboard.module.css';

interface Appointment { id: number; appointment_date: string; status: string; illness_description: string; }
interface Doctor { id: string; name: string; specialization: string; }

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingData, setBookingData] = useState({ doctor_id: '', appointment_date: '', illness_description: '' });

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, []);

  const fetchAppointments = async () => {
    const res = await api.get('/appointments/patient');
    setAppointments(res.data);
  };

  const fetchDoctors = async () => {
    const res = await api.get('/doctor/list');
    setDoctors(res.data);
  };

  const handleLogout = () => { localStorage.removeItem('access_token'); navigate('/'); };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/appointments/book', bookingData);
    setIsModalOpen(false);
    fetchAppointments();
    setBookingData({ doctor_id: '', appointment_date: '', illness_description: '' });
  };

  return (
    <div className={styles.pageContainer}>
      <nav className={styles.navbar}>
        <h1 className={styles.navTitle}>TeleCardio 🫀</h1>
        <div className={styles.navRight}>
          <span>Patient Portal</span>
          <button onClick={handleLogout} className={styles.logoutBtn}><LogOut size={18} /> Logout</button>
        </div>
      </nav>

      <main className={styles.mainContent}>
        <div className={styles.headerRow}>
          <h2 className={styles.pageTitle}>My Appointments</h2>
          <button onClick={() => setIsModalOpen(true)} className={styles.primaryBtn}><CalendarPlus size={20} /> Book Appointment</button>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.dataTable}>
            <thead>
              <tr><th>S.No</th><th>Date & Time</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {appointments.map((apt, idx) => (
                <tr key={apt.id}>
                  <td>{idx + 1}</td>
                  <td>{new Date(apt.appointment_date).toLocaleString()}</td>
                  <td><span className={apt.status === 'Pending' ? styles.badgePending : styles.badgeResponded}>{apt.status}</span></td>
                  <td>
                    {apt.status === 'Responded' ? (
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className={styles.actionBtn}><FileText size={18}/> View</button>
                        <button className={styles.actionBtn}><Download size={18}/> PDF</button>
                      </div>
                    ) : <span>Waiting for doctor...</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button onClick={() => setIsModalOpen(false)} className={styles.closeModalBtn}><X size={24} /></button>
            <h2>Book Appointment</h2>
            <form onSubmit={handleBook}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Select Doctor</label>
                <select className={styles.input} required value={bookingData.doctor_id} onChange={e => setBookingData({...bookingData, doctor_id: e.target.value})}>
                  <option value="" disabled>-- Choose a Cardiologist --</option>
                  {doctors.map(doc => <option key={doc.id} value={doc.id}>Dr. {doc.name} ({doc.specialization})</option>)}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Date & Time</label>
                <input type="datetime-local" className={styles.input} required value={bookingData.appointment_date} onChange={e => setBookingData({...bookingData, appointment_date: e.target.value})} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Symptoms</label>
                <textarea rows={3} className={styles.input} required value={bookingData.illness_description} onChange={e => setBookingData({...bookingData, illness_description: e.target.value})} />
              </div>
              <button type="submit" className={styles.submitBtn}>Confirm Booking</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;