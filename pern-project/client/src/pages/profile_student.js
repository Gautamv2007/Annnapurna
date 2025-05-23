import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf"; // Import jsPDF
import "./ProfileStudent.css";

const API_URL = "http://localhost:5000"; // Change if needed

function ProfileStudent() {
  const [activeTab, setActiveTab] = useState("rebates");
  const [rebates, setRebates] = useState([]);
  const [guests, setGuests] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [outpasses, setOutpasses] = useState([]);

  // Format dates to DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"; // Handle null/undefined values
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}/${
      (date.getMonth() + 1).toString().padStart(2, "0")
    }/${date.getFullYear()}`;
  };

  // Fetch all data when component mounts
  useEffect(() => {
    fetchRebates();
    fetchGuests();
    fetchReviews();
    fetchOutpasses();
  }, []);

  // Fetch Rebate History
  const fetchRebates = async () => {
    try {
      const token = localStorage.getItem("token"); // User authentication
      const response = await axios.get(`${API_URL}/api/rebate`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRebates(response.data);
    } catch (error) {
      console.error("Error fetching rebates:", error);
    }
  };

  // Fetch Guest Registrations
  const fetchGuests = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/api/guests_f`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log("API Response:", response.data); // Debug response
        setGuests(response.data);
    } catch (error) {
        console.error("Error fetching guests:", error);
    }
};


  // Fetch Reviews
  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/api/reviews`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };
  const fetchOutpasses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/api/outpasses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOutpasses(response.data);
    } catch (error) {
      console.error("Error fetching outpasses:", error);
    }
  };

  // PDF Generation Function
  const generatePDFOutpass = (outpass) => {
    const pdf = new jsPDF();
    const marginX = 20;
    let y = 20;

    // Header
    pdf.setFontSize(16);
    pdf.setFont("Helvetica", "bold");
    pdf.text(
      "Indian Institute of Information Technology,",
      105,
      y,
      { align: "center" }
    );
    y += 7;
    pdf.text("Design and Manufacturing, Kurnool", 105, y, { align: "center" });

    y += 10;
    pdf.setFontSize(14);
    pdf.text("OutPass Request Form", 105, y, { align: "center" });

    // Line below title
    y += 5;
    pdf.setLineWidth(0.5);
    pdf.line(marginX, y, 190, y);
    y += 10;

    // Info fields
    pdf.setFontSize(12);
    pdf.setFont("Helvetica", "normal");

    const fields = [
      ["Name", outpass.name],
      ["Email", outpass.email],
      ["Phone", outpass.phone],
      ["Semester", outpass.semester],
      ["Hostel", outpass.hostel],
      ["Room", outpass.room],
      ["Branch", outpass.branch],
      ["Departure Time", formatDate(outpass.departure_time)],
      ["Return Time", formatDate(outpass.return_time)],
      ["Purpose", outpass.purpose],
    ];

    fields.forEach(([label, value]) => {
      pdf.text(`${label}:`, marginX, y);
      pdf.text(`${value || "-"}`, 120, y, { align: "left" });
      y += 8;
    });

    // Signature Section
    y += 10;
    pdf.line(marginX, y, 90, y);
    pdf.text("Student Signature", marginX, y + 5);

    pdf.line(120, y, 190, y);
    pdf.text("Warden Signature", 120, y + 5);

    // Footer - "Generated by" and "Generated on"
    const generatedBy = "Generated by Student OutPass Portal";
    const generatedOn = `Generated on: ${new Date().toLocaleString()}`;
    y = 280;

    pdf.setFontSize(10);
    pdf.setTextColor(100);
    pdf.text(generatedBy, 105, y, { align: "center" });
    pdf.text(generatedOn, 105, y + 5, { align: "center" });

    // Save PDF
    pdf.save("OutPass.pdf");
  };


  const generatePDFGuests = (guest) => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("Guest Registration Receipt", 20, 20);

    // User Details Section
    doc.setFontSize(14);
    doc.text("User Details:", 20, 40);
    doc.setFontSize(12);
    doc.text(`Name: ${guest.user_name}`, 20, 50);
    doc.text(`Roll Number: ${guest.user_roll_number}`, 20, 60);
    doc.text(`Branch: ${guest.user_branch}`, 20, 70);
    doc.text(`Semester: ${guest.user_semester}`, 20, 80);
    doc.text(`Hall Name: ${guest.user_hall_name}`, 20, 90);
    doc.text(`Room No: ${guest.user_room_no}`, 20, 100);
    doc.text(`Mobile Number: ${guest.user_mobile_number}`, 20, 110);
    doc.text(`Email: ${guest.user_email}`, 20, 120);

    // Guest Details Section
    doc.setFontSize(14);
    doc.text("Guest Details:", 20, 140);
    doc.setFontSize(12);
    doc.text(`Guest Name: ${guest.guest_name}`, 20, 150);
    doc.text(`Meals: ${guest.meals || "None"}`, 20, 160);

    // Total Bill Section
    doc.text(`Total Bill: ₹${guest.total_bill}`, 20, 170);

    // Transaction ID Section
    doc.text(`Transaction ID: ${guest.transaction_id}`, 20, 180);

    // Save the PDF
    doc.save("Guest_Receipt.pdf");
    alert("Receipt downloaded successfully!");
  };
  
  const generatePDFRebate = (data) => {
    const pdf = new jsPDF();

    const pageWidth = pdf.internal.pageSize.getWidth(); // Get the width of the page

    // Add Title for Institute Name (center-aligned and split into two lines)
    pdf.setFont("Arial", "bold");
    pdf.setFontSize(14); // Font size adjusted to fit the page
    pdf.setTextColor(0, 0, 128); // Dark blue color

    pdf.text(
      "INDIAN INSTITUTE OF INFORMATION TECHNOLOGY,",
      pageWidth / 2,
      20,
      { align: "center" }
    );
    pdf.text("DESIGN AND MANUFACTURING KURNOOL", pageWidth / 2, 30, {
      align: "center",
    });

    // Add Form Title (center-aligned)
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0); // Black color
    pdf.text("Mess Rebate Form", pageWidth / 2, 40, { align: "center" });

    // Add horizontal line
    pdf.setDrawColor(0, 0, 0); // Black color for line
    pdf.line(10, 45, 200, 45);

    // Add Date
    pdf.setFont("Arial", "normal");
    pdf.text(`Date: ${new Date().toLocaleDateString()}`, 15, 65);

    // Add Student Details Section
    pdf.setFont("Arial", "bold");
    pdf.setFontSize(12);
    pdf.text("1. Student Details", pageWidth / 2, 55, { align: "center" });

    pdf.setFont("Arial", "normal");
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Name: ${data.name}`, 20, 75);
    pdf.text(`Roll Number: ${data.roll_number}`, 20, 85);
    pdf.text(`Semester: ${data.semester}`, 20, 95);
    pdf.text(`Branch: ${data.branch}`, 20, 105);
    pdf.text(`Hall Name and Room No.: ${data.hall_name}, ${data.room_no}`, 20, 115);
    pdf.text(`Mobile Number: ${data.mobile_number}`, 20, 125);

    // Add horizontal line
    pdf.line(10, 130, 200, 130);

    // Add Leave Details Section
    pdf.setFont("Arial", "bold");
    pdf.text("2. Leave Details", pageWidth / 2, 140, { align: "center" });

    pdf.setFont("Arial", "normal");
    pdf.text(`Reason: ${data.reason}`, 20, 150);
    pdf.text(
      `Period of Absence: From ${data.start_date} To ${data.end_date}`,
      20,
      160
    );
    pdf.text(`Total No. of Days Leave: ${data.number_of_days}`, 20, 170);

    // Add horizontal line
    pdf.line(10, 175, 200, 175);

    // Add Signature Section
    pdf.setFont("Arial", "bold");
    pdf.text("3. Signature Section", pageWidth / 2, 185, { align: "center" });

    pdf.setFont("Arial", "normal");
    pdf.text(
      "Signature of the student with date: ______________________",
      20,
      195
    );
    pdf.text("For Office Use Only:", pageWidth / 2, 205, { align: "center" });
    pdf.text(
      "Eligible for mess rebate (Yes/No): ______________________",
      20,
      215
    );
    pdf.text(
      "Remarks of the Warden: _______________________________",
      20,
      225
    );
    pdf.text(
      "Signature of the Warden: _____________________________",
      20,
      235
    );

    // Add Footer
    pdf.setFont("Arial", "italic");
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100); // Gray color
    pdf.text(
      "Generated by IIITDM Kurnool Mess Rebate System",
      10,
      290
    );

    // Save the PDF
    pdf.save("mess_rebate.pdf");
  };

  return (
    <div id="profile-container">
      <h2>📜 Student Profile</h2>

      {/* Tabs */}
      <div id="tabs">
        <button
          className={activeTab === "rebates" ? "active" : ""}
          onClick={() => setActiveTab("rebates")}
        >
          Rebate History
        </button>
        <button
          className={activeTab === "guests" ? "active" : ""}
          onClick={() => setActiveTab("guests")}
        >
          Guest Registration
        </button>
        <button
          className={activeTab === "reviews" ? "active" : ""}
          onClick={() => setActiveTab("reviews")}
        >
          Review System
        </button>
        <button
          className={activeTab === "outpass" ? "active" : ""}
          onClick={() => setActiveTab("outpass")}
        >
          OutPass
        </button>
      </div>

      {/* Dynamic Tables */}
      <div id="table-container">
        {activeTab === "rebates" && (
          <table id="rebate-table">
            <thead>
              <tr>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rebates.length > 0 ? (
                rebates.map((row) => (
                  <tr key={row.id}>
                    <td>{formatDate(row.start_date)}</td>
                    <td>{formatDate(row.end_date)}</td>
                    <td>{row.status || "Pending"}</td>
                    <td>
                      <button
                        onClick={() => generatePDFRebate(row)}
                        className="pdf-button"
                        id="profile-pdf-button"
                      >
                        Download PDF
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No rebates found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}

{activeTab === "guests" && (
          <table id="guest-table">
            <thead>
              <tr>
                <th>Guest Name</th>
                <th>Meals</th>
                <th>Total Bill</th>
                <th>Transaction ID</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {guests.length > 0 ? (
                guests.map((guest) => (
                  <tr key={guest.id}>
                    <td>{guest.guest_name}</td>
                    <td>{guest.meals || "None"}</td>
                    <td>₹{guest.total_bill}</td>
                    <td>{guest.transaction_id}</td>
                    <td>
                      <button
                        onClick={() => generatePDFGuests(guest)}
                        className="pdf-button"
                        id="profile-pdf-button"
                      >
                        Download PDF
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No guest registrations found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {activeTab === "reviews" && (
          <table id="review-table">
            <thead>
              <tr><th>Category</th><th>Feedback</th><th>Rating</th></tr>
            </thead>
            <tbody>
              {reviews.length > 0 ? (
                reviews.map(row => (
                  <tr key={row.id}>
                    <td>{row.category}</td>
                    <td>{row.review}</td>
                    <td>{"★".repeat(row.rating)}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="3">No reviews found</td></tr>
              )}
            </tbody>
          </table>
        )}
        {activeTab === "outpass" && (
          <table id="outpass-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Purpose</th>
                <th>Departure</th>
                <th>Return</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {outpasses.length > 0 ? (
                outpasses.map((outpass) => (
                  <tr key={outpass.id}>
                    <td>{outpass.name}</td>
                    <td>{outpass.purpose}</td>
                    <td>{formatDate(outpass.departure_time)}</td>
                    <td>{formatDate(outpass.return_time)}</td>
                    <td>{outpass.status}</td>
                    <td>
                      <button
                        onClick={() => generatePDFOutpass(outpass)}
                        className="pdf-button"
                        id="profile-pdf-button"
                      >
                        Download PDF
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No outpasses found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ProfileStudent;