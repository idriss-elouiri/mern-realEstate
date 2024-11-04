import React, { useState } from "react";
import "./SignIn.css"; // Ensure your CSS file is properly linked
import bannerImage from "../images/banner.png";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../../redux/user/userSlice";
import OAuth from "../../components/OAuth";
import Notification from "../notification/Notification";
import { BASE_URL } from "../../BASE_URL";

const SignInComp = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart());

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
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
        throw new Error(data.message || "Sign-in failed");
      }

      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="signin-container">
      <div className="image-section">
        <img src={bannerImage} alt="Real Estate" />
      </div>
      <div className="form-section">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
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

          <Link to="/sign-up">I don't have an account</Link>
          <button type="submit" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
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

export default SignInComp;
