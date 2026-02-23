import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-6 bg-white shadow-sm">
        <div className="flex items-center gap-2">
          {/* Heartbeat Icon */}
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
          <span className="text-2xl font-bold tracking-tight text-blue-900">TeleCardio</span>
        </div>
        <div className="space-x-4">
          <Link to="/login" className="px-4 py-2 text-blue-600 font-medium hover:text-blue-800 transition-colors">Log In</Link>
          <Link to="/signup" className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-full shadow-md hover:bg-blue-700 hover:shadow-lg transition-all transform hover:-translate-y-0.5">
            Sign Up Now
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col md:flex-row items-center justify-center p-8 md:p-16 gap-12 max-w-7xl mx-auto">
        <div className="flex-1 space-y-8 animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-slate-800 drop-shadow-sm">
            Your Heart's Health, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              One Click Away.
            </span>
          </h1>
          <p className="text-lg text-slate-600 max-w-lg leading-relaxed">
            Connect with top cardiologists instantly. Get remote diagnostics, continuous monitoring, and expert advice from the comfort of your home.
          </p>
          <div className="flex gap-4 pt-4">
             <Link to="/signup" className="px-8 py-3 bg-blue-600 text-white rounded-full font-semibold shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              Get Started
            </Link>
            <Link to="/login" className="px-8 py-3 bg-white text-slate-700 border border-slate-200 rounded-full font-semibold shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all duration-300">
              Patient Login
            </Link>
          </div>
        </div>
        
        <div className="flex-1 w-full max-w-lg relative animate-fade-in">
          {/* Glowing background blob behind image */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-200 to-cyan-100 rounded-full blur-3xl opacity-60"></div>
          <img 
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
            alt="Doctor consulting online" 
            className="relative z-10 rounded-2xl shadow-2xl border-4 border-white transform hover:scale-[1.02] transition-transform duration-500 object-cover h-[500px] w-full"
          />
        </div>
      </main>
    </div>
  );
};

export default LandingPage;