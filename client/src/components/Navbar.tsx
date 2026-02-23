import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.css'; // Import the CSS

interface NavbarProps {
    role: string;
}

const Navbar: React.FC<NavbarProps> = ({ role }) => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    return (
        <nav style={{ 
            display: 'flex', justifyContent: 'space-between', padding: '1rem', 
            background: '#007bff', color: 'white', alignItems: 'center' 
        }}>
            <h2 style={{ margin: 0, cursor: 'pointer' }} onClick={() => navigate('/')}>
                TeleCardio <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>| {role}</span>
            </h2>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span>{user?.email}</span>
                <button 
                    onClick={logout}
                    style={{ 
                        background: 'white', color: '#007bff', border: 'none', 
                        padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' 
                    }}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;