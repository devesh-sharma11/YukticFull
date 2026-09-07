import React, { useState } from "react";
import "../styles/projectsSection.css";
import {
  FaArrowRight,
  FaExternalLinkAlt,
  FaGithub,
} from "react-icons/fa";
import stoneImage from "../assets/stoneimage.png";

const projectData = [
  {
    id: 1,
    num: "1",
    accentColor: "#f97316",
    category: "Recruitment / ATS",
    title: "CandiQ — Intelligent Recruitment & Talent Platform",
    subtitle: "Enterprise Talent Intake & Candidate Management",
    description:
      "Candidate management, resume intake, intelligent search, scoring algorithms, and full recruiter pipeline workflows.",
    challenges: [
      "Resume Parsing AI",
      "Multi-Tenant Workflows",
      "High-Speed Search",
    ],
    impactStats: [
      { label: "SCREENING SPEED", value: "3.5x Faster" },
      { label: "ACTIVE PIPELINES", value: "50K+" },
      { label: "PARSING ACCURACY", value: "98.8%" },
    ],
    detailedCase:
      "Engineered high-throughput candidate indexing with instant semantic search and algorithmic fit-scoring. Built real-time collaboration dashboards for enterprise hiring teams with automated interview scheduling and custom workflow builders.",
    tags: ["React", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS"],
    liveLink: "#",
    githubLink: "#",
  },

  {
    id: 2,
    num: "2",
    accentColor: "#0284c7",
    category: "Digital Health / EHR",
    title: "YuDi Health — Connected Healthcare & Patient Platform",
    subtitle: "Clinical Care Coordination & Digital Health Concept",
    description:
      "Digital platform concept focused on connected healthcare workflows, unified patient records, and modern clinical user experience.",
    challenges: [
      "HIPAA Compliance",
      "FHIR / HL7 Bridges",
      "Telehealth Streams",
    ],
    impactStats: [
      { label: "ACTIVE RECORDS", value: "120K+" },
      { label: "SYNC LATENCY", value: "<180ms" },
      { label: "UPTIME SLA", value: "99.99%" },
    ],
    detailedCase:
      "Constructed secure patient charts with role-based access control, cryptographic audit logging, and sub-second telemetry streaming for inpatient vitals. Implemented end-to-end encrypted video consultation pipelines with automated clinical notes.",
    tags: ["React", "FHIR API", "Redis", "WebSockets", "Docker"],
    liveLink: "#",
    githubLink: "#",
  },

  {
    id: 3,
    num: "3",
    accentColor: "#eab308",
    category: "Custom Business Apps",
    title: "Custom Business & Workflow Automation Apps",
    subtitle: "Web • Mobile • Workflow",
    description:
      "Bespoke applications, multi-system integrations, and specialized internal tools shaped directly around enterprise business processes.",
    challenges: [
      "Legacy Integration",
      "Role-Based ACL",
      "Complex Analytics",
    ],
    impactStats: [
      { label: "HOURS SAVED", value: "40%" },
      { label: "TRANSACTIONS", value: "1M+" },
      { label: "INTEGRITY", value: "100%" },
    ],
    detailedCase:
      "Developed high-velocity internal suites with dynamic form builders, audit history, automated notifications, and interactive BI dashboards. Reduced operational bottlenecks by replacing disjointed legacy spreadsheets with central cloud tools.",
    tags: ["React", "Next.js", "Python", "FastAPI", "GraphQL"],
    liveLink: "#",
    githubLink: "#",
  },
];

export default function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState("All");

  const categories = [
    "All",
    "Recruitment / ATS",
    "Digital Health / EHR",
    "Custom Business Apps",
    "HealthTech / EHR",
  ];

  const filteredProjects =
    activeFilter === "All"
      ? projectData
      : projectData.filter(
          (project) => project.category === activeFilter
        );

  return (
    <section className="projects-section-v2" id="projects">

      {/* =====================================================
          STONE BACKGROUND
      ===================================================== */}
      <div className="projects-stone-bg-v2">
        <img
          src={stoneImage}
          alt=""
          className="projects-stone-image-v2"
        />

        <div className="projects-stone-fade-v2" />
      </div>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}
      <div className="projects-content-v2">

        {/* =====================================================
            SECTION INTRO
        ===================================================== */}
        <div className="projects-intro-v2">

          <div className="projects-eyebrow-v2">
            <span className="projects-eyebrow-icon-v2">
              ☘
            </span>

            <span>YUKTIC</span>
          </div>

          <h2 className="projects-title-v2">
            OUR PROJECTS
          </h2>

          <p className="projects-subtitle-v2">
            Specialist expertise to transform complex healthcare
            programmes into confident, sustainable delivery.
          </p>

          <div className="projects-divider-v2" />
        </div>

        {/* =====================================================
            FILTERS
        ===================================================== */}
        <div className="projects-filter-v2">

          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`projects-filter-btn-v2 ${
                activeFilter === cat ? "active" : ""
              }`}
              onClick={() => setActiveFilter(cat)}
            >
              {cat}
            </button>
          ))}

        </div>

        {/* =====================================================
            PROJECT GRID
        ===================================================== */}
        <div className="projects-grid-v2">

          {filteredProjects.map((project) => (
            <article
              key={project.id}
              className="project-card-v2"
            >

              {/* =================================================
                  TOP
              ================================================= */}
              <div className="project-top-v2">

                <div className="project-meta-v2">

                  <span
                    className="project-number-v2"
                    style={{
                      backgroundColor: project.accentColor,
                    }}
                  >
                    {project.num}
                  </span>

                  <span className="project-category-v2">
                    {project.category}
                  </span>

                </div>

                <div className="project-links-v2">

                  <a
                    href={project.githubLink}
                    aria-label="GitHub Repository"
                    className="project-icon-v2"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaGithub />
                  </a>

                  

                </div>

              </div>

              {/* =================================================
                  TITLE
              ================================================= */}
              <div className="project-main-content-v2">

                <h3 className="project-name-v2">
                  {project.title}
                </h3>

                <h4 className="project-subtitle-v2">
                  {project.subtitle}
                </h4>

                <p className="project-description-v2">
                  {project.description}
                </p>

              </div>

              {/* =================================================
                  CAPABILITIES
              ================================================= */}
              <div className="project-capabilities-v2">

                <span className="project-section-label-v2">
                  KEY CAPABILITIES
                </span>

                <div className="project-pills-v2">

                  {project.challenges.map((item, idx) => (
                    <span
                      key={idx}
                      className="project-pill-v2"
                    >
                      {item}
                    </span>
                  ))}

                </div>

              </div>

              {/* =================================================
                  STATS
              ================================================= */}
              <div className="project-stats-v2">

                {project.impactStats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="project-stat-v2"
                  >
                    <span className="project-stat-value-v2">
                      {stat.value}
                    </span>

                    <span className="project-stat-label-v2">
                      {stat.label}
                    </span>
                  </div>
                ))}

              </div>

              {/* =================================================
                  TECHNOLOGIES
              ================================================= */}
              <div className="project-tags-v2">

                {project.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="project-tag-v2"
                  >
                    {tag}
                  </span>
                ))}

              </div>

              {/* =================================================
                  FOOTER
              ================================================= */}
              <div className="project-footer-v2">

                <a
                  href={project.liveLink}
                  className="project-view-btn-v2"
                >
                  <span>View Case Study</span>

                  <FaArrowRight className="project-arrow-v2" />
                </a>

              </div>

            </article>
          ))}

        </div>

      </div>
    </section>
  );
}