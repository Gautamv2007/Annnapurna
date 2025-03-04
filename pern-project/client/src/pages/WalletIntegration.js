import React, { useState } from 'react';
import './Wallet.css';

function Wallet() {
  const [balance, setBalance] = useState(1000);
  const [transactions, setTransactions] = useState([
    { id: 1, date: '2025-02-20', amount: -100 },
    { id: 2, date: '2025-02-19', amount: -150 },
    { id: 3, date: '2025-02-18', amount: -200 },
  ]);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleAddMoney = () => {
    const addAmount = parseInt(amount, 10);

    if (!addAmount || addAmount <= 0) {
      setError("Enter a valid amount.");
      return;
    }

    if (addAmount > 1000) {
      setError("You cannot add more than ₹1000 in a day.");
      return;
    }

    setBalance(balance + addAmount);
    setTransactions([{ id: transactions.length + 1, date: new Date().toISOString().split('T')[0], amount: addAmount }, ...transactions]);
    setAmount('');
    setError('');
  };

  return (
    <div id="wallet-container">
      <h2 id="wallet-title">💰 Wallet</h2>
      <p id="wallet-starting-balance"><strong>Semester Starting Balance:</strong> ₹1000</p>
      <p id="wallet-current-balance"><strong>Current Balance:</strong> ₹{balance}</p>

      <input 
        type="number" 
        value={amount} 
        onChange={(e) => setAmount(e.target.value)} 
        placeholder="Enter amount (Max ₹1000)"
        id="wallet-amount-input"
      />
      {error && <p id="wallet-error-text">{error}</p>}

      <button id="wallet-add-btn" onClick={handleAddMoney}>Add Money</button>

      <h3 id="wallet-transaction-title">Transaction History</h3>
      <table id="wallet-transaction-table">
        <thead>
          <tr>
            <th id="wallet-th-date">Date</th>
            <th id="wallet-th-amount">Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn) => (
            <tr key={txn.id}>
              <td>{txn.date}</td>
              <td style={{ color: txn.amount < 0 ? 'red' : 'green' }}>₹{txn.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Wallet;
