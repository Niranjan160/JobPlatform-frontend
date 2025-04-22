// src/pages/CheckApplicants.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./CheckApplicants.css";

const CheckApplicants = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [expandedApplicantId, setExpandedApplicantId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobRes = await axios.get(`http://localhost:8080/api/jobs/${jobId}`);
        setJob(jobRes.data);

        const applicantRes = await axios.get(`http://localhost:8080/api/applications/${jobId}`);
        setApplicants(applicantRes.data);
      } catch (err) {
        console.error("Error fetching job or applicants:", err);
      }
    };

    fetchData();
  }, [jobId]);

  const toggleDetails = (userId) => {
    setExpandedApplicantId(prev => (prev === userId ? null : userId));
  };

  const handleAccept = async (applicantId) => {
    try {
      await axios.put(`http://localhost:8080/api/applications/${jobId}/accept/${applicantId}`);
      alert("Applicant accepted!");
    } catch (err) {
      console.error("Error accepting applicant:", err);
    }
  };

  const handleReject = async (applicantId) => {
    try {
      await axios.put(`http://localhost:8080/api/applications/${jobId}/reject/${applicantId}`);
      alert("Applicant rejected!");
    } catch (err) {
      console.error("Error rejecting applicant:", err);
    }
  };

  if (!job) return <div className="jobdetails-container">Loading job details...</div>;

  return (
    <div className="jobdetails-container">
      <h2>{job.title}</h2>
      <p><strong>Description:</strong> {job.description}</p>
      <p><strong>Location:</strong> {job.location}</p>
      <p><strong>Salary:</strong> ₹{job.salary}</p>
      <p><strong>Type:</strong> {job.jobType}</p>
      <p><strong>Category:</strong> {job.jobCategories}</p>
      <hr />
      <h3>Applicants</h3>
      {applicants.length === 0 ? (
        <p>No applicants yet.</p>
      ) : (
        <div className="applicant-list">
          {applicants.map((applicant) => (
            <div key={applicant.userId} className="applicant-card">
              <div className="applicant-header">
                <div>
                  <strong>{applicant.name}</strong> – {applicant.email} – {applicant.mobileNo}
                </div>
                <button onClick={() => toggleDetails(applicant.userId)}>
                  {expandedApplicantId === applicant.userId ? "Hide Details" : "Details"}
                </button>
              </div>

              {expandedApplicantId === applicant.userId && (
                <div className="applicant-details">
                  <p><strong>Address:</strong> {applicant.address}</p>
                  <p><strong>DOB:</strong> {applicant.dob}</p>
                  <div className="applicant-actions">
                    <button className="accept-btn" onClick={() => handleAccept(applicant.userId)}>Accept</button>
                    <button className="reject-btn" onClick={() => handleReject(applicant.userId)}>Reject</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CheckApplicants;
