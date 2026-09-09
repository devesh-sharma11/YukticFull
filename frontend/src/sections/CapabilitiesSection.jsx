import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/capabilitiesSection.css";

import courageImg from "../assets/courage.avif";
import integrityImg from "../assets/integrity.jpg";
import respectImg from "../assets/Respect.avif";

/* =========================================================
   SERVICES
========================================================= */

const services = [
  {
    id: "founder-led-accountability",
    number: "01",
    label: "FOUNDER-LED ACCOUNTABILITY",
    title: "Founder-Led Accountability",
    bgImage: courageImg,
    description:
      "Senior-led engagement that brings clear ownership, decisive direction and accountable delivery to complex healthcare programmes.",
    context:
      "Complex programmes can lose momentum when ownership becomes fragmented, decisions slow down and delivery risks remain unresolved.",
    whatWeDo: [
      "Direct founder-level programme oversight",
      "Rapid decision-making and issue resolution",
      "Clear ownership across delivery workstreams",
      "Executive stakeholder alignment",
    ],
    approachTitle: "ACCOUNTABILITY IN ACTION",
    approach: [
      "Stay close to critical decisions",
      "Create transparent delivery ownership",
      "Escalate risks before they become blockers",
      "Keep teams focused on measurable outcomes",
    ],
    outcome:
      "Stronger ownership, faster decisions and greater confidence across the programme.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="2" />
        <path d="M12 3v2" />
        <path d="M12 19v2" />
        <path d="M3 12h2" />
        <path d="M19 12h2" />
      </svg>
    ),
  },

  {
    id: "logic-driven-execution",
    number: "02",
    label: "LOGIC-DRIVEN EXECUTION",
    title: "Logic-Driven Execution",
    bgImage: integrityImg,
    description:
      "Structured delivery built around clear logic, disciplined execution and practical solutions that move complex programmes forward.",
    context:
      "Healthcare technology programmes can become difficult to execute when priorities, dependencies and delivery decisions are not clearly structured.",
    whatWeDo: [
      "Translate strategy into executable plans",
      "Map dependencies and delivery priorities",
      "Structure complex clinical workflows",
      "Track decisions, risks and actions",
    ],
    approachTitle: "EXECUTION BY DESIGN",
    approach: [
      "Break complexity into clear workstreams",
      "Prioritise what creates real value",
      "Connect decisions to delivery outcomes",
      "Measure progress through tangible milestones",
    ],
    outcome:
      "A focused delivery model where complex requirements become clear, actionable execution.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M8 8h8" />
        <path d="M8 12h4" />
        <path d="M8 16h3" />
        <path d="m15 12 1.5 1.5L19 11" />
      </svg>
    ),
  },

  {
    id: "flexible-engagement",
    number: "03",
    label: "FLEXIBLE ENGAGEMENT",
    title: "Flexible Engagement",
    bgImage: respectImg,
    description:
      "Engagement models designed around the programme's needs, from targeted specialist support to hands-on delivery leadership.",
    context:
      "Every programme has different capacity, capability and delivery pressures, making rigid engagement models difficult to apply effectively.",
    whatWeDo: [
      "Tailored advisory and delivery support",
      "Flexible specialist resource models",
      "Embedded programme and clinical expertise",
      "Support that scales with programme demand",
    ],
    approachTitle: "ADAPTIVE SUPPORT",
    approach: [
      "Start with the highest-value intervention",
      "Scale expertise around programme needs",
      "Work alongside existing teams",
      "Adapt quickly as priorities change",
    ],
    outcome:
      "The right expertise at the right time, without unnecessary complexity or long-term overhead.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 6h16" />
        <circle cx="9" cy="6" r="2" />
        <path d="M4 12h16" />
        <circle cx="15" cy="12" r="2" />
        <path d="M4 18h16" />
        <circle cx="11" cy="18" r="2" />
      </svg>
    ),
  },

  {
    id: "strong-technology-network",
    number: "04",
    label: "STRONG TECHNOLOGY NETWORK",
    title: "Strong Technology Network",
    bgImage: courageImg,
    description:
      "Access to a trusted network of technology, clinical and delivery specialists to strengthen capability where it matters most.",
    context:
      "Programmes can struggle when specialist technology expertise is fragmented or when teams lack access to the right experience at the right time.",
    whatWeDo: [
      "Connect specialist technology expertise",
      "Bring proven healthcare experience",
      "Strengthen delivery and technical capability",
      "Support complex technology decisions",
    ],
    approachTitle: "CONNECTED EXPERTISE",
    approach: [
      "Bring the right specialist into the problem",
      "Combine clinical and technology thinking",
      "Use proven experience to reduce uncertainty",
      "Build capability rather than dependency",
    ],
    outcome:
      "A stronger technology ecosystem with deeper expertise, reduced risk and greater delivery resilience.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="5" r="2.5" />
        <circle cx="5" cy="17" r="2.5" />
        <circle cx="19" cy="17" r="2.5" />
        <path d="M10.5 7 6.5 15" />
        <path d="M13.5 7 17.5 15" />
        <path d="M7.5 17h9" />
      </svg>
    ),
  },
];

