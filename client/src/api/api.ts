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

const API_URL = "http://localhost:8000/api";

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
    return Promise.reject(formatAxiosError(error));
  },
);

export const patientApi = {
  sendOtp: (email: string) =>
    api.post("/patient/auth/send-otp", { email, role: "PATIENT" }),
  verifyOtp: (email: string, otp_code: string) =>
    api.post<LoginResponse>("/patient/auth/verify-otp", { email, otp_code }),
  completeProfile: (data: any) => api.post("/patient/profile/complete", data),
};

export const doctorApi = {
  sendOtp: (email: string) =>
    api.post("/doctor/auth/send-otp", { email, role: "DOCTOR" }),
  verifyOtp: (email: string, otp_code: string) =>
    api.post<LoginResponse>("/doctor/auth/verify-otp", { email, otp_code }),
  completeProfile: (data: any) => api.post("/doctor/profile/complete", data),
  list: () => api.get<Doctor[]>("/doctor/list"),
};

export const adminApi = {
  login: (username: string, password: string) =>
    api.post<LoginResponse>("/admin/auth/login", { username, password }),
};

export const appointmentApi = {
  book: (data: {
    doctor_id: string;
    appointment_date: string;
    illness_description: string;
  }) => api.post<Appointment>("/appointments/book", data),

  getPatientAppointments: () => api.get<Appointment[]>("/appointments/patient"),

  getDoctorAppointments: () => api.get<Appointment[]>("/appointments/doctor"),

  prescribe: (data: {
    appointment_id: number;
    notes: string;
    recommended_tests: string[];
  }) => api.post<Prescription>("/appointments/prescribe", data),
};

export const aiApi = {
  analyzeEcg: (formData: FormData) =>
    api.post("/ai/analyze-ecg", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

export default api;
