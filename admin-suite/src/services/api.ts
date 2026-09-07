

// import axios from "axios";

// const API = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
// });

// // Automatically attach token
// API.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

// // Auto logout on expired token
// API.interceptors.response.use(
//   (response) => response,
//   (error) => {

//     const currentPath = window.location.pathname;

//     if (
//       error.response?.status === 401 &&
//       currentPath !== "/login"
//     ) {
//       localStorage.clear();
//       window.location.href = "/login";
//     }

//     return Promise.reject(error);
//   }
// );

// export const createCaseStudy = (data: any) =>
//   API.post("/case-studies", data);





// export const getImageLibrary = async () => {
//   const res = await API.get("/image-library");
//   return res.data;
// };




// export const getCaseStudies = () =>
//   API.get("/case-studies");

// export const getCaseStudy = (slug: string) =>
//   API.get(`/case-studies/${slug}`);




// export default API;


import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Automatically attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Auto logout on expired token
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const currentPath = window.location.pathname;

    if (
      error.response?.status === 401 &&
      currentPath !== "/login"
    ) {
      localStorage.clear();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);


// =========================================================
// CASE STUDIES
// =========================================================

export const createCaseStudy = (data: any) =>
  API.post("/case-studies", data);


export const getImageLibrary = async () => {
  const res = await API.get("/image-library");
  return res.data;
};


export const getCaseStudies = () =>
  API.get("/case-studies");


export const getCaseStudy = (slug: string) =>
  API.get(`/case-studies/${slug}`);


// =========================================================
// JOBS - ADMIN
// =========================================================

// Create Job
export const createJob = async (data: any) => {
  const res = await API.post("/jobs", data);
  return res.data;
};


// Get all jobs for Admin
export const getAdminJobs = async () => {
  const res = await API.get("/admin/jobs");
  return res.data;
};


// Get single job for Admin
export const getAdminJob = async (slug: string) => {
  const res = await API.get(
    `/admin/jobs/${slug}`
  );

  return res.data;
};


// Update Job
export const updateJob = async (
  slug: string,
  data: any
) => {
  const res = await API.put(
    `/jobs/${slug}`,
    data
  );

  return res.data;
};


// Delete Job
export const deleteJob = async (
  jobId: string
) => {
  const res = await API.delete(
    `/jobs/${jobId}`
  );

  return res.data;
};


// Publish / Unpublish Job
export const publishJob = async (
  slug: string
) => {
  const res = await API.put(
    `/jobs/${slug}/publish`
  );

  return res.data;
};


// Check Job Slug
export const checkJobSlug = async (
  slug: string
) => {
  const res = await API.get(
    `/jobs/check-slug/${slug}`
  );

  return res.data;
};


// =========================================================
// JOBS - PUBLIC FRONTEND
// =========================================================

// Get all published jobs
export const getJobs = async () => {
  const res = await API.get("/jobs");
  return res.data;
};


// Get one published job
export const getJob = async (
  slug: string
) => {
  const res = await API.get(
    `/jobs/${slug}`
  );

  return res.data;
};


// =========================================================

export default API;