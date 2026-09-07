import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  BriefcaseBusiness,
  MapPin,
  Clock3,
  IndianRupee,
  CalendarDays,
  CheckCircle2,
  Upload,
  FileText,
  X,
  User,
  Mail,
  Phone,
  Globe,
} from "lucide-react";

import { getJob } from "../services/api";
import "../styles/jobDetail.css";

const JobDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    current_location: "",
    current_pincode: "",
    linkedin: "",
    portfolio: "",
    github_url: "",
    total_experience: "",
    expected_package: "",
    notice_period: "",
    preferred_locations: "",
    relocation: "",
    key_skills: "",
    immediate_joiner: false,
    authorized_to_work: "",
    declaration_consent: false,
  });

  const [resume, setResume] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeId, setResumeId] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getJob(slug);

        const jobData = response?.data || response;

        if (!jobData) {
          setError("Job not found.");
          return;
        }

        if (jobData.published !== true) {
          setError("This job is not currently available.");
          return;
        }

        setJob(jobData);
      } catch (err) {
        console.error("Error fetching job:", err);
        setError("Unable to load this job.");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchJob();
    }
  }, [slug]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const formatArray = (value) => {
    if (!Array.isArray(value)) {
      return [];
    }

    return value.filter(
      (item) => item !== null && item !== undefined && String(item).trim()
    );
  };

  const formatExperience = () => {
    if (
      job?.min_experience !== undefined &&
      job?.min_experience !== null &&
      job?.max_experience !== undefined &&
      job?.max_experience !== null
    ) {
      return `${job.min_experience} - ${job.max_experience} years`;
    }

    if (
      job?.min_experience !== undefined &&
      job?.min_experience !== null
    ) {
      return `${job.min_experience}+ years`;
    }

    if (
      job?.max_experience !== undefined &&
      job?.max_experience !== null
    ) {
      return `Up to ${job.max_experience} years`;
    }

    return "Not specified";
  };

  const formatPackage = () => {
    if (
      job?.min_package !== undefined &&
      job?.min_package !== null &&
      job?.max_package !== undefined &&
      job?.max_package !== null
    ) {
      return `₹${job.min_package} - ₹${job.max_package} LPA`;
    }

    if (
      job?.min_package !== undefined &&
      job?.min_package !== null
    ) {
      return `₹${job.min_package} LPA`;
    }

    if (
      job?.max_package !== undefined &&
      job?.max_package !== null
    ) {
      return `Up to ₹${job.max_package} LPA`;
    }

    return "Not specified";
  };

  const formatNoticePeriod = () => {
    if (
      job?.min_notice_period !== undefined &&
      job?.min_notice_period !== null &&
      job?.max_notice_period !== undefined &&
      job?.max_notice_period !== null
    ) {
      return `${job.min_notice_period} - ${job.max_notice_period} days`;
    }

    if (
      job?.min_notice_period !== undefined &&
      job?.min_notice_period !== null
    ) {
      return `${job.min_notice_period}+ days`;
    }

    if (
      job?.max_notice_period !== undefined &&
      job?.max_notice_period !== null
    ) {
      return `Up to ${job.max_notice_period} days`;
    }

    return "Not specified";
  };

  const formatWorkMode = () => {
    const modes = formatArray(job?.work_mode);

    if (!modes.length) {
      return "Not specified";
    }

    return modes.join(" / ");
  };

  const formatPublishedDate = () => {
    if (!job?.publishedAt) {
      return "Not specified";
    }

    const date = new Date(job.publishedAt);

    if (Number.isNaN(date.getTime())) {
      return "Not specified";
    }

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getApiBaseUrl = () => {
    return (
      import.meta.env.VITE_API_URL ||
      import.meta.env.VITE_BASE_URL ||
      ""
    ).replace(/\/$/, "");
  };

  const handleResumeChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setResume(file);
    setSubmitError("");
    setSubmitMessage("");

    /*
      The public application upload endpoint requires the actual
      form token returned by the backend.

      Do not create or invent a token here.
    */
    const formToken =
      job?.form_token ||
      job?.formToken ||
      job?.application_form_token ||
      job?.applicationFormToken ||
      "";

    if (!formToken) {
      return;
    }

    try {
      setUploadingResume(true);

      const uploadData = new FormData();

      uploadData.append("file", file);
      uploadData.append("document_name", file.name);
      uploadData.append("form_token", formToken);

      const baseUrl = getApiBaseUrl();

      const response = await fetch(
        `${baseUrl}/api/documents/upload`,
        {
          method: "POST",
          body: uploadData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            data?.message ||
            "Resume upload failed."
        );
      }

      const uploadedId =
        data?.docu_id ||
        data?.document_id ||
        data?.id ||
        "";

      setResumeId(uploadedId);

      if (!uploadedId) {
        setSubmitError(
          "Resume uploaded, but the document ID was not returned by the server."
        );
      }
    } catch (err) {
      console.error("Resume upload error:", err);

      setResumeId("");

      setSubmitError(
        err?.message || "Unable to upload resume."
      );
    } finally {
      setUploadingResume(false);
    }
  };

  const removeResume = () => {
    setResume(null);
    setResumeId("");

    const input = document.getElementById(
      "candidate-resume"
    );

    if (input) {
      input.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitError("");
    setSubmitMessage("");

    const formToken =
      job?.form_token ||
      job?.formToken ||
      job?.application_form_token ||
      job?.applicationFormToken ||
      "";

    const jobId =
      job?.job_id ||
      job?.jobId ||
      "";

    /*
      These values must come from the backend.
      They are intentionally not generated on the frontend.
    */
    if (!formToken) {
      setSubmitError(
        "Application form is not configured for this job."
      );
      return;
    }

    if (!jobId) {
      setSubmitError(
        "Job application ID is not available."
      );
      return;
    }

    if (!formData.name.trim()) {
      setSubmitError("Please enter your name.");
      return;
    }

    if (!formData.email.trim()) {
      setSubmitError("Please enter your email.");
      return;
    }

    if (!formData.phone.trim()) {
      setSubmitError("Please enter your phone number.");
      return;
    }

    if (!formData.declaration_consent) {
      setSubmitError(
        "Please accept the declaration before submitting."
      );
      return;
    }

    /*
      Backend requires primary email verification.
      The application cannot be successfully submitted
      until the email verification flow is completed.
    */
    setSubmitting(true);

    try {
      const baseUrl = getApiBaseUrl();

      const payload = {
        job_id: jobId,

        name: formData.name,
        email: formData.email,
        phone: formData.phone,

        current_location:
          formData.current_location,

        current_pincode:
          formData.current_pincode,

        linkedin:
          formData.linkedin,

        portfolio:
          formData.portfolio,

        github_url:
          formData.github_url,

        total_experience:
          formData.total_experience,

        expected_package:
          formData.expected_package,

        notice_period:
          formData.notice_period,

        preferred_locations:
          formData.preferred_locations,

        relocation:
          formData.relocation,

        key_skills:
          formData.key_skills,

        immediate_joiner:
          formData.immediate_joiner,

        authorized_to_work:
          formData.authorized_to_work,

        declaration_consent:
          formData.declaration_consent,

        resume_id:
          resumeId || null,

        email_verified: false,

        education: [],
        skills: [],
        certifications: [],
        work_history: [],
      };

      const response = await fetch(
        `${baseUrl}/api/candidate/org-form/${formToken}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            data?.message ||
            "Application submission failed."
        );
      }

      setSubmitMessage(
        "Application submitted successfully."
      );

      setFormData({
        name: "",
        email: "",
        phone: "",
        current_location: "",
        current_pincode: "",
        linkedin: "",
        portfolio: "",
        github_url: "",
        total_experience: "",
        expected_package: "",
        notice_period: "",
        preferred_locations: "",
        relocation: "",
        key_skills: "",
        immediate_joiner: false,
        authorized_to_work: "",
        declaration_consent: false,
      });

      setResume(null);
      setResumeId("");
    } catch (err) {
      console.error("Application submission error:", err);

      setSubmitError(
        err?.message ||
          "Unable to submit your application."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="job-detail-page">
        <div className="job-detail-loading">
          Loading job...
        </div>
      </main>
    );
  }

  if (error || !job) {
    return (
      <main className="job-detail-page">
        <div className="job-detail-error">
          <h2>{error || "Job not found."}</h2>

          
        </div>
      </main>
    );
  }

  const mandatorySkills = formatArray(
    job.mandatory_skills
  );

  const optionalSkills = formatArray(
    job.optional_skills
  );

  return (
    <main className="job-detail-page">

      {/* =========================================
          HERO
      ========================================= */}

      <section className="job-detail-hero">
        <div className="job-detail-container">

         

          <div className="job-hero-content">

            <div className="job-status">
              <CheckCircle2 size={16} />
              Open Position
            </div>

            <h1>{job.title}</h1>

            {job.description && (
              <p className="job-hero-description">
                {job.description}
              </p>
            )}

            <div className="job-hero-tags">

              {job.location && (
                <span className="job-hero-tag">
                  <MapPin size={17} />
                  {job.location}
                </span>
              )}

              {job.job_type && (
                <span className="job-hero-tag">
                  <BriefcaseBusiness size={17} />
                  {job.job_type}
                </span>
              )}

              {formatWorkMode() !== "Not specified" && (
                <span className="job-hero-tag">
                  <Globe size={17} />
                  {formatWorkMode()}
                </span>
              )}

            </div>
          </div>
        </div>
      </section>


      {/* =========================================
          MAIN CONTENT
      ========================================= */}

      <section className="job-detail-content">
        <div className="job-detail-container">

          {/* =====================================
              SUMMARY CARD
          ===================================== */}

          <section className="job-summary-card">

            <div className="job-summary-item">
              <div className="job-summary-icon">
                <BriefcaseBusiness size={19} />
              </div>

              <div>
                <span>Experience</span>
                <strong>
                  {formatExperience()}
                </strong>
              </div>
            </div>

            <div className="job-summary-item">
              <div className="job-summary-icon">
                <IndianRupee size={19} />
              </div>

              <div>
                <span>Package</span>
                <strong>
                  {formatPackage()}
                </strong>
              </div>
            </div>

            <div className="job-summary-item">
              <div className="job-summary-icon">
                <Clock3 size={19} />
              </div>

              <div>
                <span>Notice Period</span>
                <strong>
                  {formatNoticePeriod()}
                </strong>
              </div>
            </div>

            <div className="job-summary-item">
              <div className="job-summary-icon">
                <MapPin size={19} />
              </div>

              <div>
                <span>Location</span>
                <strong>
                  {job.location || "Not specified"}
                </strong>
              </div>
            </div>

          </section>


          {/* =====================================
              JOB INFORMATION
          ===================================== */}

          <section className="job-section">

            <div className="job-section-heading">
              <h2>Job Description</h2>
            </div>

            <div className="job-description-box">
              {job.description ? (
                <p>{job.description}</p>
              ) : (
                <p className="job-empty-text">
                  No job description available.
                </p>
              )}
            </div>

          </section>


          {/* =====================================
              REQUIRED SKILLS
          ===================================== */}

          {mandatorySkills.length > 0 && (
            <section className="job-section">

              <div className="job-section-heading">
                <h2>Required Skills</h2>
              </div>

              <div className="job-skills-list">
                {mandatorySkills.map(
                  (skill, index) => (
                    <span
                      className="job-skill required"
                      key={`${skill}-${index}`}
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>

            </section>
          )}


          {/* =====================================
              OPTIONAL SKILLS
          ===================================== */}

          {optionalSkills.length > 0 && (
            <section className="job-section">

              <div className="job-section-heading">
                <h2>Optional Skills</h2>
              </div>

              <div className="job-skills-list">
                {optionalSkills.map(
                  (skill, index) => (
                    <span
                      className="job-skill optional"
                      key={`${skill}-${index}`}
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>

            </section>
          )}


          {/* =====================================
              JOB DETAILS
          ===================================== */}

          <section className="job-section">

            <div className="job-section-heading">
              <h2>Job Details</h2>
            </div>

            <div className="job-details-grid">

              <div className="job-detail-row">
                <span>Job Type</span>
                <strong>
                  {job.job_type || "Not specified"}
                </strong>
              </div>

              <div className="job-detail-row">
                <span>Work Mode</span>
                <strong>
                  {formatWorkMode()}
                </strong>
              </div>

              <div className="job-detail-row">
                <span>Location</span>
                <strong>
                  {job.location || "Not specified"}
                </strong>
              </div>

              <div className="job-detail-row">
                <span>Experience</span>
                <strong>
                  {formatExperience()}
                </strong>
              </div>

              <div className="job-detail-row">
                <span>Package</span>
                <strong>
                  {formatPackage()}
                </strong>
              </div>

              <div className="job-detail-row">
                <span>Notice Period</span>
                <strong>
                  {formatNoticePeriod()}
                </strong>
              </div>

              <div className="job-detail-row">
                <span>Published</span>
                <strong>
                  {formatPublishedDate()}
                </strong>
              </div>

            </div>

          </section>


          {/* =====================================
              DIVIDER
          ===================================== */}

          <div className="job-application-divider">
            <span></span>
          </div>


          {/* =====================================
              APPLICATION FORM
          ===================================== */}

          <section
            className="job-application-section"
            id="application-form"
          >

            <div className="application-header">
              <span className="application-eyebrow">
                APPLY FOR THIS POSITION
              </span>

              <h2>Candidate Application</h2>

              <p>
                Submit your details and resume for
                consideration.
              </p>
            </div>


            <form
              className="candidate-form"
              onSubmit={handleSubmit}
            >

              {/* =================================
                  PERSONAL INFORMATION
              ================================= */}

              <div className="candidate-form-section">

                <div className="candidate-form-section-title">
                  <User size={19} />
                  <h3>Personal Information</h3>
                </div>

                <div className="candidate-form-grid">

                  <div className="candidate-field">
                    <label htmlFor="candidate-name">
                      Full Name *
                    </label>

                    <input
                      id="candidate-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>


                  <div className="candidate-field">
                    <label htmlFor="candidate-email">
                      Email *
                    </label>

                    <div className="candidate-input-icon">
                      <Mail size={17} />

                      <input
                        id="candidate-email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>


                  <div className="candidate-field">
                    <label htmlFor="candidate-phone">
                      Phone Number *
                    </label>

                    <div className="candidate-input-icon">
                      <Phone size={17} />

                      <input
                        id="candidate-phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                  </div>


                  <div className="candidate-field">
                    <label htmlFor="candidate-location">
                      Current Location
                    </label>

                    <input
                      id="candidate-location"
                      type="text"
                      name="current_location"
                      value={
                        formData.current_location
                      }
                      onChange={handleChange}
                      placeholder="Current city"
                    />
                  </div>


                  <div className="candidate-field">
                    <label htmlFor="candidate-pincode">
                      Pincode
                    </label>

                    <input
                      id="candidate-pincode"
                      type="text"
                      name="current_pincode"
                      value={
                        formData.current_pincode
                      }
                      onChange={handleChange}
                      placeholder="Pincode"
                    />
                  </div>

                </div>

              </div>


              {/* =================================
                  PROFESSIONAL INFORMATION
              ================================= */}

              <div className="candidate-form-section">

                <div className="candidate-form-section-title">
                  <BriefcaseBusiness size={19} />
                  <h3>Professional Information</h3>
                </div>

                <div className="candidate-form-grid">

                  <div className="candidate-field">
                    <label htmlFor="candidate-experience">
                      Total Experience
                    </label>

                    <input
                      id="candidate-experience"
                      type="text"
                      name="total_experience"
                      value={
                        formData.total_experience
                      }
                      onChange={handleChange}
                      placeholder="e.g. 6 years"
                    />
                  </div>


                  <div className="candidate-field">
                    <label htmlFor="candidate-expected-package">
                      Expected Package
                    </label>

                    <input
                      id="candidate-expected-package"
                      type="text"
                      name="expected_package"
                      value={
                        formData.expected_package
                      }
                      onChange={handleChange}
                      placeholder="e.g. 25 LPA"
                    />
                  </div>


                  <div className="candidate-field">
                    <label htmlFor="candidate-notice">
                      Notice Period
                    </label>

                    <input
                      id="candidate-notice"
                      type="text"
                      name="notice_period"
                      value={
                        formData.notice_period
                      }
                      onChange={handleChange}
                      placeholder="e.g. 30 days"
                    />
                  </div>


                  <div className="candidate-field">
                    <label htmlFor="candidate-preferred-location">
                      Preferred Locations
                    </label>

                    <input
                      id="candidate-preferred-location"
                      type="text"
                      name="preferred_locations"
                      value={
                        formData.preferred_locations
                      }
                      onChange={handleChange}
                      placeholder="Preferred locations"
                    />
                  </div>


                  <div className="candidate-field candidate-field-full">
                    <label htmlFor="candidate-skills">
                      Key Skills
                    </label>

                    <input
                      id="candidate-skills"
                      type="text"
                      name="key_skills"
                      value={formData.key_skills}
                      onChange={handleChange}
                      placeholder="e.g. Python, SQL, MongoDB"
                    />
                  </div>

                </div>


                <div className="candidate-checkbox-row">

                  <label className="candidate-checkbox">
                    <input
                      type="checkbox"
                      name="immediate_joiner"
                      checked={
                        formData.immediate_joiner
                      }
                      onChange={handleChange}
                    />

                    <span>
                      I am an immediate joiner
                    </span>
                  </label>

                </div>


                <div className="candidate-field candidate-select-field">
                  <label htmlFor="candidate-relocation">
                    Relocation
                  </label>

                  <select
                    id="candidate-relocation"
                    name="relocation"
                    value={formData.relocation}
                    onChange={handleChange}
                  >
                    <option value="">
                      Select
                    </option>

                    <option value="Yes">
                      Yes
                    </option>

                    <option value="No">
                      No
                    </option>
                  </select>
                </div>


                <div className="candidate-field candidate-select-field">
                  <label htmlFor="candidate-authorized">
                    Authorized To Work
                  </label>

                  <select
                    id="candidate-authorized"
                    name="authorized_to_work"
                    value={
                      formData.authorized_to_work
                    }
                    onChange={handleChange}
                  >
                    <option value="">
                      Select
                    </option>

                    <option value="Yes">
                      Yes
                    </option>

                    <option value="No">
                      No
                    </option>
                  </select>
                </div>

              </div>


              {/* =================================
                  LINKS
              ================================= */}

              <div className="candidate-form-section">

                <div className="candidate-form-section-title">
                  <Globe size={19} />
                  <h3>Professional Links</h3>
                </div>

                <div className="candidate-form-grid">

                  <div className="candidate-field">
                    <label htmlFor="candidate-linkedin">
                      LinkedIn URL
                    </label>

                    <input
                      id="candidate-linkedin"
                      type="url"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>


                  <div className="candidate-field">
                    <label htmlFor="candidate-portfolio">
                      Portfolio URL
                    </label>

                    <input
                      id="candidate-portfolio"
                      type="url"
                      name="portfolio"
                      value={formData.portfolio}
                      onChange={handleChange}
                      placeholder="https://..."
                    />
                  </div>


                  <div className="candidate-field">
                    <label htmlFor="candidate-github">
                      GitHub URL
                    </label>

                    <input
                      id="candidate-github"
                      type="url"
                      name="github_url"
                      value={formData.github_url}
                      onChange={handleChange}
                      placeholder="https://github.com/..."
                    />
                  </div>

                </div>

              </div>


              {/* =================================
                  RESUME
              ================================= */}

              <div className="candidate-form-section">

                <div className="candidate-form-section-title">
                  <FileText size={19} />
                  <h3>Resume</h3>
                </div>

                <div className="resume-upload-box">

                  {!resume ? (
                    <label
                      htmlFor="candidate-resume"
                      className="resume-upload-label"
                    >
                      <div className="resume-upload-icon">
                        <Upload size={22} />
                      </div>

                      <div className="resume-upload-text">
                        <strong>
                          Upload your resume
                        </strong>

                        <span>
                          Choose a resume file from
                          your device
                        </span>
                      </div>

                      <span className="resume-upload-button">
                        Choose File
                      </span>

                      <input
                        id="candidate-resume"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={
                          handleResumeChange
                        }
                      />
                    </label>
                  ) : (
                    <div className="selected-resume">

                      <div className="selected-resume-left">
                        <div className="selected-resume-icon">
                          <FileText size={20} />
                        </div>

                        <div>
                          <strong>
                            {resume.name}
                          </strong>

                          <span>
                            {(
                              resume.size /
                              1024 /
                              1024
                            ).toFixed(2)}{" "}
                            MB
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="remove-resume"
                        onClick={removeResume}
                        aria-label="Remove resume"
                      >
                        <X size={18} />
                      </button>

                    </div>
                  )}

                </div>

                {uploadingResume && (
                  <p className="resume-status">
                    Uploading resume...
                  </p>
                )}

                {resumeId && (
                  <p className="resume-success">
                    Resume uploaded successfully.
                  </p>
                )}

              </div>


              {/* =================================
                  DECLARATION
              ================================= */}

              <div className="candidate-declaration">

                <label className="candidate-declaration-label">

                  <input
                    type="checkbox"
                    name="declaration_consent"
                    checked={
                      formData.declaration_consent
                    }
                    onChange={handleChange}
                    required
                  />

                  <span>
                    I declare that the information
                    provided by me is accurate and
                    complete to the best of my
                    knowledge.
                  </span>

                </label>

              </div>


              {/* =================================
                  MESSAGES
              ================================= */}

              {submitError && (
                <div className="candidate-form-error">
                  {submitError}
                </div>
              )}

              {submitMessage && (
                <div className="candidate-form-success">
                  {submitMessage}
                </div>
              )}


              {/* =================================
                  SUBMIT
              ================================= */}

              <div className="candidate-submit-wrapper">

                <button
                  type="submit"
                  className="candidate-submit-button"
                  disabled={
                    submitting ||
                    uploadingResume
                  }
                >
                  {submitting
                    ? "Submitting..."
                    : "Submit Application"}
                </button>

              </div>

            </form>

          </section>

        </div>
      </section>

    </main>
  );
};

export default JobDetail;