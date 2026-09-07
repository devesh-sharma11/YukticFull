import React, { useEffect, useMemo, useState } from "react";
import Footer from "../components/Footer";
import API from "../services/api";
import {
  Link,
  useLocation,
} from "react-router-dom";
import "../styles/jobsPage.css";

const JobsPage = () => {
  const location = useLocation();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [workMode, setWorkMode] = useState("All");

  /* ============================================================
     ALWAYS START FROM TOP
  ============================================================ */

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [location.pathname]);


  /* ============================================================
     JOBS PAGE NAVBAR
     PAGE ONLY
  ============================================================ */

  useEffect(() => {
    document.body.classList.add("jobs-page-active");

    return () => {
      document.body.classList.remove("jobs-page-active");
    };
  }, []);


  /* ============================================================
     FETCH PUBLISHED JOBS
  ============================================================ */

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await API.get("/jobs");

        const data = Array.isArray(res.data)
          ? res.data
          : [];

        const publishedJobs = data.filter(
          (job) => job.published === true
        );

        setJobs(publishedJobs);
      } catch (error) {
        console.error(
          "Error fetching jobs:",
          error
        );

        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);


  /* ============================================================
     WORK MODE FILTERS
  ============================================================ */

  const workModes = useMemo(() => {
    const modes = new Set();

    jobs.forEach((job) => {
      if (Array.isArray(job.work_mode)) {
        job.work_mode.forEach((mode) => {
          modes.add(mode);
        });
      }
    });

    return [
      "All",
      ...Array.from(modes),
    ];
  }, [jobs]);


  /* ============================================================
     FILTER JOBS
  ============================================================ */

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const searchText =
        search.toLowerCase().trim();

      const allSkills = [
        ...(job.mandatory_skills || []),
        ...(job.optional_skills || []),
      ];

      const matchesWorkMode =
        workMode === "All" ||
        (job.work_mode || []).includes(
          workMode
        );

      const matchesSearch =
        !searchText ||
        job.title
          ?.toLowerCase()
          .includes(searchText) ||
        job.location
          ?.toLowerCase()
          .includes(searchText) ||
        job.job_type
          ?.toLowerCase()
          .includes(searchText) ||
        (job.work_mode || []).some(
          (mode) =>
            mode
              .toLowerCase()
              .includes(searchText)
        ) ||
        allSkills.some(
          (skill) =>
            skill
              .toLowerCase()
              .includes(searchText)
        );

      return (
        matchesWorkMode &&
        matchesSearch
      );
    });
  }, [
    jobs,
    search,
    workMode,
  ]);


  /* ============================================================
     EXPERIENCE FORMAT
  ============================================================ */

  const formatExperience = (job) => {
    const min = job.min_experience;
    const max = job.max_experience;

    if (
      min !== null &&
      min !== undefined &&
      max !== null &&
      max !== undefined
    ) {
      return `${min}–${max} years`;
    }

    if (
      min !== null &&
      min !== undefined
    ) {
      return `${min}+ years`;
    }

    if (
      max !== null &&
      max !== undefined
    ) {
      return `Up to ${max} years`;
    }

    return "Not specified";
  };


  /* ============================================================
     WORK MODE FORMAT
  ============================================================ */

  const formatWorkMode = (job) => {
    if (
      !job.work_mode ||
      job.work_mode.length === 0
    ) {
      return "Not specified";
    }

    return job.work_mode.join(" / ");
  };


  /* ============================================================
     JOB TYPE FORMAT
  ============================================================ */

  const formatJobType = (job) => {
    if (!job.job_type) {
      return "Not specified";
    }

    return job.job_type;
  };


  /* ============================================================
     SKILLS
  ============================================================ */

  const getSkills = (job) => {
    return [
      ...(job.mandatory_skills || []),
      ...(job.optional_skills || []),
    ];
  };


  return (
    <main className="jobs-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="jobs-hero jobs-animate-section">

        <div className="jobs-container">

          {/* HERO TOP */}

          <div className="jobs-hero-top jobs-animate-item">

            <div className="jobs-hero-eyebrow">

              <span className="jobs-eyebrow-line"></span>

              <span>
                CAREERS AT YUKTIC
              </span>

            </div>


            <div className="jobs-hero-count">

              <span className="jobs-count-dot"></span>

              <span>
                {jobs.length} open{" "}
                {jobs.length === 1
                  ? "position"
                  : "positions"}
              </span>

            </div>

          </div>


          {/* HERO CONTENT */}

          <div className="jobs-hero-content">

            {/* HERO TEXT */}

            <div className="jobs-hero-copy jobs-animate-text">

             
              <h1>
                Build work
                <br />

                <span>
                  that matters.
                </span>
              </h1>


              <p>
                Join a team solving meaningful
                problems through thoughtful
                technology, strong collaboration
                and work that makes a real
                difference.
              </p>


              <div className="jobs-hero-actions">

                <a
                  href="#open-positions"
                  className="jobs-primary-btn"
                >
                  <span>
                    Explore open roles
                  </span>

                  <span className="jobs-btn-arrow">
                    ↗
                  </span>
                </a>


                <span className="jobs-hero-note">
                  Find a role that fits your
                  skills, experience and
                  ambitions.
                </span>

              </div>

            </div>


            {/* HERO VISUAL */}

            <div className="jobs-hero-panel jobs-animate-visual">

              <div className="jobs-panel-card">

                <div className="jobs-panel-header">

                  <span>
                    YUKTIC
                  </span>

                  <span>
                    CAREERS / 2026
                  </span>

                </div>


                <div className="jobs-panel-content">

                  <div className="jobs-panel-number">
                    01
                  </div>

                  <h2>
                    People
                    <br />

                    <span>
                      first.
                    </span>
                  </h2>

                  <p>
                    Good ideas become great
                    products when talented
                    people work together.
                  </p>

                </div>


                <div className="jobs-panel-footer">

                  <span>
                    PEOPLE
                  </span>

                  <span>
                    PRODUCT
                  </span>

                  <span>
                    IMPACT
                  </span>

                </div>

              </div>


              <div className="jobs-panel-orb jobs-panel-orb-one"></div>

              <div className="jobs-panel-orb jobs-panel-orb-two"></div>

            </div>

          </div>


          {/* HERO BOTTOM */}

          <div className="jobs-hero-bottom jobs-animate-item">

            <span>
              01
            </span>

            <span className="jobs-bottom-line"></span>

            <span>
              PEOPLE
            </span>

            <span>
              CRAFT
            </span>

            <span>
              GROWTH
            </span>

            <span>
              IMPACT
            </span>

          </div>

        </div>

      </section>


      {/* =====================================================
          INTRO
      ===================================================== */}

      <section className="jobs-intro jobs-reveal-section">

        <div className="jobs-container">

          <div className="jobs-intro-grid">

            <div className="jobs-intro-heading">

              <span className="section-kicker">
                WHY YUKTIC
              </span>

              <h2>
                Come for the
                <br />

                <span>
                  challenge.
                </span>

                <br />

                Stay for the
                <br />

                <span>
                  people.
                </span>
              </h2>

            </div>


            <div className="jobs-intro-copy">

              <p className="jobs-intro-lead">
                At Yuktic, different disciplines
                work closely together. Engineers
                talk to designers. Product teams
                talk to customers. Ideas move
                quickly because the people building
                them are close to the problem.
              </p>


              <p>
                We care about ambitious work,
                thoughtful technology and creating
                an environment where people can
                do their best work.
              </p>


              <div className="jobs-values">

                <div className="jobs-value">

                  <span>
                    01
                  </span>

                  <strong>
                    Curiosity
                  </strong>

                  <p>
                    Stay curious. Keep asking
                    better questions.
                  </p>

                </div>


                <div className="jobs-value">

                  <span>
                    02
                  </span>

                  <strong>
                    Ownership
                  </strong>

                  <p>
                    Take responsibility and
                    make things happen.
                  </p>

                </div>


                <div className="jobs-value">

                  <span>
                    03
                  </span>

                  <strong>
                    Craft
                  </strong>

                  <p>
                    Care deeply about the
                    quality of your work.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          OPEN POSITIONS
      ===================================================== */}

      <section
        className="jobs-positions jobs-reveal-section"
        id="open-positions"
      >

        <div className="jobs-container">

          <div className="jobs-section-heading">

            <div>

              <span className="section-kicker">
                OPEN POSITIONS
              </span>

              <h2>
                Find your
                <br />

                <span>
                  next role.
                </span>
              </h2>

            </div>


            <p>
              Explore our current opportunities
              and find where your experience can
              make an impact.
            </p>

          </div>


          {/* SEARCH + FILTERS */}

          <div className="jobs-controls">

            <div className="jobs-search">

              <span className="jobs-search-icon">
                ⌕
              </span>

              <input
                type="text"
                placeholder="Search roles, skills or locations"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

              <span className="jobs-results">

                {loading
                  ? "LOADING"
                  : `${filteredJobs.length} RESULTS`}

              </span>

            </div>


            <div className="jobs-filters">

              {workModes.map((item) => (

                <button
                  key={item}
                  type="button"
                  className={
                    workMode === item
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setWorkMode(item)
                  }
                >
                  {item}
                </button>

              ))}

            </div>

          </div>


          {/* JOB LIST */}

          <div className="jobs-list">

            {loading ? (

              <div className="jobs-empty">

                <div className="jobs-loading-dot"></div>

                <h3>
                  Loading roles
                </h3>

                <p>
                  Fetching currently
                  published positions.
                </p>

              </div>

            ) : filteredJobs.length > 0 ? (

              filteredJobs.map(
                (job, index) => {

                  const skills =
                    getSkills(job);

                  return (

                    /*
                     * IMPORTANT:
                     * ENTIRE JOB CARD IS CLICKABLE
                     */

                    <Link
                      to={`/jobs/${job.slug}`}
                      className="job-item"
                      key={
                        job._id ||
                        job.slug
                      }
                      aria-label={
                        `View ${job.title}`
                      }
                    >

                      {/* NUMBER */}

                      <div className="job-number">

                        {String(
                          index + 1
                        ).padStart(2, "0")}

                      </div>


                      {/* MAIN */}

                      <div className="job-main">

                        <div className="job-topline">

                          <span className="job-status-dot"></span>

                          <span>
                            {formatWorkMode(job)}
                          </span>

                        </div>


                        <h3>
                          {job.title}
                        </h3>


                        <p className="job-description">
                          {job.description}
                        </p>


                        <div className="job-tags">

                          {skills
                            .slice(0, 6)
                            .map(
                              (
                                tag,
                                tagIndex
                              ) => (

                                <span
                                  key={
                                    `${tag}-${tagIndex}`
                                  }
                                >
                                  {tag}
                                </span>

                              )
                            )}

                        </div>

                      </div>


                      {/* META */}

                      <div className="job-meta">

                        <div className="job-meta-item">

                          <span>
                            LOCATION
                          </span>

                          <strong>
                            {job.location ||
                              "Not specified"}
                          </strong>

                        </div>


                        <div className="job-meta-item">

                          <span>
                            EXPERIENCE
                          </span>

                          <strong>
                            {formatExperience(
                              job
                            )}
                          </strong>

                        </div>


                        <div className="job-meta-item">

                          <span>
                            TYPE
                          </span>

                          <strong>
                            {formatJobType(
                              job
                            )}
                          </strong>

                        </div>

                      </div>


                      {/* ARROW */}

                      <span
                        className="job-arrow"
                        aria-hidden="true"
                      >
                        <span>
                          ↗
                        </span>
                      </span>

                    </Link>

                  );
                }
              )

            ) : (

              <div className="jobs-empty">

                <div className="jobs-empty-code">
                  404
                </div>

                <h3>
                  No roles found
                </h3>

                <p>
                  Try another search or
                  work mode.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setWorkMode("All");
                  }}
                >
                  Reset filters
                </button>

              </div>

            )}

          </div>

        </div>

      </section>


      {/* =====================================================
          CULTURE
      ===================================================== */}

      <section className="jobs-culture jobs-reveal-section">

        <div className="jobs-container">

          <div className="culture-layout">

            <div className="culture-statement">

              <span className="section-kicker">
                HOW WE WORK
              </span>

              <h2>
                Smart people.
                <br />

                <span>
                  Real ownership.
                </span>
              </h2>

              <p>
                We don't believe great work
                comes from unnecessary layers.
                We give people context,
                responsibility and room to
                figure things out.
              </p>

            </div>


            <div className="culture-list">

              <div className="culture-item">

                <span>
                  01
                </span>

                <div>

                  <h3>
                    Work with freedom
                  </h3>

                  <p>
                    Bring your own perspective.
                    We care about outcomes more
                    than rigid processes.
                  </p>

                </div>

              </div>


              <div className="culture-item">

                <span>
                  02
                </span>

                <div>

                  <h3>
                    Learn constantly
                  </h3>

                  <p>
                    Technology changes quickly.
                    We expect curiosity and create
                    space to keep learning.
                  </p>

                </div>

              </div>


              <div className="culture-item">

                <span>
                  03
                </span>

                <div>

                  <h3>
                    Build together
                  </h3>

                  <p>
                    The best ideas rarely belong
                    to one person. We challenge,
                    collaborate and improve
                    together.
                  </p>

                </div>

              </div>


              <div className="culture-item">

                <span>
                  04
                </span>

                <div>

                  <h3>
                    Make an impact
                  </h3>

                  <p>
                    We build things that solve
                    real problems, not technology
                    for technology's sake.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="jobs-cta jobs-reveal-section">

       

        <div className="jobs-cta-inner">

          <span className="section-kicker">
            DON'T SEE THE RIGHT ROLE?
          </span>

          <h2>
            We still want
            <br />

            <span>
              to hear from you.
            </span>
          </h2>

          <p>
            If you think you could bring
            something valuable to Yuktic,
            send us your story. The right
            opportunity might not have a
            title yet.
          </p>


         


           

        

        </div>

      </section>


      <Footer />

    </main>
  );
};

export default JobsPage;