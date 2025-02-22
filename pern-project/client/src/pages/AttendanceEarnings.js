import React, { useState } from "react";
import { FaUsers, FaFilter } from "react-icons/fa";
import "./AttendanceEarnings.css";

const dummyData = [
  { date: "2025-02-20", students: 120, costPerDay: 50 },
  { date: "2025-02-21", students: 110, costPerDay: 50 },
  { date: "2025-02-22", students: 130, costPerDay: 50 },
  { date: "2025-02-23", students: 115, costPerDay: 50 },
];

function AttendanceEarnings() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Filter data based on selected date range
  const filteredData = dummyData.filter((entry) => {
    return (!startDate || entry.date >= startDate) && (!endDate || entry.date <= endDate);
  });

  // Calculate totals automatically based on filtered rows
  const totalAttendance = filteredData.reduce((sum, entry) => sum + entry.students, 0);
  const totalEarnings = filteredData.reduce((sum, entry) => sum + entry.students * entry.costPerDay, 0);

  return (
    <div className="attendance-container">
      <h2><FaUsers /> Attendance & Earnings</h2>

      {/* Filters */}
      <div className="filter-section">
        <FaFilter /> <strong>Filter by Date:</strong>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>

      {/* Table */}
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Students Attended</th>
            <th>Cost Per Day</th>
            <th>Total Earnings</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((entry, index) => (
            <tr key={index}>
              <td>{entry.date}</td>
              <td>{entry.students}</td>
              <td>₹{entry.costPerDay}</td>
              <td>₹{entry.students * entry.costPerDay}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Total Section */}
      <div className="total-section">
        <strong>Total Attendance:</strong> {totalAttendance} Students | 
        <strong> Total Earnings:</strong> ₹{totalEarnings}
      </div>
    </div>
  );
}

export default AttendanceEarnings;
