import React, { useState } from 'react';
import './ProfileStudent.css';

function ProfileStudent() {
  const [activeTab, setActiveTab] = useState('rebates');

  const dummyData = {
    rebates: [
      { id: 1, date: '2025-02-15', amount: '₹500', status: 'Approved' },
      { id: 2, date: '2025-02-10', amount: '₹800', status: 'Pending' },
    ],
    guests: [
      { id: 1, name: 'Ayushman Bhaiya', date: '2025-02-12', meal: 'Dinner', status: 'Approved' },
      { id: 2, name: 'Prakhar Bhaiya', date: '2025-02-14', meal: 'Lunch', status: 'Pending' },
    ],
    payments: [
      { id: 1, date: '2025-02-18', amount: '₹1000', type: 'Wallet Recharge' },
      { id: 2, date: '2025-02-19', amount: '₹500', type: 'Food Deduction' },
    ],
    reviews: [
      { id: 1, category: 'Food', feedback: 'Great taste!', rating: '⭐️⭐️⭐️⭐️' },
      { id: 2, category: 'Cleanliness', feedback: 'Needs improvement!', rating: '⭐️⭐️⭐️' },
    ]
  };

  return (
    <div id="profile-container">
      <h2>📜 Student Profile</h2>
      
      {/* Tabs */}
      <div id="tabs">
        <button className={activeTab === 'rebates' ? 'active' : ''} onClick={() => setActiveTab('rebates')}>Rebate History</button>
        <button className={activeTab === 'guests' ? 'active' : ''} onClick={() => setActiveTab('guests')}>Guest Registration</button>
        <button className={activeTab === 'payments' ? 'active' : ''} onClick={() => setActiveTab('payments')}>Wallet Transactions</button>
        <button className={activeTab === 'reviews' ? 'active' : ''} onClick={() => setActiveTab('reviews')}>Review System</button>
      </div>

      {/* Dynamic Tables */}
      <div id="table-container">
        {activeTab === 'rebates' && (
          <table id="rebate-table">
            <thead>
              <tr><th>Date</th><th>Amount</th><th>Status</th></tr>
            </thead>
            <tbody>
              {dummyData.rebates.map(row => (
                <tr key={row.id}><td>{row.date}</td><td>{row.amount}</td><td>{row.status}</td></tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'guests' && (
          <table id="guest-table">
            <thead>
              <tr><th>Name</th><th>Date</th><th>Meal</th><th>Status</th></tr>
            </thead>
            <tbody>
              {dummyData.guests.map(row => (
                <tr key={row.id}><td>{row.name}</td><td>{row.date}</td><td>{row.meal}</td><td>{row.status}</td></tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'payments' && (
          <table id="payment-table">
            <thead>
              <tr><th>Date</th><th>Amount</th><th>Type</th></tr>
            </thead>
            <tbody>
              {dummyData.payments.map(row => (
                <tr key={row.id}><td>{row.date}</td><td>{row.amount}</td><td>{row.type}</td></tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'reviews' && (
          <table id="review-table">
            <thead>
              <tr><th>Category</th><th>Feedback</th><th>Rating</th></tr>
            </thead>
            <tbody>
              {dummyData.reviews.map(row => (
                <tr key={row.id}><td>{row.category}</td><td>{row.feedback}</td><td>{row.rating}</td></tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ProfileStudent;
