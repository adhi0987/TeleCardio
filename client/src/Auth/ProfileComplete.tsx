import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "../styles/Auth.css";

const ProfileComplete: React.FC = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("userRole") || "patient";
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    age: 0,
    sex: "",
    bloodGroup: "",
    specialization: "Cardiologist",
    nmr_number: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Get NMR from localStorage if doctor
  useEffect(() => {
    const identity = localStorage.getItem("userIdentity");
    if (role === "doctor" && identity) {
      setFormData((prev) => ({ ...prev, nmr_number: identity }));
    }
  }, [role]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "age" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!token) {
        setError("No authentication token found. Please login again.");
        setLoading(false);
        return;
      }

      if (role === "patient") {
        const payload = {
          user_id: localStorage.getItem("userId"), // We need to get this from token
          profile: {
            name: formData.name,
            phone: formData.phone,
            age: formData.age,
            blood_group: formData.bloodGroup,
            sex: formData.sex,
          },
        };

        // For patient, we need to get the user_id from the JWT token
        // The token contains the user info, but we need to decode it
        // For now, let's use the API to get user info or pass email
        await api.post("/api/auth/patient/complete-profile", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        localStorage.setItem("userName", formData.name);
        alert("Profile setup complete!");
        navigate("/patient-dashboard");
      } else if (role === "doctor") {
        const payload = {
          user_id: localStorage.getItem("userId"),
          profile: {
            name: formData.name,
            specialization: formData.specialization,
            nmr_number: formData.nmr_number,
          },
        };

        await api.post("/api/auth/doctor/complete-profile", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        localStorage.setItem("userName", formData.name);
        alert("Profile setup complete!");
        navigate("/doctor-dashboard");
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to save profile details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">Complete Your Profile</h2>
        <p className="auth-subtitle">
          {role === "patient"
            ? "Please provide your details to continue as a Patient"
            : "Please provide your details to continue as a Doctor"}
        </p>

        {error && (
          <div
            className="error-message"
            style={{ color: "red", marginBottom: "10px" }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="form-input"
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
            className="form-input"
          />

          {/* Patient-specific fields */}
          {role === "patient" && (
            <>
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={formData.age || ""}
                onChange={handleChange}
                required
                className="form-input"
                min={1}
                max={150}
              />

              <select
                name="sex"
                value={formData.sex}
                onChange={handleChange}
                required
                className="form-input"
              >
                <option value="" disabled>
                  Select Sex
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>

              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                required
                className="form-input"
              >
                <option value="" disabled>
                  Select Blood Group
                </option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </>
          )}

          {/* Doctor-specific fields */}
          {role === "doctor" && (
            <>
              <input
                type="text"
                name="specialization"
                placeholder="Specialization"
                value={formData.specialization}
                onChange={handleChange}
                required
                className="form-input"
              />

              <input
                type="text"
                name="nmr_number"
                placeholder="NMR Number"
                value={formData.nmr_number}
                disabled
                required
                className="form-input"
              />
              <p
                style={{ fontSize: "0.8rem", color: "#666", marginTop: "-5px" }}
              >
                NMR is verified at login
              </p>
            </>
          )}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Save & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileComplete;
