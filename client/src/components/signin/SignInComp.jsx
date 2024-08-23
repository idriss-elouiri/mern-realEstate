import React, { useState } from 'react';
import './SignIn.css'; // Make sure to create and include your CSS file
import bannerImage from '../images/banner.png';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../../redux/user/userSlice";
import OAuth from "../../components/OAuth";

const SignInComp = () => {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
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
        <h2>SignIn</h2>
        <form onSubmit={handleSubmit}>
     
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" onChange={handleChange} name="email" required />

          <label htmlFor="password">Password:</label>
          <input type="password" id="password" onChange={handleChange} name="password" required />
          <Link to="/sign-in">I dont have an account</Link>
          <button type="submit">SignIn</button>
          <OAuth/>

        </form>
      </div>
    </div>
  );
};

export default SignInComp;
