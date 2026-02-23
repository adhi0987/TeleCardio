import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarPlus, FileText, Download, LogOut, X } from 'lucide-react';
import api from '../../api/axios';

// TypeScript Interfaces for our data
interface Appointment {
  id: number;
  doctor_id: string;
  appointment_date: string;
  status: string;
  illness_description: string;
}

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState<{id: string, name: string, specialization: string}[]>([]);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingData, setBookingData] = useState({
    doctor_id: '',
    appointment_date: '',
    illness_description: ''
  });

  // Fetch Appointments on Load
  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/doctor/list');
      setDoctors(response.data);
    } catch (error) {
      console.error("Failed to fetch doctors", error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments/patient');
      setAppointments(response.data);
    } catch (error) {
      console.error("Failed to fetch appointments", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/');
  };

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/appointments/book', bookingData);
      setIsModalOpen(false);
      fetchAppointments(); // Refresh the table
      setBookingData({ doctor_id: '', appointment_date: '', illness_description: '' });
    } catch (error) {
      console.error("Failed to book appointment", error);
      alert("Failed to book appointment. Please make sure all fields are filled.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 text-white bg-blue-600 shadow-md">
        <h1 className="text-2xl font-bold">TeleCardio 🫀</h1>
        <div className="flex items-center gap-4">
          <span className="font-medium">Patient Portal</span>
          <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 transition bg-blue-700 rounded hover:bg-blue-800">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl p-8 mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-800">My Appointments</h2>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 font-bold text-white bg-green-600 rounded-lg shadow hover:bg-green-700"
          >
            <CalendarPlus size={20} /> Book Appointment
          </button>
        </div>

        {/* Appointments Table */}
        <div className="overflow-hidden bg-white rounded-lg shadow">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-4 font-semibold text-gray-700">S.No</th>
                <th className="p-4 font-semibold text-gray-700">Date & Time</th>
                <th className="p-4 font-semibold text-gray-700">Status</th>
                <th className="p-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="p-4 text-center text-gray-500">Loading appointments...</td></tr>
              ) : appointments.length === 0 ? (
                <tr><td colSpan={4} className="p-4 text-center text-gray-500">No appointments found. Book one today!</td></tr>
              ) : (
                appointments.map((apt, index) => (
                  <tr key={apt.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 text-gray-800">{index + 1}</td>
                    <td className="p-4 text-gray-800">
                      {new Date(apt.appointment_date).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                        apt.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="p-4 flex gap-3">
                      {apt.status === 'Responded' ? (
                        <>
                          <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800">
                            <FileText size={18} /> View
                          </button>
                          <button className="flex items-center gap-1 text-gray-600 hover:text-gray-800">
                            <Download size={18} /> PDF
                          </button>
                        </>
                      ) : (
                        <span className="text-gray-400 text-sm">Waiting for doctor...</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Booking Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
              <X size={24} />
            </button>
            <h3 className="mb-4 text-2xl font-bold text-gray-800">Book Appointment</h3>
            
            <form onSubmit={handleBookAppointment} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Select Doctor</label>
                <select
                  required
                  className="w-full px-4 py-2 bg-white border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={bookingData.doctor_id}
                  onChange={(e) => setBookingData({...bookingData, doctor_id: e.target.value})}
                >
                  <option value="" disabled>-- Choose a Cardiologist --</option>
                  {doctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      Dr. {doc.name} ({doc.specialization})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Date & Time</label>
                <input 
                  type="datetime-local" 
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={bookingData.appointment_date}
                  onChange={(e) => setBookingData({...bookingData, appointment_date: e.target.value})}
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Describe Your Symptoms</label>
                <textarea 
                  required
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="I have been experiencing mild chest pain..."
                  value={bookingData.illness_description}
                  onChange={(e) => setBookingData({...bookingData, illness_description: e.target.value})}
                ></textarea>
              </div>

              <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                Confirm Booking
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;