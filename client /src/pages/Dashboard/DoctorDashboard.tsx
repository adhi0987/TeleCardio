import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PenTool, CheckCircle, LogOut, X } from 'lucide-react';
import api from '../../api/axios';
import styles from './Dashboard.module.css';

interface Appointment { id: number; appointment_date: string; status: string; illness_description: string; }

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAptId, setSelectedAptId] = useState<number | null>(null);
  const [prescription, setPrescription] = useState({ notes: '', tests: [] as string[] });

  const testOptions = ["Troponin Test", "Lipid Profile", "hs-CRP", "ECG", "Echocardiogram"];

  useEffect(() => { fetchAppointments(); }, []);

  const fetchAppointments = async () => {
    const res = await api.get('/appointments/doctor');
    setAppointments(res.data);
  };

  const handleLogout = () => { localStorage.removeItem('access_token'); navigate('/'); };

  const toggleTest = (test: string) => {
    setPrescription(prev => {
      const tests = prev.tests.includes(test) ? prev.tests.filter(t => t !== test) : [...prev.tests, test];
      return { ...prev, tests };
    });
  };

  const submitPrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAptId) return;
    await api.post('/appointments/prescribe', { appointment_id: selectedAptId, notes: prescription.notes, recommended_tests: prescription.tests });
    setIsModalOpen(false);
    fetchAppointments();
    setPrescription({ notes: '', tests: [] });
  };

  return (
    <div className={styles.pageContainer}>
      <nav className={styles.navbar} style={{ backgroundColor: '#234e52' }}> {/* Teal for doctors */}
        <h1 className={styles.navTitle}>TeleCardio 🫀</h1>
        <div className={styles.navRight}>
          <span>Doctor Portal</span>
          <button onClick={handleLogout} className={styles.logoutBtn}><LogOut size={18} /> Logout</button>
        </div>
      </nav>

      <main className={styles.mainContent}>
        <div className={styles.headerRow}>
          <h2 className={styles.pageTitle}>Patient Queue</h2>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.dataTable}>
            <thead>
              <tr><th>Date & Time</th><th>Symptoms</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {appointments.map((apt) => (
                <tr key={apt.id}>
                  <td>{new Date(apt.appointment_date).toLocaleString()}</td>
                  <td>{apt.illness_description}</td>
                  <td><span className={apt.status === 'Pending' ? styles.badgePending : styles.badgeResponded}>{apt.status}</span></td>
                  <td>
                    {apt.status === 'Pending' ? (
                      <button onClick={() => { setSelectedAptId(apt.id); setIsModalOpen(true); }} className={styles.actionBtn}>
                        <PenTool size={18} /> Prescribe
                      </button>
                    ) : <span style={{ color: '#38a169', fontWeight: 'bold' }}><CheckCircle size={18} /> Responded</span>}
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
            <h2>Write Prescription</h2>
            <form onSubmit={submitPrescription}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Clinical Notes</label>
                <textarea rows={4} className={styles.input} required value={prescription.notes} onChange={e => setPrescription({...prescription, notes: e.target.value})} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Recommend Tests</label>
                <div className={styles.checkboxGrid}>
                  {testOptions.map(test => (
                    <label key={test} className={styles.checkboxLabel}>
                      <input type="checkbox" checked={prescription.tests.includes(test)} onChange={() => toggleTest(test)} />
                      {test}
                    </label>
                  ))}
                </div>
              </div>
              <button type="submit" className={styles.submitBtn}>Submit Prescription</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;