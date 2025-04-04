import React, { useEffect, useState } from "react";
import axios from "axios";
import './Security.css';

function SecurityPage() {
    const [pendingRebates, setPendingRebates] = useState([]);
    const [historyRebates, setHistoryRebates] = useState([]);
    const [securityEmail, setSecurityEmail] = useState("security@example.com"); // Change to logged-in user's email
    const [userData, setUserData] = useState(null);
    const [showPendingRebates, setShowPendingRebates] = useState(false);
    const [showHistoryRebates, setShowHistoryRebates] = useState(false);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchPendingRebates = async () => {
        try {
            const res = await axios.get("https://mybackend.loca.lt/api/rebates/pending");
            setPendingRebates(res.data);
            setShowPendingRebates(true);
            setShowHistoryRebates(false);
        } catch (error) {
            console.error("Error fetching pending rebates", error);
        }
    };

    const fetchHistoryRebates = async () => {
        try {
            const res = await axios.get("https://mybackend.loca.lt/api/rebates/history");
            setHistoryRebates(res.data);
            setShowHistoryRebates(true);
            setShowPendingRebates(false);
        } catch (error) {
            console.error("Error fetching history rebates", error);
        }
    };

    const fetchUserData = async () => {
        try {
            const res = await axios.get(`https://mybackend.loca.lt/api/user/${securityEmail}`);
            setUserData(res.data);
        } catch (error) {
            console.error("Error fetching user data", error);
        }
    };

    const updateRebateStatus = async (id, status, email) => {
        try {
            await axios.post("https://mybackend.loca.lt/api/rebates/update", { id, status, email });
            alert(`Rebate request ${status}!`);
            fetchPendingRebates();
            fetchHistoryRebates();
            fetchUserData();
        } catch (error) {
            console.error("Error updating rebate status", error);
        }
    };

    return (
        <div id="security-page">
            <h2>Welcome Security Personnel! 🛂</h2>

            {userData && (
                <div id="security-details">
                    <h3>My Details</h3>
                    <p><strong>Name:</strong> {userData.name}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>Attendance:</strong> {userData.attendance}</p>
                </div>
            )}

            <button className="security-btn" onClick={fetchPendingRebates}>Rebate Requests</button>
            <button className="security-btn" onClick={fetchHistoryRebates}>History</button>

            {showPendingRebates && (
                <>
                    <h3>Pending Rebate Requests</h3>
                    {pendingRebates.length > 0 ? (
                        <ul className="rebate-list">
                            {pendingRebates.map((rebate) => (
                                <li key={rebate.id}>
                                    <p><strong>Name:</strong> {rebate.name}</p>
                                    <p><strong>Roll Number:</strong> {rebate.roll_number}</p>
                                    <p><strong>Number of Days:</strong> {rebate.number_of_days}</p>
                                    <button className="status-btn approve" onClick={() => updateRebateStatus(rebate.id, "approved", rebate.email)}>Approve</button>
                                    <button className="status-btn reject" onClick={() => updateRebateStatus(rebate.id, "rejected", rebate.email)}>Reject</button>
                                </li>
                            ))}
                        </ul>
                    ) : <p>No pending requests</p>}
                </>
            )}

            {showHistoryRebates && (
                <>
                    <h3>History</h3>
                    {historyRebates.length > 0 ? (
                        <ul className="history-list">
                            {historyRebates.map((rebate) => (
                                <li key={rebate.id}>
                                    <p><strong>Name:</strong> {rebate.name}</p>
                                    <p><strong>Roll Number:</strong> {rebate.roll_number}</p>
                                    <p><strong>Status:</strong> {rebate.status}</p>
                                </li>
                            ))}
                        </ul>
                    ) : <p>No history available</p>}
                </>
            )}
        </div>
    );
}

export default SecurityPage;