/* =========================================================
   ICONS
========================================================= */

const ChevronIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const ArrowIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="13 6 19 12 13 18" />
  </svg>
);

const ContextIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10 3v18" />
    <path d="M11 5h7l-3 3 3 3h-7" />
    <path d="M6 22h8" />
  </svg>
);

const WhatWeDoIcons = [
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4 4" />
    <path d="M8.5 11h5" />
    <path d="M11 8.5v5" />
  </svg>,

  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3 20 6v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>,

  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <path d="M8 8h8" />
    <path d="M8 12h5" />
    <path d="M8 16h3" />
  </svg>,

  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="8" cy="8" r="3" />
    <circle cx="17" cy="9" r="2.5" />
    <path d="M2 20c0-3.5 2.7-5.5 6-5.5s6 2 6 5.5" />
    <path d="M14 15c3 0 5 1.7 5 5" />
  </svg>,
];

const ApproachIcons = [
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>,

  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 19h16" />
    <path d="M6 16V9" />
    <path d="M12 16V5" />
    <path d="M18 16v-4" />
  </svg>,

  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="8" />
    <path d="m8 12 2.5 2.5L16 9" />
  </svg>,

  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3v18" />
    <path d="M3 12h18" />
    <circle cx="12" cy="12" r="8" />
  </svg>,
];

/* =========================================================
   COMPONENT
========================================================= */

const CapabilitiesSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const currentService = services[activeIndex];

  return (
    <section className="ykc2026-section" id="capabilities">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="ykc2026-header">

        <div className="ykc2026-eyebrow">
          <span className="ykc2026-eyebrow-mark">☘</span>
          CAPABILITIES
        </div>

        <h2 className="ykc2026-title">
          Why teams choose Yuktic
        </h2>

        <p className="ykc2026-subtitle">
          Specialist expertise to transform complex healthcare programmes
          into confident, sustainable delivery.
        </p>

        <div className="ykc2026-divider" />

      </div>


      {/* =====================================================
          MAIN DASHBOARD
      ===================================================== */}

      <div className="ykc2026-layout">

        {/* ===================================================
            LEFT NAVIGATION
        =================================================== */}

        <div className="ykc2026-tabs">

          {services.map((item, idx) => {

            const isActive = activeIndex === idx;

            return (
              <motion.div
                key={item.id}
                className={`ykc2026-tab ${
                  isActive ? "is-active" : ""
                }`}
                onMouseEnter={() => setActiveIndex(idx)}
                whileHover={{ y: -2 }}
                transition={{
                  duration: 0.22,
                  ease: "easeOut",
                }}
              >

                <div
                  className="ykc2026-tab-bg"
                  style={{
                    backgroundImage: `url(${item.bgImage})`,
                  }}
                />

                <div className="ykc2026-tab-overlay" />

                <div className="ykc2026-tab-shine" />

                <div className="ykc2026-tab-content">

                  <div className="ykc2026-tab-icon">
                    {item.icon}
                  </div>

                  <div className="ykc2026-tab-divider" />

                  <span className="ykc2026-tab-label">
                    {item.label}
                  </span>

                  <div className="ykc2026-tab-arrow">
                    <ChevronIcon />
                  </div>

                </div>

              </motion.div>
            );
          })}

        </div>


        {/* ===================================================
            RIGHT DETAILS PANEL
        =================================================== */}

        <div className="ykc2026-panel">

          <div className="ykc2026-glow ykc2026-glow-one" />
          <div className="ykc2026-glow ykc2026-glow-two" />

          <div className="ykc2026-wave ykc2026-wave-one" />
          <div className="ykc2026-wave ykc2026-wave-two" />

          <div className="ykc2026-dots" />


          <motion.div
            key={`${currentService.id}-image`}
            className="ykc2026-watermark"
            style={{
              backgroundImage:
                `url(${currentService.bgImage})`,
            }}
            initial={{
              opacity: 0,
              scale: 1.03,
            }}
            animate={{
              opacity: 0.09,
              scale: 1,
            }}
            transition={{
              duration: 0.45,
            }}
          />


          <AnimatePresence mode="wait">

            <motion.div
              key={currentService.id}
              className="ykc2026-content"

              initial={{
                opacity: 0,
                y: 12,
              }}

              animate={{
                opacity: 1,
                y: 0,
              }}

              exit={{
                opacity: 0,
                y: -12,
              }}

              transition={{
                duration: 0.28,
                ease: "easeOut",
              }}
            >

              {/* =================================================
                  TITLE
              ================================================= */}

              <div className="ykc2026-heading">

                <div className="ykc2026-heading-icon">
                  {currentService.icon}
                </div>

                <div className="ykc2026-heading-copy">

                  <h2 className="ykc2026-detail-title">
                    {currentService.title}
                  </h2>

                  <div className="ykc2026-title-line" />

                </div>

              </div>


              {/* =================================================
                  INTRO
              ================================================= */}

              <p className="ykc2026-intro">
                {currentService.description}
              </p>


              {/* =================================================
                  CONTEXT
              ================================================= */}

              <div className="ykc2026-context">

                <div className="ykc2026-context-icon">
                  <ContextIcon />
                </div>

                <div className="ykc2026-context-content">

                  <div className="ykc2026-label">
                    <span />
                    THE CONTEXT
                  </div>

                  <p>
                    {currentService.context}
                  </p>

                </div>

              </div>


              {/* =================================================
                  TWO COLUMNS
              ================================================= */}

              <div className="ykc2026-columns">

                {/* =================================================
                    WHAT WE DO
                ================================================= */}

                <div className="ykc2026-what">

                  <div className="ykc2026-label ykc2026-main-label">
                    <span />
                    WHAT WE DO
                  </div>

                  <div className="ykc2026-timeline">

                    {currentService.whatWeDo.map(
                      (point, i) => (

                        <div
                          className="ykc2026-timeline-item"
                          key={point}
                        >

                          <div className="ykc2026-timeline-icon">
                            {WhatWeDoIcons[i]}
                          </div>

                          <div className="ykc2026-timeline-line" />

                          <span className="ykc2026-timeline-text">
                            {point}
                          </span>

                        </div>

                      )
                    )}

                  </div>

                </div>


                {/* =================================================
                    APPROACH
                ================================================= */}

                <div className="ykc2026-approach">

                  <div className="ykc2026-label ykc2026-main-label">
                    <span />
                    {currentService.approachTitle}
                  </div>

                  <div className="ykc2026-approach-list">

                    {currentService.approach.map(
                      (point, i) => (

                        <div
                          className="ykc2026-approach-item"
                          key={point}
                        >

                          <div className="ykc2026-approach-icon">
                            {ApproachIcons[i]}
                          </div>

                          <span className="ykc2026-approach-text">
                            {point}
                          </span>

                        </div>

                      )
                    )}

                  </div>

                </div>

              </div>


              

             


                


                

              

            </motion.div>

          </AnimatePresence>

        </div>

      </div>

    </section>
  );
};

export default CapabilitiesSection;