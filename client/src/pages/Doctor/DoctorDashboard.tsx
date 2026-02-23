import React, { useEffect, useState } from 'react';
import { appointmentApi, aiApi } from '../../api/api';
import Navbar from '../../components/Navbar';
import { toast } from 'react-toastify';
import { format, isToday, isYesterday, differenceInDays } from 'date-fns';

import '../../styles/Doctor.css';
import type { Appointment } from '../../types';

const DoctorDashboard: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
    const [showPrescribeModal, setShowPrescribeModal] = useState<boolean>(false);
    
    // Prescription State
    const [notes, setNotes] = useState<string>('');
    const [tests, setTests] = useState<string[]>([]);
    
    // AI State
    const [ecgFile, setEcgFile] = useState<File | null>(null);
    const [aiResult, setAiResult] = useState<string>('');

    useEffect(() => {
        fetchAppts();
    }, []);

    const fetchAppts = async () => {
        try {
            const res = await appointmentApi.getDoctorAppointments();
            setAppointments(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const getRowClass = (dateString: string) => {
        const date = new Date(dateString);
        if (isToday(date)) return 'row-today';
        if (isYesterday(date)) return 'row-yesterday';
        if (differenceInDays(new Date(), date) >= 2) return 'row-late';
        return '';
    };

    const handlePrescribeSubmit = async () => {
        if (!selectedAppt) return;
        try {
            await appointmentApi.prescribe({
                appointment_id: selectedAppt.id,
                notes: notes,
                recommended_tests: tests
            });
            toast.success("Prescription Sent!");
            setShowPrescribeModal(false);
            fetchAppts();
        } catch (err) {
            toast.error("Failed to send prescription");
        }
    };

    const handleTestChange = (test: string) => {
        setTests(prev => prev.includes(test) ? prev.filter(t => t !== test) : [...prev, test]);
    };

    const analyzeECG = async () => {
        if (!ecgFile) return;
        const formData = new FormData();
        formData.append('file', ecgFile);
        try {
            const res = await aiApi.analyzeEcg(formData);
            setAiResult(JSON.stringify(res.data, null, 2));
        } catch (err) {
            toast.error("AI Analysis Failed");
        }
    };

    return (
        <div>
            <Navbar role="Doctor" />
            <div className="container">
                <div className="dashboard-grid">
                    {/* Appointments Column */}
                    <div className="card full-width">
                        <h3>Pending Appointments</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>Date</th>
                                    <th>Patient ID</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map((appt, idx) => (
                                    <tr key={appt.id} className={getRowClass(appt.appointment_date)}>
                                        <td>{idx + 1}</td>
                                        <td>{format(new Date(appt.appointment_date), 'yyyy-MM-dd HH:mm')}</td>
                                        <td>{appt.patient_id}</td>
                                        <td>
                                            <button className="btn btn-outline" onClick={() => alert(appt.illness_description)}>View Illness</button>
                                            <button className="btn btn-primary" onClick={() => { setSelectedAppt(appt); setShowPrescribeModal(true); }}>Write Rx</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* AI Tools Column */}
                    <div className="card">
                        <h3>ECG Report Analyzer</h3>
                        <input type="file" accept="image/*" onChange={(e) => e.target.files && setEcgFile(e.target.files[0])} />
                        <button className="btn btn-warning" onClick={analyzeECG} style={{marginTop: '10px'}}>Analyze</button>
                        {aiResult && <pre className="code-block" style={{background: '#eee', padding: '10px', marginTop: '10px'}}>{aiResult}</pre>}
                    </div>
                </div>

                {showPrescribeModal && (
                    <div className="modal-overlay">
                        <div className="card modal-content">
                            <h3>Write Prescription</h3>
                            <textarea rows={5} placeholder="Doctor's Notes..." onChange={(e) => setNotes(e.target.value)}></textarea>
                            
                            <h4>Recommended Tests</h4>
                            <div className="checkbox-group">
                                {['Troponin test', 'Lipid Profile', 'hs-CRP', 'BNP/NT-proBNP'].map(t => (
                                    <label key={t} style={{display:'block', margin: '5px 0'}}>
                                        <input type="checkbox" onChange={() => handleTestChange(t)} /> {t}
                                    </label>
                                ))}
                            </div>

                            <div className="modal-actions">
                                <button className="btn btn-primary" onClick={handlePrescribeSubmit}>Send Prescription</button>
                                <button className="btn btn-danger" onClick={() => setShowPrescribeModal(false)}>Close</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorDashboard;