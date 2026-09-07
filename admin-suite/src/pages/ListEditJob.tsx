import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getAdminJobs,
  deleteJob,
  publishJob,
} from "../services/api";

interface Job {
  _id: string;
  title: string;
  location: string;
  work_mode: string[];
  job_type: string;

  mandatory_skills: string[];
  optional_skills?: string[];

  min_experience?: number | null;
  max_experience?: number | null;

  min_package?: number | null;
  max_package?: number | null;

  min_notice_period?: number | null;
  max_notice_period?: number | null;

  description: string;
  slug: string;

  published: boolean;
  publishedAt?: string | null;

  createdAt?: string | null;
  updatedAt?: string | null;
}

const ListEditJob = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [actionLoading, setActionLoading] =
    useState<string | null>(null);

  const [deleteId, setDeleteId] =
    useState<string | null>(null);

  const [message, setMessage] = useState("");

  /* =========================================================
     LOAD JOBS
  ========================================================= */

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminJobs();

      /*
       * Latest published jobs first.
       * If publication date is same/not available,
       * latest created job comes first.
       */
      const sortedJobs = [...response].sort(
        (a: Job, b: Job) => {
          const dateA = a.publishedAt
            ? new Date(a.publishedAt).getTime()
            : 0;

          const dateB = b.publishedAt
            ? new Date(b.publishedAt).getTime()
            : 0;

          if (dateA !== dateB) {
            return dateB - dateA;
          }

          const createdA = a.createdAt
            ? new Date(a.createdAt).getTime()
            : 0;

          const createdB = b.createdAt
            ? new Date(b.createdAt).getTime()
            : 0;

          return createdB - createdA;
        }
      );

      setJobs(sortedJobs);
    } catch (err: any) {
      console.error("Get Jobs Error:", err);

      setError(
        err?.response?.data?.detail ||
          "Failed to load jobs."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });

    loadJobs();
  }, []);

  /* =========================================================
     DATE
  ========================================================= */

  const formatDateTime = (
    date?: string | null
  ) => {
    if (!date) {
      return "—";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /* =========================================================
     EXPERIENCE
  ========================================================= */

  const getExperience = (job: Job) => {
    const min = job.min_experience;
    const max = job.max_experience;

    if (
      min === null ||
      min === undefined
    ) {
      if (
        max === null ||
        max === undefined
      ) {
        return "Experience not specified";
      }

      return `Up to ${max} Yrs`;
    }

    if (
      max === null ||
      max === undefined
    ) {
      return `${min}+ Yrs`;
    }

    return `${min} - ${max} Yrs`;
  };

  /* =========================================================
     PACKAGE
  ========================================================= */

  const getPackage = (job: Job) => {
    const min = job.min_package;
    const max = job.max_package;

    if (
      min === null ||
      min === undefined
    ) {
      if (
        max === null ||
        max === undefined
      ) {
        return "Package not specified";
      }

      return `Up to ${max} LPA`;
    }

    if (
      max === null ||
      max === undefined
    ) {
      return `${min}+ LPA`;
    }

    return `${min} - ${max} LPA`;
  };

  /* =========================================================
     DESCRIPTION
  ========================================================= */

  const getShortDescription = (
    description: string
  ) => {
    if (!description) {
      return "No job description available.";
    }

    const cleanDescription =
      description
        .replace(/\s+/g, " ")
        .trim();

    if (cleanDescription.length <= 155) {
      return cleanDescription;
    }

    return (
      cleanDescription.substring(
        0,
        155
      ) + "..."
    );
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const handleDelete = async (
    jobId: string
  ) => {
    try {
      setActionLoading(jobId);
      setError("");
      setMessage("");

      await deleteJob(jobId);

      setJobs((prev) =>
        prev.filter(
          (job) => job._id !== jobId
        )
      );

      setDeleteId(null);

      setMessage(
        "Job deleted successfully."
      );
    } catch (err: any) {
      console.error(
        "Delete Job Error:",
        err
      );

      setError(
        err?.response?.data?.detail ||
          "Failed to delete job."
      );
    } finally {
      setActionLoading(null);
    }
  };

  /* =========================================================
     PUBLISH / UNPUBLISH
  ========================================================= */

  const handlePublish = async (
    slug: string
  ) => {
    try {
      setActionLoading(slug);
      setError("");
      setMessage("");

      const response =
        await publishJob(slug);

      await loadJobs();

      setMessage(
        response?.published
          ? "Job published successfully."
          : "Job unpublished successfully."
      );
    } catch (err: any) {
      console.error(
        "Publish Job Error:",
        err
      );

      setError(
        err?.response?.data?.detail ||
          "Failed to update job status."
      );
    } finally {
      setActionLoading(null);
    }
  };

  /* =========================================================
     SELECTED DELETE JOB
  ========================================================= */

  const selectedDeleteJob =
    jobs.find(
      (job) => job._id === deleteId
    );

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f7fbff 0%, #f7f8fa 100%)",
        padding:
          "42px 32px 60px",
        boxSizing: "border-box",

        fontFamily:
          "'Comfortaa', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1450px",
          margin: "0 auto",
        }}
      >
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "flex-end",
            gap: "25px",
            marginBottom: "38px",
          }}
        >
          <div>
            <div
              style={{
                width: "48px",
                height: "4px",
                borderRadius: "10px",
                background:
                  "#3c83c7",
                marginBottom: "16px",
              }}
            />

            <h1
              style={{
                margin: 0,
                fontSize: "38px",
                lineHeight: 1.2,
                fontWeight: 500,
                letterSpacing:
                  "-0.8px",
                color: "#173f63",
              }}
            >
              Jobs
            </h1>

            <p
              style={{
                margin:
                  "12px 0 0",
                color: "#71869a",
                fontSize: "15px",
                lineHeight: 1.7,
              }}
            >
              Manage your job openings,
              publishing and job details.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/create-job"
              )
            }
            style={{
              border: "none",
              borderRadius: "10px",
              padding:
                "13px 22px",
              background:
                "#2f80c5",
              color: "#ffffff",
              fontFamily:
                "'Comfortaa', sans-serif",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow:
                "0 8px 20px rgba(47,128,197,.18)",
              transition:
                "all .2s ease",
              whiteSpace:
                "nowrap",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                "#256da9";
              e.currentTarget.style.transform =
                "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                "#2f80c5";
              e.currentTarget.style.transform =
                "translateY(0)";
            }}
          >
            + Create Job
          </button>
        </div>

        {/* =====================================================
            MESSAGES
        ====================================================== */}

        {message && (
          <div
            style={{
              background:
                "#eef9f2",
              border:
                "1px solid #c7e6d0",
              color: "#287344",
              padding:
                "13px 17px",
              borderRadius: "10px",
              marginBottom:
                "24px",
              fontSize: "14px",
            }}
          >
            {message}
          </div>
        )}

        {error && (
          <div
            style={{
              background:
                "#fff3f2",
              border:
                "1px solid #f2cccc",
              color: "#c62828",
              padding:
                "13px 17px",
              borderRadius: "10px",
              marginBottom:
                "24px",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        {/* =====================================================
            LOADING
        ====================================================== */}

        {loading ? (
          <div
            style={{
              background:
                "#ffffff",
              border:
                "1px solid #e0e8ef",
              borderTop:
                "4px solid #3c83c7",
              borderRadius:
                "14px",
              padding:
                "70px 30px",
              textAlign:
                "center",
              color:
                "#71869a",
              fontSize: "15px",
              boxShadow:
                "0 8px 30px rgba(30,70,100,.05)",
            }}
          >
            Loading jobs...
          </div>
        ) : jobs.length === 0 ? (
          /* =====================================================
             EMPTY
          ====================================================== */

          <div
            style={{
              background:
                "#ffffff",
              border:
                "1px solid #e0e8ef",
              borderTop:
                "4px solid #3c83c7",
              borderRadius:
                "14px",
              padding:
                "75px 30px",
              textAlign:
                "center",
              boxShadow:
                "0 8px 30px rgba(30,70,100,.05)",
            }}
          >
            <div
              style={{
                fontSize:
                  "22px",
                fontWeight: 500,
                color:
                  "#244968",
                marginBottom:
                  "10px",
              }}
            >
              No jobs found
            </div>

            <div
              style={{
                fontSize:
                  "14px",
                color:
                  "#7b8d9d",
                marginBottom:
                  "25px",
              }}
            >
              Create your first
              job opening.
            </div>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/create-job"
                )
              }
              style={{
                border: "none",
                borderRadius: "9px",
                padding:
                  "12px 20px",
                background:
                  "#3c83c7",
                color:
                  "#ffffff",
                fontFamily:
                  "'Comfortaa', sans-serif",
                fontSize:
                  "14px",
                fontWeight:
                  600,
                cursor:
                  "pointer",
              }}
            >
              Create Job
            </button>
          </div>
        ) : (
          /* =====================================================
             JOB CARD GRID
          ====================================================== */

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(390px, 1fr))",
              gap: "28px",
              alignItems:
                "stretch",
            }}
          >
            {jobs.map((job) => (
              <article
                key={job._id}
                style={{
                  position:
                    "relative",
                  display:
                    "flex",
                  flexDirection:
                    "column",
                  background:
                    "#ffffff",
                  border:
                    "1px solid #dce6ee",
                  borderTop:
                    "4px solid #3c83c7",
                  borderRadius:
                    "14px",
                  overflow:
                    "hidden",
                  boxShadow:
                    "0 8px 28px rgba(32,73,105,.07)",
                  transition:
                    "transform .25s ease, box-shadow .25s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 16px 38px rgba(32,73,105,.13)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 28px rgba(32,73,105,.07)";
                }}
              >
                {/* =================================================
                    CARD CONTENT
                ================================================== */}

                <div
                  style={{
                    padding:
                      "25px 25px 22px",
                    flex: 1,
                  }}
                >
                  {/* BADGES */}

                  <div
                    style={{
                      display:
                        "flex",
                      alignItems:
                        "center",
                      flexWrap:
                        "wrap",
                      gap: "8px",
                      marginBottom:
                        "17px",
                    }}
                  >
                    <span
                      style={{
                        display:
                          "inline-flex",
                        alignItems:
                          "center",
                        padding:
                          "8px 13px",
                        borderRadius:
                          "20px",
                        background:
                          "#eaf4fd",
                        color:
                          "#3c83c7",
                        fontSize:
                          "12px",
                        fontWeight:
                          600,
                      }}
                    >
                      {job.job_type ||
                        "Job"}
                    </span>

                    <span
                      style={{
                        display:
                          "inline-flex",
                        alignItems:
                          "center",
                        padding:
                          "8px 13px",
                        borderRadius:
                          "20px",
                        background:
                          job.published
                            ? "#275d86"
                            : "#edf1f4",
                        color:
                          job.published
                            ? "#ffffff"
                            : "#667887",
                        fontSize:
                          "12px",
                        fontWeight:
                          600,
                      }}
                    >
                      {job.published
                        ? "Published"
                        : "Draft"}
                    </span>
                  </div>

                  {/* TITLE */}

                  <h2
                    style={{
                      margin:
                        "0 0 9px",
                      fontSize:
                        "23px",
                      lineHeight:
                        1.35,
                      fontWeight:
                        500,
                      color:
                        "#173f63",
                      letterSpacing:
                        "-0.3px",
                    }}
                  >
                    {job.title}
                  </h2>

                  {/* SLUG */}

                  <div
                    style={{
                      color:
                        "#8a9aa8",
                      fontSize:
                        "12px",
                      marginBottom:
                        "19px",
                      wordBreak:
                        "break-word",
                    }}
                  >
                    /{job.slug}
                  </div>

                  {/* META */}

                  <div
                    style={{
                      display:
                        "grid",
                      gridTemplateColumns:
                        "1fr 1fr",
                      gap:
                        "10px",
                      marginBottom:
                        "19px",
                    }}
                  >
                    <div
                      style={{
                        border:
                          "1px solid #e5edf3",
                        background:
                          "#f8fbfd",
                        borderRadius:
                          "9px",
                        padding:
                          "11px 12px",
                      }}
                    >
                      <div
                        style={{
                          color:
                            "#8a9aa8",
                          fontSize:
                            "11px",
                          marginBottom:
                            "5px",
                        }}
                      >
                        LOCATION
                      </div>

                      <div
                        style={{
                          color:
                            "#38566f",
                          fontSize:
                            "13px",
                          fontWeight:
                            600,
                          lineHeight:
                            1.4,
                        }}
                      >
                        {job.location ||
                          "Not specified"}
                      </div>
                    </div>

                    <div
                      style={{
                        border:
                          "1px solid #e5edf3",
                        background:
                          "#f8fbfd",
                        borderRadius:
                          "9px",
                        padding:
                          "11px 12px",
                      }}
                    >
                      <div
                        style={{
                          color:
                            "#8a9aa8",
                          fontSize:
                            "11px",
                          marginBottom:
                            "5px",
                        }}
                      >
                        WORK MODE
                      </div>

                      <div
                        style={{
                          color:
                            "#38566f",
                          fontSize:
                            "13px",
                          fontWeight:
                            600,
                          lineHeight:
                            1.4,
                        }}
                      >
                        {job.work_mode &&
                        job.work_mode
                          .length >
                          0
                          ? job.work_mode.join(
                              ", "
                            )
                          : "Not specified"}
                      </div>
                    </div>

                    <div
                      style={{
                        border:
                          "1px solid #e5edf3",
                        background:
                          "#f8fbfd",
                        borderRadius:
                          "9px",
                        padding:
                          "11px 12px",
                      }}
                    >
                      <div
                        style={{
                          color:
                            "#8a9aa8",
                          fontSize:
                            "11px",
                          marginBottom:
                            "5px",
                        }}
                      >
                        EXPERIENCE
                      </div>

                      <div
                        style={{
                          color:
                            "#38566f",
                          fontSize:
                            "13px",
                          fontWeight:
                            600,
                        }}
                      >
                        {getExperience(
                          job
                        )}
                      </div>
                    </div>

                    <div
                      style={{
                        border:
                          "1px solid #e5edf3",
                        background:
                          "#f8fbfd",
                        borderRadius:
                          "9px",
                        padding:
                          "11px 12px",
                      }}
                    >
                      <div
                        style={{
                          color:
                            "#8a9aa8",
                          fontSize:
                            "11px",
                          marginBottom:
                            "5px",
                        }}
                      >
                        PACKAGE
                      </div>

                      <div
                        style={{
                          color:
                            "#38566f",
                          fontSize:
                            "13px",
                          fontWeight:
                            600,
                        }}
                      >
                        {getPackage(
                          job
                        )}
                      </div>
                    </div>
                  </div>

                  {/* DESCRIPTION */}

                  <p
                    style={{
                      margin:
                        "0 0 18px",
                      color:
                        "#71869a",
                      fontSize:
                        "14px",
                      lineHeight:
                        1.75,
                    }}
                  >
                    {getShortDescription(
                      job.description
                    )}
                  </p>

                  {/* MANDATORY SKILLS */}

                  {job.mandatory_skills &&
                    job.mandatory_skills
                      .length > 0 && (
                      <div>
                        <div
                          style={{
                            color:
                              "#536f85",
                            fontSize:
                              "11px",
                            fontWeight:
                              700,
                            letterSpacing:
                              "0.5px",
                            marginBottom:
                              "8px",
                          }}
                        >
                          SKILLS
                        </div>

                        <div
                          style={{
                            display:
                              "flex",
                            flexWrap:
                              "wrap",
                            gap:
                              "6px",
                          }}
                        >
                          {job.mandatory_skills
                            .slice(
                              0,
                              5
                            )
                            .map(
                              (
                                skill
                              ) => (
                                <span
                                  key={
                                    skill
                                  }
                                  style={{
                                    padding:
                                      "5px 9px",
                                    borderRadius:
                                      "15px",
                                    background:
                                      "#eef5fb",
                                    border:
                                      "1px solid #d8e8f5",
                                    color:
                                      "#3d6c90",
                                    fontSize:
                                      "11px",
                                    fontWeight:
                                      600,
                                  }}
                                >
                                  {
                                    skill
                                  }
                                </span>
                              )
                            )}

                          {job
                            .mandatory_skills
                            .length >
                            5 && (
                            <span
                              style={{
                                padding:
                                  "5px 9px",
                                borderRadius:
                                  "15px",
                                background:
                                  "#f3f5f7",
                                color:
                                  "#7c8b96",
                                fontSize:
                                  "11px",
                                fontWeight:
                                  600,
                              }}
                            >
                              +
                              {job
                                .mandatory_skills
                                .length -
                                5}{" "}
                              more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                </div>

                {/* =================================================
                    CARD FOOTER
                ================================================== */}

                <div
                  style={{
                    borderTop:
                      "1px solid #e7edf2",
                    padding:
                      "17px 20px",
                    display:
                      "flex",
                    alignItems:
                      "center",
                    justifyContent:
                      "space-between",
                    gap:
                      "10px",
                    flexWrap:
                      "wrap",
                    background:
                      "#fcfdfe",
                  }}
                >
                  {/* PUBLISHED DATE */}

                  <div
                    style={{
                      color:
                        "#8a9aa8",
                      fontSize:
                        "11px",
                      lineHeight:
                        1.5,
                    }}
                  >
                    {job.published
                      ? `Published ${formatDateTime(
                          job.publishedAt
                        )}`
                      : "Not published"}
                  </div>

                  {/* ACTIONS */}

                  <div
                    style={{
                      display:
                        "flex",
                      alignItems:
                        "center",
                      gap:
                        "7px",
                    }}
                  >
                    {/* EDIT */}

                    <button
                      type="button"
                      onClick={() => {
                        window.scrollTo({
                          top: 0,
                          left: 0,
                          behavior:
                            "auto",
                        });

                        navigate(
                          `/create-job?edit=${encodeURIComponent(
                            job.slug
                          )}`
                        );
                      }}
                      disabled={
                        actionLoading !==
                        null
                      }
                      style={{
                        border:
                          "1px solid #d8e3ec",
                        borderRadius:
                          "8px",
                        padding:
                          "9px 14px",
                        background:
                          "#ffffff",
                        color:
                          "#3977a9",
                        fontFamily:
                          "'Comfortaa', sans-serif",
                        fontSize:
                          "12px",
                        fontWeight:
                          600,
                        cursor:
                          "pointer",
                      }}
                    >
                      Edit
                    </button>

                    {/* PUBLISH / UNPUBLISH */}

                    <button
                      type="button"
                      onClick={() =>
                        handlePublish(
                          job.slug
                        )
                      }
                      disabled={
                        actionLoading !==
                        null
                      }
                      style={{
                        border:
                          "1px solid #cfe1ee",
                        borderRadius:
                          "8px",
                        padding:
                          "9px 14px",
                        background:
                          job.published
                            ? "#fff8e8"
                            : "#eaf4fd",
                        color:
                          job.published
                            ? "#8a6200"
                            : "#3478b3",
                        fontFamily:
                          "'Comfortaa', sans-serif",
                        fontSize:
                          "12px",
                        fontWeight:
                          600,
                        cursor:
                          "pointer",
                      }}
                    >
                      {actionLoading ===
                      job.slug
                        ? "..."
                        : job.published
                        ? "Unpublish"
                        : "Publish"}
                    </button>

                    {/* DELETE */}

                    <button
                      type="button"
                      onClick={() =>
                        setDeleteId(
                          job._id
                        )
                      }
                      disabled={
                        actionLoading !==
                        null
                      }
                      style={{
                        border:
                          "1px solid #f0d4d4",
                        borderRadius:
                          "8px",
                        padding:
                          "9px 14px",
                        background:
                          "#ffffff",
                        color:
                          "#d04444",
                        fontFamily:
                          "'Comfortaa', sans-serif",
                        fontSize:
                          "12px",
                        fontWeight:
                          600,
                        cursor:
                          "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* =========================================================
            DELETE CONFIRMATION POPUP
        ========================================================= */}

        {deleteId && (
          <div
            role="dialog"
            aria-modal="true"
            onMouseDown={(e) => {
              if (
                e.target ===
                e.currentTarget
              ) {
                if (
                  !actionLoading
                ) {
                  setDeleteId(
                    null
                  );
                }
              }
            }}
            style={{
              position:
                "fixed",
              inset: 0,
              background:
                "rgba(16, 42, 61, 0.48)",
              backdropFilter:
                "blur(3px)",
              display:
                "flex",
              alignItems:
                "center",
              justifyContent:
                "center",
              zIndex: 1000,
              padding:
                "20px",
              boxSizing:
                "border-box",
            }}
          >
            <div
              style={{
                width:
                  "100%",
                maxWidth:
                  "460px",
                background:
                  "#ffffff",
                borderRadius:
                  "16px",
                padding:
                  "30px",
                boxSizing:
                  "border-box",
                boxShadow:
                  "0 25px 70px rgba(15,48,70,.25)",
                fontFamily:
                  "'Comfortaa', sans-serif",
              }}
            >
              {/* ICON */}

              <div
                style={{
                  width:
                    "48px",
                  height:
                    "48px",
                  borderRadius:
                    "50%",
                  background:
                    "#fff1f1",
                  color:
                    "#c62828",
                  display:
                    "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                  fontSize:
                    "22px",
                  fontWeight:
                    700,
                  marginBottom:
                    "17px",
                }}
              >
                !
              </div>

              <h2
                style={{
                  margin:
                    "0 0 9px",
                  color:
                    "#173f63",
                  fontSize:
                    "21px",
                  fontWeight:
                    600,
                }}
              >
                Delete Job?
              </h2>

              {/* JOB NAME */}

              {selectedDeleteJob && (
                <div
                  style={{
                    background:
                      "#f5f9fc",
                    border:
                      "1px solid #dce8f1",
                    borderRadius:
                      "9px",
                    padding:
                      "13px 14px",
                    marginBottom:
                      "15px",
                    color:
                      "#315775",
                    fontSize:
                      "14px",
                    fontWeight:
                      600,
                    lineHeight:
                      1.5,
                  }}
                >
                  {
                    selectedDeleteJob.title
                  }
                </div>
              )}

              <p
                style={{
                  margin:
                    "0 0 25px",
                  color:
                    "#71869a",
                  fontSize:
                    "13px",
                  lineHeight:
                    1.7,
                }}
              >
                Are you sure you want
                to delete this job?
                This action cannot be
                undone.
              </p>

              {/* POPUP BUTTONS */}

              <div
                style={{
                  display:
                    "flex",
                  justifyContent:
                    "flex-end",
                  gap:
                    "10px",
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    setDeleteId(
                      null
                    )
                  }
                  disabled={
                    actionLoading !==
                    null
                  }
                  style={{
                    border:
                      "1px solid #d5e0e8",
                    borderRadius:
                      "8px",
                    padding:
                      "11px 18px",
                    background:
                      "#ffffff",
                    color:
                      "#536f85",
                    fontFamily:
                      "'Comfortaa', sans-serif",
                    fontSize:
                      "13px",
                    fontWeight:
                      600,
                    cursor:
                      "pointer",
                  }}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (
                      deleteId
                    ) {
                      handleDelete(
                        deleteId
                      );
                    }
                  }}
                  disabled={
                    actionLoading !==
                    null
                  }
                  style={{
                    border:
                      "none",
                    borderRadius:
                      "8px",
                    padding:
                      "11px 18px",
                    background:
                      "#c62828",
                    color:
                      "#ffffff",
                    fontFamily:
                      "'Comfortaa', sans-serif",
                    fontSize:
                      "13px",
                    fontWeight:
                      600,
                    cursor:
                      "pointer",
                  }}
                >
                  {actionLoading ===
                  deleteId
                    ? "Deleting..."
                    : "Delete Job"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListEditJob;