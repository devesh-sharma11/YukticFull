import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import "../styles/projectPage.css";
import Footer from "../components/Footer";

/*
 * =========================================================
 * ASSETS
 * =========================================================
 */

import Yuktic from "../assets/Yuktic.png";

import CandiQHome from "../assets/candiQhomepage.png";
import CandiQCreateCandidatepage from "../assets/candiQcreateCandidatepage.png";
import CandiQCreateJobs from "../assets/candiQcreateJobs.png";
import CandiQpipelineManage from "../assets/candiQpipelinemanage.png";


const ProjectPage = () => {
  const pageRef = useRef(null);

  const API = import.meta.env.VITE_API_URL;

  const [selectedImage, setSelectedImage] = useState(null);

  const [featuredTestimonial, setFeaturedTestimonial] =
    useState(null);


  /*
   * =========================================================
   * ALWAYS START PROJECT PAGE FROM TOP
   * =========================================================
   */

useLayoutEffect(() => {
  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }

  document.body.classList.add("project-page-active");

  const hash = window.location.hash;

  const scrollToTarget = () => {
    if (hash) {
      const target = document.querySelector(hash);

      if (target) {
        target.scrollIntoView({
          behavior: "auto",
          block: "start",
        });

        return;
      }
    }

    // No hash = normal project page opening.
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  // First attempt.
  scrollToTarget();

  // Second attempt after browser layout/navigation finishes.
  const frame1 = requestAnimationFrame(() => {
    scrollToTarget();
  });

  const frame2 = requestAnimationFrame(() => {
    scrollToTarget();
  });

  return () => {
    cancelAnimationFrame(frame1);
    cancelAnimationFrame(frame2);

    document.body.classList.remove("project-page-active");

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "auto";
    }
  };
}, []);


  /*
   * =========================================================
   * FEATURED TESTIMONIAL
   * =========================================================
   */

  useEffect(() => {
    const fetchFeaturedTestimonial = async () => {
      try {
        const response = await fetch(
          `${API}/testimonials/featured`
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch featured testimonial: ${response.status}`
          );
        }

        const data = await response.json();

        setFeaturedTestimonial(data);
      } catch (error) {
        console.error(
          "Error fetching featured testimonial:",
          error
        );

        setFeaturedTestimonial(null);
      }
    };

    if (API) {
      fetchFeaturedTestimonial();
    }
  }, [API]);


  /*
   * =========================================================
   * IMAGE MODAL SCROLL LOCK
   * =========================================================
   */

  useEffect(() => {
    if (!selectedImage) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedImage(null);
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow = "";

      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [selectedImage]);


  /*
   * =========================================================
   * SCROLL REVEAL
   * =========================================================
   */

  useEffect(() => {
    const page = pageRef.current;

    if (!page) return;

    const revealElements = page.querySelectorAll(
      [
        ".project-hero-content",
        ".project-hero-visual",

        ".projects-intro",

        ".project-card",

        ".project-section-heading",
        ".project-feature",

        ".project-screenshot-heading",
        ".project-screenshot-card",

        ".project-workflow-heading",
        ".workflow-item",

        ".yudi-flow-heading",
        ".yudi-flow-card",

        ".project-tech-heading",
        ".project-tech-card",

        ".featured-testimonial-section",
        ".featured-testimonial-header",
        ".featured-testimonial-card",

        ".projects-closing-content",
      ].join(",")
    );

    revealElements.forEach((element) => {
      element.classList.add("project-reveal");
    });


    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(
              "project-reveal-visible"
            );

            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.10,
        rootMargin: "0px 0px -60px 0px",
      }
    );


    revealElements.forEach((element) => {
      observer.observe(element);
    });


    /*
     * Feature stagger
     */

    page
      .querySelectorAll(".project-feature")
      .forEach((item, index) => {
        item.style.setProperty(
          "--project-delay",
          `${index * 0.06}s`
        );
      });


    /*
     * Screenshot stagger
     */

    page
      .querySelectorAll(".project-screenshot-card")
      .forEach((item, index) => {
        item.style.setProperty(
          "--project-delay",
          `${index * 0.08}s`
        );
      });


    /*
     * Workflow stagger
     */

    page
      .querySelectorAll(".workflow-item")
      .forEach((item, index) => {
        item.style.setProperty(
          "--project-delay",
          `${index * 0.06}s`
        );
      });


    /*
     * YuDiHealth flow stagger
     */

    page
      .querySelectorAll(".yudi-flow-card")
      .forEach((item, index) => {
        item.style.setProperty(
          "--project-delay",
          `${index * 0.08}s`
        );
      });


    return () => {
      observer.disconnect();
    };
  }, []);


  /*
   * =========================================================
   * OPEN IMAGE
   * =========================================================
   */

  const openImage = (image, title) => {
    setSelectedImage({
      image,
      title,
    });
  };


  /*
   * =========================================================
   * CANDIQ SCREENSHOTS
   * =========================================================
   */

  const candiQScreenshots = [
    {
      image: CandiQHome,
      title: "CandiQ Homepage",
      description:
        "A centralized recruitment workspace for managing the hiring journey.",
    },

    {
      image: CandiQCreateCandidatepage,
      title: "Create Candidate",
      description:
        "Create and manage candidate profiles and recruitment information.",
    },

    {
      image: CandiQCreateJobs,
      title: "Create Jobs",
      description:
        "Create job openings, define requirements and prepare positions for publishing.",
    },

    {
      image: CandiQpipelineManage,
      title: "Interview Pipeline",
      description:
        "Track candidates through the recruitment journey from shortlist to offer.",
    },
  ];


  /*
   * =========================================================
   * CANDIQ FEATURES
   * =========================================================
   */

  const candiQFeatures = [
    {
      number: "01",
      title: "Organization Management",
      text:
        "Create and manage organizations with structured recruitment environments for different teams and members.",
      type: "green",
    },

    {
      number: "02",
      title: "Recruiter Management",
      text:
        "Organization administrators can add recruiters and manage recruitment access across the organization.",
      type: "blue",
    },

    {
      number: "03",
      title: "Roles & Settings",
      text:
        "Support Admin, HR Manager and organization members with default settings designed for the complete organization.",
      type: "orange",
    },

    {
      number: "04",
      title: "Candidate Management",
      text:
        "Create, organize and manage candidate profiles while keeping recruitment information accessible in one place.",
      type: "green",
    },

    {
      number: "05",
      title: "Job Management",
      text:
        "Create jobs, configure requirements, publish openings and generate application links for open applications.",
      type: "blue",
    },

    {
      number: "06",
      title: "Interview Pipeline",
      text:
        "Schedule candidates and track the hiring journey from shortlist through interviews and offer stages.",
      type: "orange",
    },

    {
      number: "07",
      title: "Documents & ATS",
      text:
        "Manage candidate documents and use ATS capabilities to organize and evaluate recruitment information.",
      type: "green",
    },

    {
      number: "08",
      title: "AI Matching & More",
      text:
        "Use AI-powered job and candidate matching to support recruiters with smarter decisions, alongside many other recruitment capabilities.",
      type: "blue",
    },
  ];


  /*
   * =========================================================
   * YUDIHEALTH FEATURES
   * =========================================================
   */

  const yudiHealthFeatures = [
    {
      number: "01",
      title: "Manager Scheduling",
      text:
        "Managers can organize and manage doctor schedules on a daily basis.",
      type: "green",
    },

    {
      number: "02",
      title: "Doctor Workflow",
      text:
        "Doctors can work through schedules, appointments and patient-related healthcare flows.",
      type: "blue",
    },

    {
      number: "03",
      title: "Patient Connection",
      text:
        "Connect patients with healthcare providers through a structured digital healthcare experience.",
      type: "orange",
    },

    {
      number: "04",
      title: "Appointment Booking",
      text:
        "Patients can follow doctor availability and book appointments through the platform.",
      type: "green",
    },

    {
      number: "05",
      title: "Healthcare Case Flow",
      text:
        "Support healthcare workflows around patient interactions, appointments and ongoing cases.",
      type: "blue",
    },

    {
      number: "06",
      title: "AI Assistance",
      text:
        "AI assistance can support parts of the healthcare workflow, including prescription suggestions and other intelligent capabilities.",
      type: "orange",
    },
  ];


  return (
    <main
      ref={pageRef}
      className="project-page"
    >


      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="project-hero">

        <div className="project-orb project-orb-green"></div>

        <div className="project-orb project-orb-blue"></div>

        <div className="project-orb project-orb-orange"></div>


        {/* =================================================
            LEFT — PRODUCT VISUAL
        ================================================= */}

        <div className="project-hero-visual">

          <div className="project-visual-card">

            {/* TOP */}

            <div className="project-visual-top">

              <div className="project-visual-brand">

                <span className="project-visual-dot"></span>

                {/* IMPORTANT:
                    This is TEXT, not another Yuktic image.
                */}

                <span className="project-visual-brand-text">
                  Yuktic
                </span>

              </div>


              <span className="project-visual-label">
                PRODUCTS
              </span>

            </div>


            {/* CENTER — ONLY ONE YUKTIC IMAGE */}

            <div className="project-visual-center">

              <div className="project-visual-logo-wrap">

                <img
                  src={Yuktic}
                  alt="Yuktic"
                  className="project-hero-yuktic-logo"
                />

              </div>


              <div className="project-visual-lines">

                <span></span>

                <span></span>

                <span></span>

              </div>

            </div>


            {/* BOTTOM */}

            <div className="project-visual-bottom">

              <strong>
                CandiQ
              </strong>

              <strong>
                YuDiHealth
              </strong>

            </div>

          </div>


          {/* FLOATING BADGES */}

          <div className="project-floating-badge project-badge-green">
            Recruitment
          </div>

          <div className="project-floating-badge project-badge-blue">
            Healthcare
          </div>

          <div className="project-floating-badge project-badge-orange">
            AI Powered
          </div>

        </div>


        {/* =================================================
            RIGHT — HERO CONTENT
        ================================================= */}

        <div className="project-hero-content">

          <span className="project-eyebrow">
            OUR PROJECTS
          </span>


          <h1>
            Products built
            <br />
            <span>
              for real impact.
            </span>
          </h1>


          <p>
            At Yuktic, we build digital products that solve
            real business and user challenges. From recruitment
            and healthcare to intelligent workflows and
            AI-powered experiences, our products are designed
            to simplify complexity and create meaningful value.
          </p>


          <div className="project-hero-buttons">

            <a
              href="#projects"
              className="project-primary-btn"
            >
              Explore Projects
              <span>↓</span>
            </a>


            <a
              href="/contact"
              className="project-secondary-btn"
            >
              Start a Conversation
            </a>

          </div>

        </div>

      </section>


      {/* =====================================================
          INTRO
      ===================================================== */}

      <section
        className="projects-intro-section"
        id="projects"
      >

        <div className="projects-intro">

          <div className="projects-intro-heading">

            <span className="project-eyebrow">
              SELECTED PROJECTS
            </span>

            <h2>
              Built around
              <br />
              <span>
                real problems.
              </span>
            </h2>

          </div>


          <div className="projects-intro-text">

            <p>
              Our products are built around real workflows,
              real users and real operational challenges.
              CandiQ and YuDiHealth are two examples of the
              platforms we have developed, with each product
              continuing to evolve with new capabilities and
              possibilities.
            </p>


            <div className="projects-intro-meta">

              <span>
                02 FEATURED PRODUCTS
              </span>

              <span>
                AND MORE IN DEVELOPMENT
              </span>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          CANDIQ
      ===================================================== */}

      <section
        className="project-detail-section project-detail-candiq"
        id="candiq"
      >

        <div className="project-detail-container">


          {/* PROJECT CARD */}

          <div className="project-card project-card-candiq">

            <div className="project-card-background"></div>


            <div className="project-card-top">

              <div className="project-card-number">
                01
              </div>

              <span className="project-card-category">
                RECRUITMENT TECHNOLOGY
              </span>

              <div className="project-card-status">
                PRODUCT
              </div>

            </div>


            <div className="project-card-content">

              <div className="project-card-title">

                <h2>
                  CandiQ
                </h2>

                <p>
                  Intelligent Recruitment &
                  <br />
                  Talent Management Platform
                </p>

              </div>


              <div className="project-card-description">

                <p>
                  CandiQ is a recruitment platform designed
                  to bring the hiring lifecycle into one
                  connected environment. It supports
                  organization management, recruiters,
                  candidates, jobs, interviews, applications,
                  documents, ATS workflows, AI-powered
                  matching and much more.
                </p>

              </div>

            </div>


            <div className="project-card-footer">

              <span>
                ORGANIZE
              </span>

              <span>
                HIRE
              </span>

              <span>
                TRACK
              </span>

              <span>
                MATCH
              </span>

            </div>

          </div>


          {/* CANDIQ FEATURES */}

          <div className="project-features-section">

            <div className="project-section-heading">

              <div>

                <span className="project-eyebrow">
                  CANDIQ CAPABILITIES
                </span>

                <h3>
                  A complete
                  <br />
                  <span>
                    recruitment ecosystem.
                  </span>
                </h3>

              </div>


              <p>
                CandiQ connects the different parts of
                the recruitment process into one product,
                helping organizations manage hiring from
                setup through candidate evaluation and offer.
              </p>

            </div>


            <div className="project-features-grid">

              {candiQFeatures.map((feature) => (

                <article
                  className={`project-feature project-feature-${feature.type}`}
                  key={feature.number}
                >

                  <div className="project-feature-top">

                    <span className="project-feature-number">
                      {feature.number}
                    </span>

                    <span className="project-feature-arrow">
                      ↗
                    </span>

                  </div>


                  <h4>
                    {feature.title}
                  </h4>


                  <p>
                    {feature.text}
                  </p>

                </article>

              ))}

            </div>

          </div>


          {/* CANDIQ SCREENSHOTS */}

          <div className="project-screenshots-section">

            <div className="project-screenshot-heading">

              <div>

                <span className="project-eyebrow">
                  PRODUCT PREVIEW
                </span>

                <h3>
                  A look inside
                  <br />
                  <span>
                    CandiQ.
                  </span>
                </h3>

              </div>


              <p>
                Explore a few screens from the CandiQ
                platform. Click any image to open it in
                full size.
              </p>

            </div>


            <div className="project-screenshot-grid">

              {candiQScreenshots.map(
                (item, index) => (

                  <button
                    type="button"
                    className="project-screenshot-card"
                    key={item.title}
                    onClick={() =>
                      openImage(
                        item.image,
                        item.title
                      )
                    }
                  >

                    <div className="project-screenshot-image-wrap">

                      <img
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                      />


                      <div className="project-screenshot-overlay">

                        <span>
                          VIEW FULL SIZE
                        </span>

                        <strong>
                          ↗
                        </strong>

                      </div>

                    </div>


                    <div className="project-screenshot-info">

                      <div>

                        <span>
                          0{index + 1}
                        </span>

                        <h4>
                          {item.title}
                        </h4>

                      </div>


                      <p>
                        {item.description}
                      </p>

                    </div>

                  </button>

                )
              )}

            </div>

          </div>


          {/* CANDIQ WORKFLOW */}

          <div className="project-workflow-section">

            <div className="project-workflow-heading">

              <span className="project-eyebrow">
                RECRUITMENT WORKFLOW
              </span>

              <h3>
                From setup
                <br />
                <span>
                  to successful hire.
                </span>
              </h3>

            </div>


            <div className="project-workflow">

              <div className="workflow-item">
                <span>01</span>

                <strong>
                  Organization
                </strong>

                <p>
                  Create and configure the organization.
                </p>
              </div>


              <div className="workflow-item">
                <span>02</span>

                <strong>
                  Recruiters
                </strong>

                <p>
                  Add recruiters and manage organization access.
                </p>
              </div>


              <div className="workflow-item">
                <span>03</span>

                <strong>
                  Candidates
                </strong>

                <p>
                  Add and manage candidate profiles.
                </p>
              </div>


              <div className="workflow-item">
                <span>04</span>

                <strong>
                  Jobs
                </strong>

                <p>
                  Create, manage and publish job opportunities.
                </p>
              </div>


              <div className="workflow-item">
                <span>05</span>

                <strong>
                  Applications
                </strong>

                <p>
                  Generate links for candidates to apply to jobs.
                </p>
              </div>


              <div className="workflow-item">
                <span>06</span>

                <strong>
                  Interviews
                </strong>

                <p>
                  Schedule and manage candidate interviews.
                </p>
              </div>


              <div className="workflow-item">
                <span>07</span>

                <strong>
                  Pipeline
                </strong>

                <p>
                  Track candidates from shortlist through offer.
                </p>
              </div>


              <div className="workflow-item">
                <span>08</span>

                <strong>
                  AI & ATS
                </strong>

                <p>
                  Support recruitment decisions with ATS
                  and AI matching.
                </p>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          YUDIHEALTH
      ===================================================== */}

      <section
        className="project-detail-section project-detail-yudi"
        id="yudi"
      >

        <div className="project-detail-container">


          {/* PROJECT CARD */}

          <div className="project-card project-card-yudi">

            <div className="project-card-background"></div>


            <div className="project-card-top">

              <div className="project-card-number">
                02
              </div>

              <span className="project-card-category">
                HEALTHCARE TECHNOLOGY
              </span>

              <div className="project-card-status">
                PRODUCT
              </div>

            </div>


            <div className="project-card-content">

              <div className="project-card-title">

                <h2>
                  YuDiHealth
                </h2>

                <p>
                  Connected Healthcare &
                  <br />
                  Intelligent Care Workflow
                </p>

              </div>


              <div className="project-card-description">

                <p>
                  YuDiHealth is a healthcare workflow platform
                  connecting managers, doctors and patients
                  through scheduling, appointments and
                  healthcare case flows. The platform also
                  brings AI assistance into the healthcare
                  workflow, including prescription suggestions
                  and other intelligent capabilities.
                </p>

              </div>

            </div>


            <div className="project-card-footer">

              <span>
                MANAGE
              </span>

              <span>
                SCHEDULE
              </span>

              <span>
                CONNECT
              </span>

              <span>
                ASSIST
              </span>

            </div>

          </div>


          {/* YUDI FEATURES */}

          <div className="project-features-section">

            <div className="project-section-heading">

              <div>

                <span className="project-eyebrow">
                  YUDIHEALTH CAPABILITIES
                </span>

                <h3>
                  Connected care.
                  <br />
                  <span>
                    Intelligent workflows.
                  </span>
                </h3>

              </div>


              <p>
                YuDiHealth brings managers, doctors and
                patients together through connected
                healthcare workflows, while using
                intelligent technology to support the
                overall experience.
              </p>

            </div>


            <div className="project-features-grid">

              {yudiHealthFeatures.map(
                (feature) => (

                  <article
                    className={`project-feature project-feature-${feature.type}`}
                    key={feature.number}
                  >

                    <div className="project-feature-top">

                      <span className="project-feature-number">
                        {feature.number}
                      </span>

                      <span className="project-feature-arrow">
                        ↗
                      </span>

                    </div>


                    <h4>
                      {feature.title}
                    </h4>


                    <p>
                      {feature.text}
                    </p>

                  </article>

                )
              )}

            </div>

          </div>


          {/* YUDI FLOW */}

          <div className="yudi-flow-section">

            <div className="yudi-flow-heading">

              <span className="project-eyebrow">
                HEALTHCARE WORKFLOW
              </span>

              <h3>
                One connected
                <br />
                <span>
                  healthcare journey.
                </span>
              </h3>


              <p>
                YuDiHealth brings different participants
                and healthcare activities into a connected
                workflow, helping organize the journey from
                scheduling and appointments to patient care
                and intelligent assistance.
              </p>

            </div>


            <div className="yudi-flow">

              <div className="yudi-flow-card yudi-flow-manager">

                <span className="yudi-flow-number">
                  01
                </span>

                <div className="yudi-flow-icon">
                  M
                </div>

                <h4>
                  Manager
                </h4>

                <p>
                  Manage daily doctor schedules and
                  healthcare operations.
                </p>

              </div>


              <div className="yudi-flow-connector">
                →
              </div>


              <div className="yudi-flow-card yudi-flow-doctor">

                <span className="yudi-flow-number">
                  02
                </span>

                <div className="yudi-flow-icon">
                  D
                </div>

                <h4>
                  Doctor
                </h4>

                <p>
                  Work through schedules, appointments
                  and patient healthcare cases.
                </p>

              </div>


              <div className="yudi-flow-connector">
                →
              </div>


              <div className="yudi-flow-card yudi-flow-patient">

                <span className="yudi-flow-number">
                  03
                </span>

                <div className="yudi-flow-icon">
                  P
                </div>

                <h4>
                  Patient
                </h4>

                <p>
                  Connect with doctors and book appointments
                  according to availability.
                </p>

              </div>


              <div className="yudi-flow-connector">
                →
              </div>


              <div className="yudi-flow-card yudi-flow-ai">

                <span className="yudi-flow-number">
                  04
                </span>

                <div className="yudi-flow-icon">
                  AI
                </div>

                <h4>
                  AI Assistance
                </h4>

                <p>
                  Support parts of the healthcare workflow
                  with intelligent suggestions.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          PRODUCT APPROACH
      ===================================================== */}

      <section className="project-technology-section">

        <div className="project-technology-container">

          <div className="project-tech-heading">

            <span className="project-eyebrow">
              BEYOND THESE PRODUCTS
            </span>


            <h2>
              More than
              <br />
              <span>
                what you see here.
              </span>
            </h2>


            <p>
              CandiQ and YuDiHealth are only a part of
              what we build. Our product development
              approach focuses on understanding the
              problem first, designing the right workflow
              and then using technology, automation and
              AI to create practical solutions.
            </p>

          </div>


          <div className="project-tech-grid">

            <article className="project-tech-card">

              <span className="project-tech-number">
                01
              </span>

              <h3>
                Real Workflows
              </h3>

              <p>
                We design products around how people
                actually work, keeping the experience
                practical and easy to understand.
              </p>

            </article>


            <article className="project-tech-card project-tech-card-blue">

              <span className="project-tech-number">
                02
              </span>

              <h3>
                Connected Systems
              </h3>

              <p>
                Different users, processes and information
                can work together inside a single connected
                product.
              </p>

            </article>


            <article className="project-tech-card">

              <span className="project-tech-number">
                03
              </span>

              <h3>
                Intelligent Technology
              </h3>

              <p>
                We use automation and AI where they can
                reduce complexity, support decisions and
                create better digital experiences.
              </p>

            </article>

          </div>

        </div>

      </section>


      {/* =====================================================
          FEATURED TESTIMONIAL
      ===================================================== */}

      {featuredTestimonial && (

        <section
          className="featured-testimonial-section"
          id="featured-testimonial"
        >

          <div className="featured-testimonial-container">


            {/* HEADING */}

            <div className="featured-testimonial-header">

              <div>

                <span className="project-eyebrow">
                  CLIENT FEEDBACK
                </span>

                <h2>
                  Trusted by
                  <br />
                  <span>
                    our clients.
                  </span>
                </h2>

              </div>


              <p>
                Real experiences from the people and
                businesses we work with.
              </p>

            </div>


            {/* TESTIMONIAL CARD */}

            <div className="featured-testimonial-card">


              {/* LEFT */}

              <div className="featured-testimonial-left">

                <div className="featured-testimonial-quote-mark">
                  “
                </div>


                <blockquote>
                  {featuredTestimonial.testimonial}
                </blockquote>

              </div>


              {/* RIGHT */}

              <div className="featured-testimonial-right">

                <span className="featured-testimonial-client-label">
                  FEATURED CLIENT
                </span>


                {/* RATING */}

                <div className="featured-testimonial-stars">

                  {Array.from(
                    {
                      length: 5,
                    },
                    (_, index) => (

                      <span
                        key={index}
                        className={
                          index <
                          Number(
                            featuredTestimonial.rating || 0
                          )
                            ? "active"
                            : ""
                        }
                      >
                        ★
                      </span>

                    )
                  )}

                </div>


                {/* CLIENT */}

                <div className="featured-testimonial-client">

                  <div className="featured-testimonial-avatar">

                    {featuredTestimonial.avatar ? (

                      featuredTestimonial.avatar.startsWith(
                        "http"
                      ) ? (

                        <img
                          src={
                            featuredTestimonial.avatar
                          }
                          alt={
                            featuredTestimonial.name
                          }
                        />

                      ) : (

                        <span>
                          {
                            featuredTestimonial.avatar
                          }
                        </span>

                      )

                    ) : (

                      <span>
                        {
                          featuredTestimonial.name
                            ?.charAt(0)
                            ?.toUpperCase()
                        }
                      </span>

                    )}

                  </div>


                  <div className="featured-testimonial-client-info">

                    <h3>
                      {featuredTestimonial.name}
                    </h3>


                    {featuredTestimonial.designation && (
                      <p>
                        {
                          featuredTestimonial.designation
                        }
                      </p>
                    )}

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

      )}


      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="projects-closing">

        <div className="projects-closing-shape projects-closing-shape-one"></div>

        <div className="projects-closing-shape projects-closing-shape-two"></div>


        <div className="projects-closing-content">

          <span className="project-eyebrow">
            HAVE AN IDEA?
          </span>


          <h2>
            Your next product
            <br />
            <span>
              could start here.
            </span>
          </h2>


          <p>
            Let's turn your idea, workflow or business
            challenge into a practical digital product.
          </p>


          <a
            href="/contact"
            className="project-cta-button"
          >
            Start a Conversation
            <span>
              ↗
            </span>
          </a>

        </div>

      </section>


      {/* =====================================================
          IMAGE FULLSCREEN MODAL
      ===================================================== */}

      {selectedImage && (

        <div
          className="project-image-modal"
          role="dialog"
          aria-modal="true"
          onMouseDown={(event) => {

            if (
              event.target ===
              event.currentTarget
            ) {
              setSelectedImage(null);
            }

          }}
        >

          <button
            type="button"
            className="project-image-close"
            onClick={() =>
              setSelectedImage(null)
            }
            aria-label="Close image"
          >
            ×
          </button>


          <div className="project-image-modal-content">

            <div className="project-image-modal-top">

              <span>
                {selectedImage.title}
              </span>


              <span>
                ESC TO CLOSE
              </span>

            </div>


            <div className="project-image-modal-image-wrap">

              <img
                src={selectedImage.image}
                alt={selectedImage.title}
              />

            </div>

          </div>

        </div>

      )}


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <Footer />

    </main>
  );
};


export default ProjectPage;