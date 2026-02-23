import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
import type { LoginResponse, Doctor, Appointment, Prescription } from "../types";

const API_URL = 'http://localhost:8000/api';

const api: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add Token
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const patientApi = {
    sendOtp: (email: string) => api.post('/patient/auth/send-otp', { email, role: 'PATIENT' }),
    verifyOtp: (email: string, otp_code: string) => api.post<LoginResponse>('/patient/auth/verify-otp', { email, otp_code }),
    completeProfile: (data: any) => api.post('/patient/profile/complete', data),
};

export const doctorApi = {
    sendOtp: (email: string) => api.post('/doctor/auth/send-otp', { email, role: 'DOCTOR' }),
    verifyOtp: (email: string, otp_code: string) => api.post<LoginResponse>('/doctor/auth/verify-otp', { email, otp_code }),
    list: () => api.get<Doctor[]>('/doctor/list'),
};

export const adminApi = {
    login: (username: string, password: string) => api.post<LoginResponse>('/admin/auth/login', { username, password }),
};

export const appointmentApi = {
    book: (data: { doctor_id: string; appointment_date: string; illness_description: string }) => 
        api.post<Appointment>('/appointments/book', data),
    
    getPatientAppointments: () => api.get<Appointment[]>('/appointments/patient'),
    
    getDoctorAppointments: () => api.get<Appointment[]>('/appointments/doctor'),
    
    prescribe: (data: { appointment_id: number; notes: string; recommended_tests: string[] }) => 
        api.post<Prescription>('/appointments/prescribe', data),
};

export const aiApi = {
    analyzeEcg: (formData: FormData) => api.post('/ai/analyze-ecg', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
};

export default api;