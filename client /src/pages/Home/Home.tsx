import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.heroContainer}>
      <h1 className={styles.title}>TeleCardio 🫀</h1>
      <p className={styles.subtitle}>
        Advanced Cardiology Telemedicine. Connecting patients with top specialists through seamless digital prescriptions and AI-powered analysis.
      </p>
      <button className={styles.ctaButton} onClick={() => navigate('/auth')}>
        Login / Get Started
      </button>
    </div>
  );
};

export default Home;