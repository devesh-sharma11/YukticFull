import React, { useState, useEffect, memo } from "react";
import {
  FaCode,
  FaRocket,
  FaUserFriends,
  FaCube,
  FaArrowRight,
} from "react-icons/fa";

import courageImg from "../assets/courage.avif";
import integrityImg from "../assets/integrity.jpg";
import respectImg from "../assets/Respect.avif";

import "../styles/heroSection.css";

const STROKE_DURATION = 0.7;
const START_DELAY = 0.2;

const LETTERS = [
  ["M10 10 L50 58 L90 10", "M50 58 L50 110"],
  ["M10 10 L10 65 Q10 110 50 110 Q90 110 90 65 L90 10"],
  ["M12 10 L12 110", "M88 10 L50 60 L88 110"],
  ["M8 10 L92 10", "M50 10 L50 110"],
  ["M50 10 L50 110"],
  ["M90 18 Q72 8 52 8 Q10 8 10 60 Q10 112 52 112 Q72 112 90 100"],
];

const STROKES = LETTERS.flatMap((paths, letterIndex) =>
  paths.map((path) => ({
    path,
    x: letterIndex * 116,
  }))
);

const backgroundImages = [courageImg, integrityImg, respectImg];

const servicesData = [
  {
    id: "consulting",
    icon: <FaCode />,
    subtitle: "Architecture & Advisory",
    title: "Software Consulting",
    tag: "Consulting",
    desc: "Architecture, high-performance engineering, and technology execution designed for scale.",
  },
  {
    id: "delivery",
    icon: <FaRocket />,
    subtitle: "End-to-End Build",
    title: "Solution Delivery",
    tag: "Delivery",
    desc: "Fixed-cost and T&M engagements aligned directly to mission-critical business outcomes.",
  },
  {
    id: "staffing",
    icon: <FaUserFriends />,
    subtitle: "Elite Engineering",
    title: "Staff Augmentation",
    tag: "Staffing",
    desc: "Vetted, high-impact engineers who seamlessly integrate with your existing core teams.",
  },
  {
    id: "products",
    icon: <FaCube />,
    subtitle: "Proprietary Tech",
    title: "Products & candiQ",
    tag: "Products",
    desc: "Building purpose-driven platforms, next-gen SaaS tools, and intelligent recruiting ecosystems like candiQ.",
  },
];

const YukticWritingHeader = memo(() => (
  <div className="yuktic-header-animation anim-item anim-right-1">
    <svg
      className="writing-word"
      viewBox="0 0 680 120"
      role="img"
      aria-label="YUKTIC written by an orb"
    >
      {STROKES.map(({ path, x }, index) => {
        const delayStr = `${START_DELAY + index * STROKE_DURATION}s`;
        return (
          <g key={`${x}-${index}`} transform={`translate(${x} 0)`}>
            <path
              className="writing-path"
              pathLength="1"
              d={path}
              style={{ "--stroke-delay": delayStr }}
            />
            <circle
              className="writing-orb"
              r="5"
              style={{ "--stroke-delay": delayStr }}
            >
              <animateMotion
                dur={`${STROKE_DURATION}s`}
                begin={delayStr}
                path={path}
                fill="freeze"
              />
            </circle>
          </g>
        );
      })}
    </svg>
  </div>
));

YukticWritingHeader.displayName = "YukticWritingHeader";

const LightHeartSection = () => {
  const [showCircles, setShowCircles] = useState(false);
  const [showDivs, setShowDivs] = useState(false);
  const [activeBgIndex, setActiveBgIndex] = useState(0);
  const [activeService, setActiveService] = useState(0);

  // Background rotation runs continuously from 0s
  useEffect(() => {
    const bgInterval = setInterval(() => {
      setActiveBgIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 6000);
    return () => clearInterval(bgInterval);
  }, []);

  // 1s: Right and left ambient circular lines animate in
  useEffect(() => {
    const circleTimer = setTimeout(() => {
      setShowCircles(true);
    }, 1000);
    return () => clearTimeout(circleTimer);
  }, []);

  // 3s: All inner content elements cascade in
  useEffect(() => {
    const divTimer = setTimeout(() => {
      setShowDivs(true);
    }, 3000);
    return () => clearTimeout(divTimer);
  }, []);

  // Service carousel rotation
  useEffect(() => {
    if (!showDivs) return;
    const srvInterval = setInterval(() => {
      setActiveService((prev) => (prev + 1) % servicesData.length);
    }, 5000);
    return () => clearInterval(srvInterval);
  }, [showDivs]);

  const currentItem = servicesData[activeService];

  return (
    <div className="candid-hero-wrapper">
      <section
        className={`candid-section ${showCircles ? "circles-entered" : ""}`}
      >
        {/* Background Images - 0s */}
        <div className="bg-layers-wrapper">
          {backgroundImages.map((img, idx) => (
            <div
              key={idx}
              className={`bg-layer ${idx === activeBgIndex ? "active" : ""}`}
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
        </div>

        <div className="section-overlay" />
        <div className="section-bottom-blue-fade" />

        {/* Content Elements - 3s */}
        {showDivs && (
          <div className="section-content-container">
            {/* LEFT — LIVE VIEW CARD */}
            <div className="live-view-card anim-item anim-card">
              <div className="live-header anim-item anim-left-1">
                <h3>PERFORMANCE STATICS</h3>
              </div>

              <div className="metrics-grid">
                <div className="metric-box anim-item anim-left-2">
                  <div className="metric-title-row">
                    <span className="metric-label">RISK LEVEL</span>
                    <span className="metric-status text-cyan">Low / Decreasing</span>
                  </div>
                  <div className="bars-chart">
                    <span className="bar bar-1" />
                    <span className="bar bar-2" />
                    <span className="bar bar-3" />
                    <span className="bar bar-4" />
                  </div>
                </div>

                <div className="metric-box anim-item anim-left-3">
                  <div className="metric-title-row">
                    <span className="metric-label">DELIVERY PIPELINE</span>
                    <span className="metric-status text-cyan">Stabilised</span>
                  </div>
                  <div className="timeline-chart">
                    <svg viewBox="0 0 160 48" className="sparkline-svg">
                      <path
                        className="spark-path"
                        d="M 0 35 L 20 15 L 40 40 L 60 18 L 80 32 L 95 24 L 110 26 L 130 24 L 155 24"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <line
                        x1="88"
                        y1="0"
                        x2="88"
                        y2="48"
                        stroke="rgba(56, 189, 248, 0.4)"
                        strokeWidth="1.5"
                        strokeDasharray="3,3"
                      />
                      <circle cx="155" cy="24" r="4" fill="#38bdf8" className="spark-dot" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* HUB NETWORK (Recalibrated coordinates) */}
              <div className="teams-hub-section">
                <span className="teams-header-label anim-item anim-left-4">
                  CONNECTED TEAMS & CAPABILITIES
                </span>

                <div className="hub-network-container">
                  {/* Coordinates: Box is 340x220. Center is (170, 110) */}
                  <svg className="hub-lines-svg anim-item anim-hub-lines" viewBox="0 0 340 220">
                    <line x1="170" y1="110" x2="52" y2="46" className="hub-line" />
                    <line x1="170" y1="110" x2="288" y2="46" className="hub-line" />
                    <line x1="170" y1="110" x2="52" y2="174" className="hub-line" />
                    <line x1="170" y1="110" x2="288" y2="174" className="hub-line" />
                  </svg>

                  {/* Centered Green Clover Node */}
                  <div className="hub-center-node anim-item anim-hub-center" title="Yuktic Core">
                    <span className="clover-symbol">☘︎</span>
                  </div>

                  {/* 4 Outer Nodes */}
                  {servicesData.map((srv, idx) => (
                    <button
                      key={srv.id}
                      onClick={() => setActiveService(idx)}
                      className={`hub-node node-${idx + 1} anim-item anim-hub-node-${idx + 1} ${
                        activeService === idx ? "node-active" : ""
                      }`}
                      aria-label={srv.title}
                    >
                      <span className="hub-node-icon">{srv.icon}</span>
                      <span className="hub-node-title">{srv.tag}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT — TYPOGRAPHY */}
            <div className="text-content">
              <YukticWritingHeader />

              <div className="card-text-wrapper" key={currentItem.id}>
                <div className="badge-chip anim-item anim-right-2">
                  <span className="chip-icon">{currentItem.icon}</span>
                  <span>{currentItem.subtitle}</span>
                </div>

                <h1 className="service-title anim-item anim-right-3">
                  {currentItem.title}
                </h1>

                <p className="service-description anim-item anim-right-4">
                  {currentItem.desc}
                </p>

                <div className="glass-services-grid">
                  {servicesData.map((item, idx) => {
                    const isActive = activeService === idx;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setActiveService(idx)}
                        className={`glass-service-card anim-item anim-card-${idx + 1} ${
                          isActive ? "active" : ""
                        }`}
                      >
                        <div className="card-left-group">
                          <span className="service-card-icon">{item.icon}</span>
                          <div className="card-text-block">
                            <h4 className="service-card-title">{item.title}</h4>
                            <p className="service-card-sub">{item.subtitle}</p>
                          </div>
                        </div>
                        <FaArrowRight className="card-arrow" />
                        {isActive && <div className="active-glow-bar" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default LightHeartSection;