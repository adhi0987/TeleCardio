import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from '../../api/axios';

const PatientLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/auth/login', { email, password });
      
      if (response.data.success) {
        toast.success('Welcome back!');
        navigate('/patient/dashboard');
      }
    } catch (error: any) {
      // Assuming your backend sends a 404 or a message containing "email" when the user isn't found
      const errorMessage = error.response?.data?.message?.toLowerCase() || "";
      if (error.response?.status === 404 || errorMessage.includes('email') || errorMessage.includes('user not found')) {
        toast.error("Email not found. Please sign up first!");
      } else {
        toast.error("Login failed. Check your credentials and try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl transform transition-all hover:-translate-y-1 duration-300">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Or{' '}
            <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
              create a new account today
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
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
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-md hover:shadow-lg"
            >
              Sign in
            </button>
          </div>
        </form>
        
        <div className="text-center mt-6 pt-6 border-t border-slate-100">
           <span className="text-slate-500 text-sm">Don't have an account? </span>
           <Link to="/signup" className="text-blue-600 font-semibold text-sm hover:underline">
             Sign up here
           </Link>
        </div>
      </div>
    </div>
  );
};

export default PatientLogin;