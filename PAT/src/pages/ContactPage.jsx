import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ContactPage() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "Student",
    subject: "",
    message: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

//   const handleSubmit = async () => {
//     try {
//       const res = await fetch("http://localhost:8080/api/contact", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify(form)
//       });

//       if (res.ok) {
//         alert("Message stored successfully!");

//         // reset form
//         setForm({
//           name: "",
//           email: "",
//           role: "Student",
//           subject: "",
//           message: ""
//         });
//       } else {
//         alert("Failed to store message");
//       }

//     } catch (err) {
//       console.error(err);
//       alert("Error sending message");
//     }
//   };
  const handleSubmit = async () => {

    // ✅ VALIDATION
    if (
        !form.name.trim() ||
        !form.email.trim() ||
        !form.role.trim() ||
        !form.subject.trim() ||
        !form.message.trim()
    ) {
        alert("Please fill all fields before submitting!");
        return;
    }

    try {
        const res = await fetch("http://localhost:8080/api/contact", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
        });

        if (res.ok) {
        alert("Message stored successfully!");

        setForm({
            name: "",
            email: "",
            role: "Student",
            subject: "",
            message: ""
        });
        } else {
        alert("Failed to store message");
        }

    } catch (err) {
        console.error(err);
        alert("Error sending message");
    }
    };

  return (
    <div className="info-page">
      
      <div className="info-header">
        <h1>Contact Us</h1>
        <p>We're here to help you with placement-related queries</p>
      </div>

      <div className="info-body">

        {/* Contact Info */}
        <div className="profile-card">
          <h3>General Contact</h3>
          <p>Email: support@placementportal.com</p>
          <p>Phone: +91 98765 43210</p>
          <p>Address: XYZ College, Mysuru, Karnataka</p>
        </div>

        {/* Role Based */}
        <div className="profile-card">
          <h3>Reach the Right Team</h3>
          <p>Student Queries: support@placementportal.com</p>
          <p>Technical Issues: support@placementportal.com</p>
          <p>TPO Office: tpo@placementportal.com</p>
        </div>

        {/* Contact Form */}
        <div className="profile-card">
          <h3>Send us a Message</h3>

          <div className="form-grid">
            <div className="form-field">
              <label>Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
              />
            </div>

            <div className="form-field">
              <label>Email</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>

            <div className="form-field full">
              <label>Role</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
              >
                <option>Student</option>
                <option>Coordinator</option>
                <option>TPO</option>
                <option>Recruiter</option>
              </select>
            </div>

            <div className="form-field full">
              <label>Subject</label>
              <input
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="Enter subject"
              />
            </div>

            <div className="form-field full">
              <label>Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Write your message..."
              ></textarea>
            </div>
          </div>

          <button 
            className="save-btn"
            onClick={handleSubmit}
          >
            Send Message
          </button>
        </div>

        {/* ✅ Back Button (FIXED) */}
        <button 
          className="back-home-btn"
          onClick={() => navigate("/")}
          style={{ marginTop: 20 }}
        >
          ← Back to Home
        </button>

      </div>
    </div>
  );
}