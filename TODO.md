# TeleCardio Implementation Plan

## Phase 1: Fix Authentication & Backend Issues

### 1.1 Fix Admin Authentication

- [x] Admin login endpoint is at `/api/admin/auth/login`
- [x] Need to add admin user registration or use seeded admin

### 1.2 Fix Patient/Doctor API Endpoints

- [x] Patient OTP: `/api/auth/patient/send-otp` & `/api/auth/patient/verify-otp`
- [x] Doctor OTP: `/api/auth/doctor/send-otp` & `/api/auth/doctor/verify-otp`
- [x] Profile completion endpoints are in place

### 1.3 Fix Login.tsx

- [x] Use correct API endpoints for each role
- [x] Store token and userRole in localStorage
- [x] Navigate to appropriate dashboard after login

## Phase 2: Integrate Dashboard with Real APIs

### 2.1 Patient Dashboard Integration

- [ ] Fetch appointments from `/api/appointments/patient`
- [ ] Fetch doctors list from `/api/doctor/list`
- [ ] Display doctor name instead of ID
- [ ] Add "Past Appointments" section with prescriptions
- [ ] Add prescription view/download functionality

### 2.2 Doctor Dashboard Integration

- [ ] Fetch appointments from `/api/appointments/doctor`
- [ ] Fetch patient details (age, gender) from patient profile
- [ ] Add row color coding based on appointment date
- [ ] Implement prescription writing modal
- [ ] Add ECG Report Analyzer (already in code)
- [ ] Add Echocardiogram Analyzer
- [ ] Add "Past Responded Appointments" table

### 2.3 Admin Dashboard Integration

- [ ] Fetch users from `/api/admin/users`
- [ ] Implement delete user functionality
- [ ] Implement password reset functionality

## Phase 3: UI/UX Improvements

### 3.1 Navbar Enhancements

- [ ] Display user name from profile
- [ ] Add "My Profile" and "Logout" options
- [ ] Show company name on left

### 3.2 Profile Completion

- [ ] Add age input for patients
- [ ] Add proper validation

## Phase 4: Missing Features

### 4.1 Doctor Signup NMR Verification

- [ ] Implement NMR verification endpoint that checks a database
- [ ] Doctor should verify NMR before signup

### 4.2 AI Analysis

- [ ] ECG Analyzer endpoint exists
- [ ] Add Echocardiogram Analyzer endpoint
- [ ] Connect frontend to backend

## Implementation Order:

1. Fix Login.tsx API calls (verify it's using correct endpoints)
2. Connect Admin Dashboard to API
3. Connect Patient Dashboard with proper doctor names
4. Connect Doctor Dashboard with patient details
5. Add missing features (Echo analyzer, past appointments, etc.)
6. Fix Navbar to show user info

## Notes:

- Database: Supabase PostgreSQL
- Backend: FastAPI with SQLAlchemy
- Frontend: React with TypeScript
