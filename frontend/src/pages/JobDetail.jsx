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
  Globe,
  ExternalLink,
} from "lucide-react";

import { getJob } from "../services/api";
import "../styles/jobDetail.css";

const JobDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  // =========================================================
  // HELPERS
  // =========================================================

  const formatArray = (value) => {
    if (!Array.isArray(value)) {
      return [];
    }

    return value.filter(
      (item) =>
        item !== null &&
        item !== undefined &&
        String(item).trim()
    );
  };

  const formatExperience = () => {
    const min = job?.min_experience;
    const max = job?.max_experience;

    if (min !== null && min !== undefined &&
        max !== null && max !== undefined) {
      return `${min} - ${max} years`;
    }

    if (min !== null && min !== undefined) {
      return `${min}+ years`;
    }

    if (max !== null && max !== undefined) {
      return `Up to ${max} years`;
    }

    return "Not specified";
  };

  const formatPackage = () => {
    const min = job?.min_package;
    const max = job?.max_package;

    if (min !== null && min !== undefined &&
        max !== null && max !== undefined) {
      return `₹${min} - ₹${max} LPA`;
    }

    if (min !== null && min !== undefined) {
      return `₹${min} LPA`;
    }

    if (max !== null && max !== undefined) {
      return `Up to ₹${max} LPA`;
    }

    return "Not specified";
  };

  const formatNoticePeriod = () => {
    const min = job?.min_notice_period;
    const max = job?.max_notice_period;

    if (min !== null && min !== undefined &&
        max !== null && max !== undefined) {
      return `${min} - ${max} days`;
    }

    if (min !== null && min !== undefined) {
      return `${min}+ days`;
    }

    if (max !== null && max !== undefined) {
      return `Up to ${max} days`;
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

  // =========================================================
  // APPLY LINK
  // =========================================================

  const getApplyLink = () => {
    const link = job?.applyLink;

    if (!link || typeof link !== "string") {
      return "";
    }

    const trimmedLink = link.trim();

    if (!trimmedLink) {
      return "";
    }

    return trimmedLink;
  };

  const applyLink = getApplyLink();

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <main className="job-detail-page">
        <div className="job-detail-loading">
          Loading job...
        </div>
      </main>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error || !job) {
    return (
      <main className="job-detail-page">
        <div className="job-detail-error">
          <h2>{error || "Job not found."}</h2>

          <button
            type="button"
            className="job-back-button"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={17} />
            Back to Jobs
          </button>
        </div>
      </main>
    );
  }

  // =========================================================
  // SKILLS
  // =========================================================

  const mandatorySkills = formatArray(
    job.mandatory_skills
  );

  const optionalSkills = formatArray(
    job.optional_skills
  );

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <main className="job-detail-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="job-detail-hero">
        <div className="job-detail-container">

          <br/><br/>

          <div className="job-hero-content">

            <div className="job-status">
              <CheckCircle2 size={15} />
              Open Position
            </div>

            <h1>{job.title}</h1>

            <div className="job-hero-tags">

              {job.location && (
                <span className="job-hero-tag">
                  <MapPin size={16} />
                  {job.location}
                </span>
              )}

              {job.job_type && (
                <span className="job-hero-tag">
                  <BriefcaseBusiness size={16} />
                  {job.job_type}
                </span>
              )}

              {formatWorkMode() !== "Not specified" && (
                <span className="job-hero-tag">
                  <Globe size={16} />
                  {formatWorkMode()}
                </span>
              )}

            </div>

          </div>
        </div>
      </section>


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <section className="job-detail-content">
        <div className="job-detail-container">

          <div className="job-detail-layout">

            {/* =================================================
                LEFT SIDE
            ================================================= */}

            <div className="job-detail-main">

              {/* JOB SUMMARY */}

              <section className="job-summary-card">

                <div className="job-summary-item">
                  <div className="job-summary-icon">
                    <BriefcaseBusiness size={18} />
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
                    <IndianRupee size={18} />
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
                    <Clock3 size={18} />
                  </div>

                  <div>
                    <span>Notice Period</span>
                    <strong>
                      {formatNoticePeriod()}
                    </strong>
                  </div>
                </div>

              </section>


              {/* DESCRIPTION */}

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


              {/* REQUIRED SKILLS */}

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


              {/* OPTIONAL SKILLS */}

              {optionalSkills.length > 0 && (
                <section className="job-section">

                  <div className="job-section-heading">
                    <h2>Optional Skills</h2>
                  </div>

                  <div className="job-skills-list">
                    {mandatorySkills.map(
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


              {/* JOB DETAILS */}

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

            </div>


            {/* =================================================
                RIGHT SIDE — APPLY
            ================================================= */}

            <aside className="job-apply-sidebar">

              <div className="job-apply-card">

                <div className="job-apply-icon">
                  <BriefcaseBusiness size={21} />
                </div>

                <div className="job-apply-content">

                  <span className="job-apply-eyebrow">
                    Interested in this role?
                  </span>

                  <h3>
                    Apply for this position
                  </h3>

                  <p>
                    Submit your application through
                    the official application portal.
                  </p>

                </div>

                {applyLink ? (
                  <a
                    href={applyLink}
                    className="job-apply-button"
                  >
                    Apply Now
                    <ExternalLink size={17} />
                  </a>
                ) : (
                  <button
                    type="button"
                    className="job-apply-button disabled"
                    disabled
                  >
                    Application Unavailable
                  </button>
                )}

                <div className="job-apply-note">
                  <CalendarDays size={14} />
                  Please review the job details before applying.
                </div>

              </div>

            </aside>

          </div>

        </div>
      </section>

    </main>
  );
};

export default JobDetail;