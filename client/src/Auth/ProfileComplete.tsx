// import React, { useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import '../styles/Auth.css';
// import { patientApi, doctorApi } from '../api/api';

// const ProfileComplete: React.FC = () => {
//     const { role } = useParams<{ role: string }>();
//     const navigate = useNavigate();
    
//     // Unified state for both roles
//     const [formData, setFormData] = useState({
//         name: '',
//         phone: '',
//         age: 0,
//         blood_group: '',
//         sex: 'Male',
//         specialization: 'Cardiologist', // Doctor only
//         nmr_number: '' // Doctor only
//     });

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async () => {
//         try {
//             if (role === 'patient') {
//                 const res = await patientApi.completeProfile({
//                     name: formData.name,
//                     phone: formData.phone,
//                     age: Number(formData.age),
//                     blood_group: formData.blood_group,
//                     sex: formData.sex
//                 });
//                 console.log("Patient Profile Completion Response:", res);
//                 if (res.status === 200) {
//                     toast.success("Profile Completed!");
//                     navigate(`/${role}-dashboard`);
//                 } else if(res.status === 400) {
//                     toast.success("Profile already completed. Redirecting to dashboard...");
//                     navigate(`/${role}-dashboard`); 
//                 }else {
//                     toast.error("Unexpected response from server. Please try again.");
//                 }
//             } else if (role === 'doctor') {
//                 const res =await doctorApi.completeProfile({
//                     name: formData.name,
//                     specialization: formData.specialization,
//                     nmr_number: formData.nmr_number
//                 });
//                 console.log("Doctor Profile Completion Response:", res);
//                 if (res.status === 200) {
//                     toast.success("Profile Completed!");
//                     navigate(`/${role}-dashboard`);
//                 } else if(res.status === 400) {
//                     toast.success("Profile already completed. Redirecting to dashboard...");
//                     navigate(`/${role}-dashboard`); 
//                 } else {
//                     toast.error("Unexpected response from server. Please try again.");
//                 }
//             }
//             toast.success("Profile Completed!");
//             navigate(`/${role}-dashboard`);
//         } catch (err: any) {
//             console.error("Profile Completion Error:", err);
//             if(err.isAxiosError && err.response) {
//                 if(err.response.status === 400) {
//                     toast.success("Profile already completed. Redirecting to dashboard...");
//                     navigate(`/${role}-dashboard`); 
//                     return;
//                 }
//                 // toast.error("Failed to update profile. Ensure you are logged in.");
//             }
//         }
//     };

//     return (
//         <div className="auth-container">
//             <div className="card auth-card">
//                 <h3>Complete Your Profile</h3>
                
//                 <input className="form-input" name="name" placeholder="Full Name" onChange={handleChange} />
                
//                 {role === 'patient' && (
//                     <>
//                         <input className="form-input" name="phone" placeholder="Phone Number" onChange={handleChange} />
//                         <input className="form-input" name="age" type="number" placeholder="Age" onChange={handleChange} />
//                         <input className="form-input" name="blood_group" placeholder="Blood Group (e.g., O+)" onChange={handleChange} />
//                         <select className="form-input" name="sex" onChange={handleChange}>
//                             <option value="Male">Male</option>
//                             <option value="Female">Female</option>
//                         </select>
//                     </>
//                 )}

//                 {role === 'doctor' && (
//                     <>
//                         <input className="form-input" name="nmr_number" placeholder="NMR Number" onChange={handleChange} />
//                         <input className="form-input" name="specialization" placeholder="Specialization" defaultValue="Cardiologist" onChange={handleChange} />
//                     </>
//                 )}

//                 <button className="btn btn-primary full-width" onClick={handleSubmit}>Save & Continue</button>
//             </div>
//         </div>
//     );
// };

// export default ProfileComplete;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import '../styles/Auth.css';

const ProfileComplete: React.FC = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('userRole') || 'patient';
  const identity = localStorage.getItem('userIdentity'); // email or nmr

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    sex: '',
    bloodGroup: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        role,
        email: role === 'patient' ? identity : undefined,
        nmrNumber: role === 'doctor' ? identity : undefined,
        ...formData
      };
      
      await api.post('/api/auth/complete-profile', payload);
      alert("Profile setup complete!");
      navigate(`/${role}-dashboard`);
    } catch (error) {
      alert("Failed to save profile details.");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">Complete Your Profile</h2>
        <p className="auth-subtitle">Please provide your details to continue</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
          <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
          
          <select name="sex" value={formData.sex} onChange={handleChange} required>
            <option value="" disabled>Select Sex</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} required>
            <option value="" disabled>Select Blood Group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>

          <button type="submit" className="btn-primary">Save & Continue</button>
        </form>
      </div>
    </div>
  );
};

export default ProfileComplete;