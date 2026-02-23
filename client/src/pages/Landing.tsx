import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Landing.css';

const Landing: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-container">
            <header className="landing-hero">
                <h1>TeleCardio</h1>
                <p>Advanced Cardiac Care, Remote & Reliable.</p>
            </header>
            <div className="role-cards">
                <div className="card role-card" onClick={() => navigate('/login/patient')}>
                    <h2>Patient</h2>
                    <p>Book appointments & view history</p>
                </div>
                <div className="card role-card" onClick={() => navigate('/login/doctor')}>
                    <h2>Doctor</h2>
                    <p>Manage patients & prescribe</p>
                </div>
                <div className="card role-card" onClick={() => navigate('/login/admin')}>
                    <h2>Admin</h2>
                    <p>System management</p>
                </div>
            </div>
        </div>
    );
};

export default Landing;