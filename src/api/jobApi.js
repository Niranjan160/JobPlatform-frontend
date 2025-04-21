import axios from 'axios';
import { use } from 'react';

const API_URL = 'http://localhost:8080/api/jobs/all';

export const postJob = async (jobData) => {
  const response = await axios.post(API_URL, jobData);
  return response.data;
};

export const getJobs = async () => {
  const userId = localStorage.getItem("userId")
  const response = await axios.get(API_URL,{params:{
    userId
  }});
  console.log(response.data);
  
  return response.data;
};
