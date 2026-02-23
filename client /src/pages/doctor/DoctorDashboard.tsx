import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PenTool, CheckCircle, LogOut, X } from 'lucide-react';
import api from '../../api/axios';

interface Appointment {
  id: number;
  patient_id: string;
  appointment_date: string;
  status: string;
  illness_description: string;
}

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Prescription Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);
  const [prescriptionData, setPrescriptionData] = useState({
    notes: '',
    recommended_tests: [] as string[]
  });

  const testOptions = ["Troponin Test", "Lipid Profile", "hs-CRP", "ECG", "Echocardiogram"];

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments/doctor');
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

  const toggleTest = (testName: string) => {
    setPrescriptionData(prev => {
      const tests = prev.recommended_tests.includes(testName)
        ? prev.recommended_tests.filter(t => t !== testName)
        : [...prev.recommended_tests, testName];
      return { ...prev, recommended_tests: tests };
    });
  };

  const handleSubmitPrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointmentId) return;

    try {
      await api.post('/appointments/prescribe', {
        appointment_id: selectedAppointmentId,
        notes: prescriptionData.notes,
        recommended_tests: prescriptionData.recommended_tests
      });
      setIsModalOpen(false);
      fetchAppointments(); // Refresh the table
      setPrescriptionData({ notes: '', recommended_tests: [] });
    } catch (error) {
      console.error("Failed to submit prescription", error);
      alert("Failed to submit prescription.");
    }
  };

  const openPrescriptionModal = (aptId: number) => {
    setSelectedAppointmentId(aptId);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="flex items-center justify-between px-8 py-4 text-white bg-teal-700 shadow-md">
        <h1 className="text-2xl font-bold">TeleCardio 🫀</h1>
        <div className="flex items-center gap-4">
          <span className="font-medium">Doctor Portal</span>
          <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 transition bg-teal-800 rounded hover:bg-teal-900">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </nav>

      <main className="max-w-6xl p-8 mx-auto">
        <h2 className="mb-8 text-3xl font-bold text-gray-800">My Patient Queue</h2>

        <div className="overflow-hidden bg-white rounded-lg shadow">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-4 font-semibold text-gray-700">Date & Time</th>
                <th className="p-4 font-semibold text-gray-700">Symptoms</th>
                <th className="p-4 font-semibold text-gray-700">Status</th>
                <th className="p-4 font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="p-4 text-center text-gray-500">Loading schedule...</td></tr>
              ) : appointments.length === 0 ? (
                <tr><td colSpan={4} className="p-4 text-center text-gray-500">No appointments scheduled.</td></tr>
              ) : (
                appointments.map((apt) => (
                  <tr key={apt.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 text-gray-800">{new Date(apt.appointment_date).toLocaleString()}</td>
                    <td className="p-4 text-gray-600 max-w-xs truncate" title={apt.illness_description}>
                      {apt.illness_description}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                        apt.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {apt.status === 'Pending' ? (
                        <button 
                          onClick={() => openPrescriptionModal(apt.id)}
                          className="flex items-center gap-1 px-3 py-1 text-sm font-bold text-white bg-blue-600 rounded hover:bg-blue-700"
                        >
                          <PenTool size={16} /> Prescribe
                        </button>
                      ) : (
                        <span className="flex items-center gap-1 text-sm font-bold text-green-600">
                          <CheckCircle size={16} /> Responded
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Write Prescription Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
              <X size={24} />
            </button>
            <h3 className="mb-4 text-2xl font-bold text-gray-800">Write Prescription</h3>
            
            <form onSubmit={handleSubmitPrescription} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Clinical Notes</label>
                <textarea 
                  required
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Patient requires rest. Prescribed Beta-blockers..."
                  value={prescriptionData.notes}
                  onChange={(e) => setPrescriptionData({...prescriptionData, notes: e.target.value})}
                ></textarea>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Recommend Tests</label>
                <div className="grid grid-cols-2 gap-2">
                  {testOptions.map(test => (
                    <label key={test} className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                      <input 
                        type="checkbox" 
                        checked={prescriptionData.recommended_tests.includes(test)}
                        onChange={() => toggleTest(test)}
                        className="w-4 h-4 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="text-sm text-gray-700">{test}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit" className="w-full px-4 py-2 mt-4 font-bold text-white bg-teal-600 rounded-lg hover:bg-teal-700">
                Submit Prescription
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;