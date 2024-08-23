import React from 'react';
import './SignUp.css'; // Make sure to create and include your CSS file
import bannerImage from '../images/banner.png';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../OAuth';

const SignUpComp = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  console.log(formData)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setError(error.message);
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
          <label htmlFor="username">username:</label>
          <input type="text" id="username" name="username" onChange={handleChange} required />

          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email"  onChange={handleChange} required />

          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password"  onChange={handleChange} required />

          <button type="submit">Signup</button>
          <OAuth/>
        </form>
      </div>
    </div>
  );
};

export default SignUpComp;
