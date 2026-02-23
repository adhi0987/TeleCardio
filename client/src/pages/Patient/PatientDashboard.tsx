import React, { useEffect, useState } from 'react';
import { appointmentApi, doctorApi } from '../../api/api';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import type { Appointment, Doctor } from '../../types';

const PatientDashboard: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [showBookModal, setShowBookModal] = useState<boolean>(false);
    
    // Form State
    const [selectedDoctor, setSelectedDoctor] = useState<string>('');
    const [date, setDate] = useState<string>('');
    const [desc, setDesc] = useState<string>('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const apptRes = await appointmentApi.getPatientAppointments();
            const docRes = await doctorApi.list();
            setAppointments(apptRes.data);
            setDoctors(docRes.data);
        } catch (err) {
            toast.error("Error fetching data");
        }
    };

    const handleBook = async () => {
        if (!selectedDoctor || !date) return toast.warning("Please fill all fields");
        try {
            await appointmentApi.book({
                doctor_id: selectedDoctor,
                appointment_date: date,
                illness_description: desc
            });
            toast.success("Appointment Booked!");
            setShowBookModal(false);
            fetchData();
        } catch (err) {
            toast.error("Booking failed");
        }
    };

    return (
        <div>
            <Navbar role="Patient" />
            <div className="container">
                <button className="btn btn-primary" onClick={() => setShowBookModal(true)}>+ Book Appointment</button>

                <div className="card">
                    <h3>My Appointments</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Date</th>
                                <th>Doctor ID</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((appt, index) => (
                                <tr key={appt.id}>
                                    <td>{index + 1}</td>
                                    <td>{new Date(appt.appointment_date).toLocaleString()}</td>
                                    <td>{appt.doctor_id}</td>
                                    <td>{appt.status}</td>
                                    <td>
                                        <button className="btn btn-outline">View</button>
                                        {appt.status === 'COMPLETED' && <button className="btn btn-success">Download Rx</button>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {showBookModal && (
                    <div className="modal-overlay">
                        <div className="card modal-content">
                            <h3>Book Appointment</h3>
                            <select 
                                value={selectedDoctor}
                                onChange={(e) => setSelectedDoctor(e.target.value)}
                                style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                            >
                                <option value="">Select Doctor</option>
                                {doctors.map(d => (
                                    <option key={d.id} value={d.id}>{d.name} - {d.specialization}</option>
                                ))}
                            </select>
                            <input 
                                type="datetime-local" 
                                value={date}
                                onChange={(e) => setDate(e.target.value)} 
                                style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                            />
                            <textarea 
                                placeholder="Describe Illness" 
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}
                                style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                            />
                            <div className="modal-actions">
                                <button className="btn btn-primary" onClick={handleBook}>Confirm</button>
                                <button className="btn btn-danger" onClick={() => setShowBookModal(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientDashboard;