
import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosError,
} from "axios";
import type {
  LoginResponse,
  Doctor,
  Appointment,
  Prescription,
} from "../types";

const API_URL = "http://localhost:8000";

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Debug flag: enabled in dev or when localStorage DEBUG is 'true'
const DEBUG =
  Boolean((import.meta as any)?.env?.DEV) ||
  (typeof window !== "undefined" && localStorage.getItem("DEBUG") === "true");

const debugLog = (...args: any[]) => {
  if (DEBUG) console.debug("[api]", ...args);
};

// Centralized Axios error formatter
const formatAxiosError = (err: unknown) => {
  if (axios.isAxiosError(err)) {
    const axiosErr = err as AxiosError;
    return {
      isAxiosError: true,
      message: axiosErr.message,
      status: axiosErr.response?.status,
      data: axiosErr.response?.data,
    };
  }
  return { isAxiosError: false, message: String(err) };
};

// Request interceptor: attach token and optional debug logging
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    try {
      const token = localStorage.getItem("token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // localStorage may not be available in some environments
      debugLog("localStorage access failed", e);
    }

    debugLog(
      "Request",
      config.method,
      config.url,
      config.data ?? config.params,
    );
    return config;
  },
  (error) => {
    debugLog("Request error", error);
    return Promise.reject(formatAxiosError(error));
  },
);

// Response interceptor: debug responses and normalize errors
api.interceptors.response.use(
  (response) => {
    debugLog("Response", response.config?.url, response.status, response.data);
    return response;
  },
  (error) => {
    debugLog("Response error", error);

    // Handle 401 unauthorized - redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userId");
      window.location.href = "/login";
    }

    return Promise.reject(formatAxiosError(error));
  },
);

// Auth API endpoints
export const authApi = {
  // Patient
  patientSendOtp: (email: string) =>
    api.post("/api/auth/patient/send-otp", { email }),
  patientVerifyOtp: (email: string, otp_code: string) =>
    api.post("/api/auth/patient/verify-otp", { email, otp_code }),
  patientCompleteProfile: (data: any) =>
    api.post("/api/auth/patient/complete-profile", data),

  // Doctor
  doctorSendOtp: (email: string, nmr_number: string) =>
    api.post("/api/auth/doctor/send-otp", { email, nmr_number }),
  doctorVerifyOtp: (email: string, otp_code: string) =>
    api.post("/api/auth/doctor/verify-otp", { email, otp_code }),
  doctorCompleteProfile: (data: any) =>
    api.post("/api/auth/doctor/complete-profile", data),

  // NMR Verification
  verifyNmr: (nmrNumber: string) =>
    api.post("/api/auth/verify-nmr", { nmrNumber }),

  // Admin
  adminLogin: (username: string, password: string) =>
    api.post("/api/admin/auth/login", { username, password }),
};

// Keep backwards compatibility
export const patientApi = {
  sendOtp: (email: string) => authApi.patientSendOtp(email),
  verifyOtp: (email: string, otp_code: string) =>
    authApi.patientVerifyOtp(email, otp_code),
  completeProfile: (data: any) => authApi.patientCompleteProfile(data),
};

export const doctorApi = {
  sendOtp: (email: string) => api.post("/api/auth/doctor/send-otp", { email }),
  verifyOtp: (email: string, otp_code: string) =>
    api.post("/api/auth/doctor/verify-otp", { email, otp_code }),
  completeProfile: (data: any) =>
    api.post("/api/auth/doctor/complete-profile", data),
  list: () => api.get<Doctor[]>("/api/doctor/list"),
};

export const adminApi = {
  login: (username: string, password: string) =>
    api.post("/api/admin/auth/login", { username, password }),
  getUsers: () => api.get("/api/admin/users"),
  deleteUser: (userId: string) => api.delete(`/api/admin/users/${userId}`),
  resetPassword: (userId: string, newPassword: string) =>
    api.post(`/api/admin/users/${userId}/reset-password`, null, {
      params: { new_password: newPassword },
    }),
};

export const appointmentApi = {
  book: (data: {
    doctor_id: string;
    appointment_date: string;
    illness_description: string;
  }) => api.post<Appointment>("/api/appointments/book", data),

  getPatientAppointments: () =>
    api.get<Appointment[]>("/api/appointments/patient"),

  getDoctorAppointments: () =>
    api.get<Appointment[]>("/api/appointments/doctor"),

  prescribe: (data: {
    appointment_id: number;
    notes: string;
    recommended_tests: string[];
  }) => api.post<Prescription>("/api/appointments/prescribe", data),

  getPrescription: (appointmentId: number) =>
    api.get<Prescription>(`/api/appointments/prescription/${appointmentId}`),
};

export const aiApi = {
  analyzeEcg: (formData: FormData) =>
    api.post("/api/ai/analyze-ecg", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  analyzeEcho: (formData: FormData) =>
    api.post("/api/ai/analyze-echo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

export default api;
