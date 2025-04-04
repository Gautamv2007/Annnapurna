import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUsers, FaFilter } from "react-icons/fa";
import "./AttendanceEarnings.css";

const API_URL = "https://mybackend.loca.lt";

function AttendanceEarnings() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/attendance`);
      setAttendanceData([response.data]); // Store as an array
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

  // Filter data based on date range
  const filteredData = attendanceData.filter((entry) => {
    return (!startDate || entry.date >= startDate) && (!endDate || entry.date <= endDate);
  });

  return (
    <div className="attendance-container">
      <h2><FaUsers /> Attendance & Earnings</h2>

      <div className="filter-section">
        <FaFilter /> <strong>Filter by Date:</strong>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>

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
          {filteredData.length > 0 ? (
            filteredData.map((entry, index) => (
              <tr key={index}>
                <td>{entry.date}</td>
                <td>{entry.students_attended}</td>
                <td>₹{entry.cost_per_day}</td>
                <td>₹{entry.total_earnings}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AttendanceEarnings;

