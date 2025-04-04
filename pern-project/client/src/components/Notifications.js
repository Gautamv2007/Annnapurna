import React, { useState } from 'react';
import './Notifications.css';

const Notifications = () => {
  const [notifications] = useState([
    { id: 1, message: 'Special di available this Sunday!' },
    { id: 2, message: 'Mess timings changed for the festival week.' },
    { id: 3, message: 'Feedback session scheduled for next month.' }
  ]);

  return (
    <div className="notifications">
      <h2>Notifications</h2>
      <ul>
        {notifications.map((note) => (
          <li key={note.id}>
            <span className="notification-message">{note.message}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
