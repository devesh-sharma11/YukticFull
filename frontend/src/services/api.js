import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

/* ============================================================
   JOBS
============================================================ */

export const getJobs = async () => {
  const res = await API.get("/jobs");
  return res.data;
};

export const getJob = async (slug) => {
  const res = await API.get(`/jobs/${slug}`);
  return res.data;
};

export default API;