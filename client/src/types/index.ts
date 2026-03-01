// src/types/index.ts

export interface User {
  id: string; // UUID
  email: string;
  role: "PATIENT" | "DOCTOR" | "ADMIN";
}

export interface Doctor {
  id: string; // UUID
  name: string;
  specialization: string;
  nmr_number: string;
  user_id: string;
}

export interface Patient {
  id: string; // UUID
  name: string;
  age: number;
  blood_group: string;
  user_id: string;
}

export interface Appointment {
  id: number;
  patient_id: string;
  doctor_id: string;
  appointment_date: string; // ISO String
  status: "PENDING" | "COMPLETED" | "CANCELLED"; // Adjust based on backend enum
  illness_description?: string;
  created_at?: string;
}

export interface Prescription {
  id: number;
  appointment_id: number;
  notes: string;
  recommended_tests: string[];
  issued_at: string;
}

// API Response Wrappers
export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
  role_id?: string; // Optional ID for specific role table (doctor_id/patient_id)
}

export interface UserInfo {
  id: string;
  email: string;
  role: string;
  is_verified: boolean;
  has_filled_profile: boolean;
  created_at: string | null;
  name: string | null;
  profile_id: string | null;
}
