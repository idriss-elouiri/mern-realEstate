import React, { useState } from "react";
import "./SignUp.css"; // Ensure your CSS file is included
import bannerImage from "../images/banner.png";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../OAuth";
import Notification from "../notification/Notification";

const SignUpComp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Reset error state before new submission

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Signup failed");
      }

      navigate("/sign-in");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signUp-container">
      <div className="image-section">
        <img src={bannerImage} alt="Real Estate" />
      </div>
      <div className="form-section">
        <h2>Signup</h2>
        <form onSubmit={handleSubmit}>
          <InputField
            id="username"
            label="Username:"
            type="text"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <InputField
            id="email"
            label="Email:"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <InputField
            id="password"
            label="Password:"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <Link to="/sign-in">I have an account</Link>

          <button type="submit" disabled={loading}>
            {loading ? "Signing Up..." : "Signup"}
          </button>
          <OAuth />
          {error && <Notification type="error" message={error} />}
        </form>
      </div>
    </div>
  );
};

const InputField = ({ id, label, type, value, onChange, required }) => (
  <div className="input-group">
    <label htmlFor={id}>{label}</label>
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      required={required}
    />
  </div>
);

export default SignUpComp;
