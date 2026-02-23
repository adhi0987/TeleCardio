import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from '../../api/axios';

const PatientSignup = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation before hitting the backend
    if (password !== confirmPassword) {
      toast.error("Passwords do not match. Please try again.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    try {
      // Adjust the endpoint payload keys if your backend expects different names (e.g., first_name, last_name)
      const response = await axios.post('/patient/register', { 
        name: fullName, 
        email, 
        password 
      });
      
      // Assuming your backend responds with a success flag or standard 2xx status
      if (response.status === 200 || response.status === 201) {
        toast.success('Account created successfully! You can now log in.');
        navigate('/login');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.response?.data?.message || "Registration failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl transform transition-all hover:-translate-y-1 duration-300">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-slate-900">
            Create an Account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Join TeleCardio today
          </p>
        </div>
        
        <form className="mt-8 space-y-5" onSubmit={handleSignup}>
          <div className="space-y-4">
            <div>
              <label htmlFor="full-name" className="text-sm font-medium text-slate-700">Full Name</label>
              <input
                id="full-name"
                name="fullName"
                type="text"
                required
                className="mt-1 appearance-none rounded-lg block w-full px-4 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="email-address" className="text-sm font-medium text-slate-700">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                className="mt-1 appearance-none rounded-lg block w-full px-4 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-medium text-slate-700">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 appearance-none rounded-lg block w-full px-4 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="confirm-password" className="text-sm font-medium text-slate-700">Confirm Password</label>
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                required
                className="mt-1 appearance-none rounded-lg block w-full px-4 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-md hover:shadow-lg"
            >
              Sign up
            </button>
          </div>
        </form>
        
        <div className="text-center mt-6 pt-6 border-t border-slate-100">
           <span className="text-slate-500 text-sm">Already have an account? </span>
           {/* Option to go to login page */}
           <Link to="/login" className="text-blue-600 font-semibold text-sm hover:underline">
             Log in here
           </Link>
        </div>
      </div>
    </div>
  );
};

export default PatientSignup;