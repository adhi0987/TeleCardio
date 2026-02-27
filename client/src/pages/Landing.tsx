// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../styles/Landing.css';

// const Landing: React.FC = () => {
//     const navigate = useNavigate();

//     return (
//         <div className="landing-container">
//             <header className="landing-hero">
//                 <h1>TeleCardio</h1>
//                 <p>Advanced Cardiac Care, Remote & Reliable.</p>
//             </header>
//             <div className="role-cards">
//                 <div className="card role-card" onClick={() => navigate('/login/patient')}>
//                     <h2>Patient</h2>
//                     <p>Book appointments & view history</p>
//                 </div>
//                 <div className="card role-card" onClick={() => navigate('/login/doctor')}>
//                     <h2>Doctor</h2>
//                     <p>Manage patients & prescribe</p>
//                 </div>
//                 <div className="card role-card" onClick={() => navigate('/login/admin')}>
//                     <h2>Admin</h2>
//                     <p>System management</p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Landing;

import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', alignItems: 'center', 
      justifyContent: 'center', height: '100vh', backgroundColor: '#f0f4f8' 
    }}>
      <h1 style={{ fontSize: '3rem', color: '#1a56db', marginBottom: '1rem' }}>TeleCardio</h1>
      <p style={{ fontSize: '1.2rem', color: '#4b5563', marginBottom: '2rem' }}>
        Advanced Cardiovascular Telemedicine Solutions
      </p>
      <button 
        onClick={() => navigate('/login')}
        style={{
          padding: '1rem 2rem', fontSize: '1.1rem', backgroundColor: '#1a56db',
          color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer',
          fontWeight: 'bold', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}
      >
        Get Started / Login
      </button>
    </div>
  );
};

export default Landing;