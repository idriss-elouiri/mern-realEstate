import React from 'react';
import './Notification.css';

const Notification = ({ type, message }) => {
  if (!message) return null;

  return (
    <div className={`notification ${type}`}>
      {type === 'success' ? (
        <div className="notification-icon">✔ </div>
      ) : (
        <div className="notification-icon">✘</div>
      )}
      <div className="notification-message">{message}</div>
    </div>
  );
};

export default Notification;
