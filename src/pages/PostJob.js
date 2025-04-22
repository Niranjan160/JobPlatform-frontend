// src/pages/PostJob.js
import React, { useState, useEffect } from 'react';
import './PostJob.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PostJob = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    location: '',
    salary: '',
    jobCategories:'',
    jobType: 'Full-Time',
  });

  const [myJobs, setMyJobs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false); // modal visibility

  const fetchMyJobs = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/users/${userId}/jobs`);
      setMyJobs(res.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const handleChange = (e) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...jobData, userId: parseInt(userId) };

    try {
      if (editingId) {
        await axios.put(`http://localhost:8080/api/jobs/${editingId}`, payload);
        setEditingId(null);
      } else {
        await axios.post("http://localhost:8080/api/jobs/post", payload);
      }
      alert("Job saved successfully!");
      setJobData({
        title: '',
        description: '',
        location: '',
        salary: '',
        jobCategories:'',
        jobType: 'Full-Time',
      });
      setShowModal(false);
      fetchMyJobs();
    } catch (error) {
      console.error("Error saving job:", error);
    }
  };

  const handleEdit = (job) => {
    setEditingId(job.jobId);
    setJobData({
      title: job.title,
      description: job.description,
      location: job.location,
      salary: job.salary,
      jobType: job.jobType,
    });
    setShowModal(true);
  };

  const handleDelete = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      await axios.delete(`http://localhost:8080/api/jobs/${jobId}`);
      fetchMyJobs();
    }
  };
  
  const handleCheck = (jobId) => {
    navigate(`/job/${jobId}/details`);
  };


  useEffect(() => {
    if (userId) fetchMyJobs();
  }, [userId]);

  return (
    <div className="postjob-container">
      <div className="header-bar">
        <h2>Your Posted Jobs</h2>
        <button className="open-modal-btn" onClick={() => setShowModal(true)}>Post New Job</button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="close-btn" onClick={() => { setShowModal(false); setEditingId(null); }}>&times;</span>
            <h2>{editingId ? "Update Job" : "Post Job"}</h2>
            <form onSubmit={handleSubmit} className="job-form">
              <input name="title" placeholder="Job Title" value={jobData.title} onChange={handleChange} required />
              <textarea name="description" placeholder="Job Description" value={jobData.description} onChange={handleChange} required />
              <input name="location" placeholder="Location" value={jobData.location} onChange={handleChange} required />
              <input name="salary" type="number" placeholder="Salary" value={jobData.salary} onChange={handleChange} required />
              <select name="jobCategories" value={jobData.jobCategories} onChange={handleChange}>
                <option value="Plumber">Plumber</option>
                <option value="Electrician">Electrician</option>
                <option value="AC-service">AC-Service</option>
                <option value="Parlor">Parlour</option>
                <option value="Gardening">Gardening</option>
                <option value="Software-Developer">Software-Developer</option>
                <option value="Web-Developer">Web-Developer</option>
                <option value="Data Analyst">Data Analyst</option>
              </select>
              <select name="jobType" value={jobData.jobType} onChange={handleChange}>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
               {/* <option value="Internship">Internship</option> */}
               {/* <option value="Short-period">Short-Period</option> */}
               <option value="Work_From_Home">Work_From_Home</option>
                <option value="One-Time">One-Time</option>
              </select>
              <button className="job-form button" type="submit">{editingId ? "Update Job" : "Post Job"}</button>
            </form>
          </div>
        </div>
      )}

      <div className="myjobs-section">
        {myJobs.length === 0 ? (
          <p>You haven't posted any jobs yet.</p>
        ) : (
          <ul className="myjobs-list">
            {myJobs.map((job) => (
              <li key={job.jobId} className="myjob-card">
                <h4>{job.title}</h4>
                <p>{job.description}</p>
                <p><strong>Location:</strong> {job.location}</p>
                <p><strong>Salary:</strong> ₹{job.salary}</p>
                <p><strong>Type:</strong> {job.jobType}</p>
                <div className="job-actions">
                  <div className="left-actions">
                    <button className="edit-btn" onClick={() => handleEdit(job)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(job.jobId)}>Delete</button>
                  </div>
                  <div className="right-actions">
                    <button className="check-btn" onClick={() => handleCheck(job.jobId)}>Check</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PostJob;