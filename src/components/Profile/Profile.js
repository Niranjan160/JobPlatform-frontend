// src/components/Profile/Profile.js
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const fileInputRef = useRef(null);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/users/${userId}`);
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    const fetchJobs = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/users/${userId}/jobs`);
        setJobs(res.data);
      } catch (err) {
        console.error("Error fetching user jobs:", err);
      }
    };

    if (userId) {
      fetchUser();
      fetchJobs();
    }
  }, [userId]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    const formData = new FormData();
    formData.append("image", file);

    try {
      await axios.post(`http://localhost:8080/api/users/${userId}/upload-image`, formData);
      alert("Profile image uploaded!");
      window.location.reload();
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const handlePicClick = () => {
    fileInputRef.current.click();
  };

  if (!user) return <div className="loading">Loading profile...</div>;

  return (
    <div className="profile-container">
      <div className="profile-header-row">
        <div className="profile-pic-wrapper" onClick={handlePicClick}>
          {user.profileImage ? (
            <img
              src={`http://localhost:8080${user.profileImage}`}
              alt="Profile"
              className="profile-pic clickable"
            />
          ) : (
            <div className="profile-placeholder clickable">Click to upload</div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>
        <div className="profile-info">
          <h2>{user.name}</h2>
          <p className="location">{user.address}</p>
          <div className="user-details">
            <p><strong>Email:</strong> <span>{user.email}</span></p>
            <p><strong>Mobile:</strong> <span>{user.mobileNo}</span></p>
            <p><strong>DOB:</strong> <span>{user.dob}</span></p>
          </div>
        </div>
      </div>

      <div className="job-history">
        <h3>Your Posted Jobs</h3>
        {jobs.length > 0 ? (
          <ul className="jobs-list">
            {jobs.map((job) => (
              <li key={job.jobId} className="job-item">
                <div className="job-title">{job.title}</div>
                <div className="job-info">
                  <span className="job-type">{job.jobType}</span>
                  <span className="job-salary">₹{job.salary}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-jobs">No jobs posted yet.</p>
        )}
      </div>

      <div className="logout-btn">
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;