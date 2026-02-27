// // import React from 'react';
// // import { useAuth } from '../context/AuthContext';
// // import { useNavigate } from 'react-router-dom';
// // import '../styles/Navbar.css'; // Import the CSS

// // interface NavbarProps {
// //     role: string;
// // }

// // const Navbar: React.FC<NavbarProps> = ({ role }) => {
// //     const { logout, user } = useAuth();
// //     const navigate = useNavigate();

// //     return (
// //         <nav style={{ 
// //             display: 'flex', justifyContent: 'space-between', padding: '1rem', 
// //             background: '#007bff', color: 'white', alignItems: 'center' 
// //         }}>
// //             <h2 style={{ margin: 0, cursor: 'pointer' }} onClick={() => navigate('/')}>
// //                 TeleCardio <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>| {role}</span>
// //             </h2>
// //             <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
// //                 <span>{user?.email}</span>
// //                 <button 
// //                     onClick={logout}
// //                     style={{ 
// //                         background: 'white', color: '#007bff', border: 'none', 
// //                         padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' 
// //                     }}
// //                 >
// //                     Logout
// //                 </button>
// //             </div>
// //         </nav>
// //     );
// // };

// // export default Navbar;
// // client/src/components/Navbar.tsx
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../styles/Navbar.css';

// const Navbar: React.FC = () => {
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     // Clear AuthContext here if applicable
//     navigate('/');
//   };

//   return (
//     <nav className="navbar">
//       <div className="navbar-left">
//         {/* Redirects to dashboard depending on user role, or landing page */}
//         <h1 className="company-name" onClick={() => navigate('/')}>TeleCardio</h1>
//       </div>

//       <div className="navbar-right">
//         <div className="profile-menu">
//           {/* A simple profile icon setup */}
//           <div 
//             className="profile-icon" 
//             onClick={() => setDropdownOpen(!dropdownOpen)}
//           >
//             👤 
//           </div>

//           {dropdownOpen && (
//             <div className="dropdown">
//               <button onClick={() => { setDropdownOpen(false); navigate('/profile-complete'); }}>
//                 My Profile
//               </button>
//               <button onClick={handleLogout}>
//                 Logout
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  const handleMyProfile = () => {
    setIsDropdownOpen(false);
    // In a real app, this might go to a view-only profile page, but we'll route to profile completion for now
    navigate('/profile-complete');
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-left">
        <h2 className="brand-title" onClick={() => navigate('/')}>TeleCardio</h2>
      </div>

      <div className="navbar-right">
        <div className="profile-wrapper">
          <button 
            className="profile-icon-btn" 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </button>

          {isDropdownOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-item" onClick={handleMyProfile}>
                My Profile
              </div>
              <div className="dropdown-divider"></div>
              <div className="dropdown-item text-danger" onClick={handleLogout}>
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;