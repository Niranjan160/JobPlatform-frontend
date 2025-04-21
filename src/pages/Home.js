// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import { getJobs } from '../api/jobApi';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import axios from 'axios';

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [filter, setFilter] = useState('');
  const userId = parseInt(localStorage.getItem('userId'));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobsData = await getJobs();
        setJobs(jobsData);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };
    fetchJobs();
  }, []);

  const getTimeAgo = (isoString) => {
    try {
      return formatDistanceToNow(new Date(isoString), { addSuffix: true });
    } catch {
      return 'Unknown time';
    }
  };

  const handleApply = async (job) => {
    const applicantId = parseInt(localStorage.getItem("userId"));
    const employerId = job.userId;
  
    try {
      await axios.post("http://localhost:8080/api/applications", {
        jobId: job.jobId,
        applicantId: applicantId, 
        employerId: employerId
      });
      alert("Application submitted and chat initiated!");
    } catch (error) {
      console.error("Error applying:", error);
      alert("Error applying for job");
    }
  };
  
  // useEffect(() => {
  //   const fetchEmployerName = async () => {
  //     if (selectedJob) {
  //       try {
  //         const res = await axios.get(`http://localhost:8080/api/users/${selectedJob.userId}`);
  //         setSelectedJob((prev) => ({
  //           ...prev,
  //           employerName: res.data.name,
  //         }));
  //       } catch (error) {
  //         console.error("Error fetching employer name:", error);
  //       }
  //     }
  //   };
  
  //   fetchEmployerName();
  // }, []);
  

  const filteredJobs = jobs.filter((job) => !filter || job.jobType === filter);

  return (
    <div className="home-container">
      <div className="home-header">
        <h2>Available Jobs</h2>
        <button className="messages-button" onClick={() => navigate('/messages')}>
          <FaEnvelope size={20} /> 
        </button>
      </div>

      <div className="filters">
        <label>Filter by type:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All</option>
          <option value="One-Time">One-Time</option>
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Remote">Remote</option>
        </select>
      </div>

      <div className="job-list">
        {filteredJobs.map((job) => (  
          <div key={job.jobId} className="job-card" onClick={() => setSelectedJob(job)}>
            <h3>{job.title}</h3>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Type:</strong> {job.jobType}</p>
            <p><strong>Salary:</strong> ₹{job.salary}</p>
            <p><strong>Posted:</strong> {getTimeAgo(job.postedAt)}</p>
            {/* <button onClick={(e) => { e.stopPropagation(); handleApply(job.jobId, job.userId); }}>
              Apply Now
            </button> */}
             <button onClick={(e) => {
              e.stopPropagation();
              setSelectedJob(job)
              // handleApply(job);
            }}>
              Apply Now
            </button>
          </div>
        ))}
      </div>

      {selectedJob && 
      (
        <div className="modal-overlay" onClick={() => setSelectedJob(null)}>
          <div className="job-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedJob.title}</h2>
            <p><strong>Description:</strong> {selectedJob.description}</p>
            <p><strong>Location:</strong> {selectedJob.location}</p>
            <p><strong>Salary:</strong> ₹{selectedJob.salary}</p>
            <p><strong>Job Type:</strong> {selectedJob.jobType}</p>
            <p><strong>Status:</strong> {selectedJob.status || 'Open'}</p>
            <p><strong>Posted:</strong> {getTimeAgo(selectedJob.timestamp)}</p>
            <p><strong>Posted By (User ID):</strong> {selectedJob.userId}</p>
            <p><strong>Posted By:</strong> {selectedJob.userEntity.name}</p>

            <div className="modal-buttons">
              <button
                className="apply-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleApply(selectedJob);
                }}
              >
                Apply Now
              </button>
              <button className="close-btn" onClick={() => setSelectedJob(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
