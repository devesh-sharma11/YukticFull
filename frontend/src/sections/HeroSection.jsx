import React, {
  useState,
  useEffect,
  memo,
  useRef,
} from "react";

import {
  FaCode,
  FaRocket,
  FaUserFriends,
  FaCube,
} from "react-icons/fa";

import courageImg from "../assets/courage.avif";
import integrityImg from "../assets/integrity.jpg";
import respectImg from "../assets/Respect.avif";
import Yuktic from "../assets/Yuktic.png";

import "../styles/heroSection.css";

/* =========================================================
   YUKTIC WRITING ANIMATION
========================================================= */

const STROKE_DURATION = 0.7;
const START_DELAY = 0.2;

const LETTERS = [
  ["M10 10 L50 58 L90 10", "M50 58 L50 110"],
  ["M10 10 L10 65 Q10 110 50 110 Q90 110 90 65 L90 10"],
  ["M12 10 L12 110", "M88 10 L50 60 L88 110"],
  ["M8 10 L92 10", "M50 10 L50 110"],
  ["M50 10 L50 110"],
  [
    "M90 18 Q72 8 52 8 Q10 8 10 60 Q10 112 52 112 Q72 112 90 100",
  ],
];

const STROKES = LETTERS.flatMap((paths, letterIndex) =>
  paths.map((path) => ({
    path,
    x: letterIndex * 116,
  }))
);

/* =========================================================
   BACKGROUND IMAGES
========================================================= */

const backgroundImages = [
  courageImg,
  integrityImg,
  respectImg,
];

/* =========================================================
   SERVICES
========================================================= */

const servicesData = [
  {
    id: "consulting",
    icon: <FaCode />,
    subtitle: "Defined scope + milestones",
    title: "Fixed Cost",
    tag: "Fixed Cost",
    desc: "Best when requirements and outcomes are clearly scoped.",
  },
  {
    id: "delivery",
    icon: <FaRocket />,
    subtitle: "Flexible capacity + evolving scope",
    title: "Time & Material",
    tag: "T&M",
    desc: "Best when priorities may change during delivery.",
  },
  {
    id: "staffing",
    icon: <FaUserFriends />,
    subtitle: "Engineers embedded in your team",
    title: "Staff Augmentation",
    tag: "Staffing",
    desc: "Best when you need additional capability without permanent hiring.",
  },
  {
    id: "products",
    icon: <FaCube />,
    subtitle: "Target talent acquisition",
    title: "Recruitment",
    tag: "Recruitment",
    desc: "Best when you want to build or expand your own team.",
  },
];

/* =========================================================
   YUKTIC WRITING HEADER
========================================================= */

const YukticWritingHeader = memo(() => (
  <div className="yuktic-header-animation anim-item anim-right-1">
    <svg
      className="writing-word"
      viewBox="0 0 680 120"
      role="img"
      aria-label="YUKTIC written by an orb"
    >
      {STROKES.map(({ path, x }, index) => {
        const delayStr =
          `${START_DELAY + index * STROKE_DURATION}s`;

        return (
          <g
            key={`${x}-${index}`}
            transform={`translate(${x} 0)`}
          >
            <path
              className="writing-path"
              pathLength="1"
              d={path}
              style={{
                "--stroke-delay": delayStr,
              }}
            />

            <circle
              className="writing-orb"
              r="5"
              style={{
                "--stroke-delay": delayStr,
              }}
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

YukticWritingHeader.displayName =
  "YukticWritingHeader";

/* =========================================================
   MAIN SECTION
========================================================= */

const LightHeartSection = () => {

  /* =======================================================
     CIRCLE ENTRANCE ANIMATION

     IMPORTANT:
     Starts false and becomes true on first frame.

     This preserves your CSS circle entrance animation.
     There is NO 1-second delay.
  ======================================================= */

  const [showCircles, setShowCircles] =
    useState(false);

  /* =======================================================
     CONTENT VISIBLE IMMEDIATELY

     No 3-second delay.
  ======================================================= */

  const [showDivs] = useState(true);

  /* =======================================================
     SYNCHRONIZED STATES

     Text + image are controlled together.
  ======================================================= */

  const [activeService, setActiveService] =
    useState(0);

  const [activeBgIndex, setActiveBgIndex] =
    useState(0);

  /* =======================================================
     TIMER REFS
  ======================================================= */

  const timerRef = useRef(null);

  /*
   * Used to identify whether the current timer
   * is a normal 5-second timer or a click 10-second timer.
   */
  const timerGenerationRef = useRef(0);

  /* =======================================================
     CIRCLE APPEAR ANIMATION
  ======================================================= */

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setShowCircles(true);
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, []);

  /* =======================================================
     NORMAL SYNCHRONIZED ROTATION
     
     TEXT + IMAGE CHANGE TOGETHER EVERY 5 SECONDS.
  ======================================================= */

  useEffect(() => {
    const startNormalTimer = () => {

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {

        /*
         * Change both at EXACTLY the same time.
         */

        setActiveService((prev) => {
          const next =
            (prev + 1) % servicesData.length;

          return next;
        });

        setActiveBgIndex((prev) => {
          const next =
            (prev + 1) % backgroundImages.length;

          return next;
        });

        /*
         * Continue normal 5-second cycle.
         */

        startNormalTimer();

      }, 5000);
    };

    startNormalTimer();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  /* =======================================================
     USER CLICK HANDLER
     
     USER CLICKS:
     
     1. Selected service changes immediately.
     2. Current image stays.
     3. Text + image remain frozen for 10 seconds.
     4. After 10 seconds, both change together.
     5. Then normal 5-second cycle continues.
     
     Every new click restarts the 10-second countdown.
  ======================================================= */

  const handleServiceClick = (index) => {

    /* -----------------------------------------------
       Immediately select clicked service
    ------------------------------------------------ */

    setActiveService(index);

    /*
     * IMPORTANT:
     * We intentionally DO NOT change the image here.
     *
     * The current image stays on screen during
     * the 10-second user hold.
     */

    /* -----------------------------------------------
       Cancel existing timer
    ------------------------------------------------ */

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    /*
     * Create a new timer generation.
     *
     * This prevents an old timer from affecting
     * the newly selected service.
     */

    timerGenerationRef.current += 1;

    const currentGeneration =
      timerGenerationRef.current;

    /* -----------------------------------------------
       HOLD FOR 10 SECONDS
    ------------------------------------------------ */

    timerRef.current = setTimeout(() => {

      /*
       * Make sure this is still the latest click.
       */

      if (
        currentGeneration !==
        timerGenerationRef.current
      ) {
        return;
      }

      /*
       * CHANGE TEXT + IMAGE TOGETHER.
       */

      setActiveService((prev) => {
        return (
          (prev + 1) % servicesData.length
        );
      });

      setActiveBgIndex((prev) => {
        return (
          (prev + 1) % backgroundImages.length
        );
      });

      /* ---------------------------------------------
         After click hold is finished,
         start normal 5-second cycle again.
      --------------------------------------------- */

      timerRef.current = setTimeout(
        function normalRotation() {

          setActiveService((prev) => {
            return (
              (prev + 1) %
              servicesData.length
            );
          });

          setActiveBgIndex((prev) => {
            return (
              (prev + 1) %
              backgroundImages.length
            );
          });

          timerRef.current = setTimeout(
            normalRotation,
            5000
          );

        },
        5000
      );

    }, 10000);
  };

  /* =======================================================
     CLEANUP
  ======================================================= */

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  /* =======================================================
     CURRENT SERVICE
  ======================================================= */

  const currentItem =
    servicesData[activeService];

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="candid-hero-wrapper">

      <section
        className={`candid-section ${
          showCircles
            ? "circles-entered"
            : ""
        }`}
      >

        {/* =================================================
            BACKGROUND IMAGES
        ================================================== */}

        <div className="bg-layers-wrapper">

          {backgroundImages.map((img, idx) => (

            <div
              key={idx}
              className={`bg-layer ${
                idx === activeBgIndex
                  ? "active"
                  : ""
              }`}
              style={{
                backgroundImage:
                  `url(${img})`,
              }}
            />

          ))}

        </div>

        <div className="section-overlay" />

        <div className="section-bottom-blue-fade" />

        {/* =================================================
            CONTENT
            IMMEDIATE — NO 3 SECOND DELAY
        ================================================== */}

        {showDivs && (

          <div className="section-content-container">

            {/* =============================================
                LEFT — LIVE VIEW CARD
            ============================================== */}

            <div className="live-view-card anim-item anim-card">

              <div className="live-header anim-item anim-left-1">

                <h3>
                  PERFORMANCE STATICS
                </h3>

              </div>

              {/* =========================================
                  METRICS
              ========================================== */}

              <div className="metrics-grid">

                {/* RISK LEVEL */}

                <div className="metric-box anim-item anim-left-2">

                  <div className="metric-title-row">

                    <span className="metric-label">
                      RISK LEVEL
                    </span>

                    <span className="metric-status text-cyan">
                      Low / Decreasing
                    </span>

                  </div>

                  <div className="bars-chart">

                    <span className="bar bar-1" />
                    <span className="bar bar-2" />
                    <span className="bar bar-3" />
                    <span className="bar bar-4" />

                  </div>

                </div>

                {/* DELIVERY PIPELINE */}

                <div className="metric-box anim-item anim-left-3">

                  <div className="metric-title-row">

                    <span className="metric-label">
                      DELIVERY PIPELINE
                    </span>

                    <span className="metric-status text-cyan">
                      Stabilised
                    </span>

                  </div>

                  <div className="timeline-chart">

                    <svg
                      viewBox="0 0 160 48"
                      className="sparkline-svg"
                    >

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

                      <circle
                        cx="155"
                        cy="24"
                        r="4"
                        fill="#38bdf8"
                        className="spark-dot"
                      />

                    </svg>

                  </div>

                </div>

              </div>

              {/* =========================================
                  HUB NETWORK
              ========================================== */}

              <div className="teams-hub-section">

                <span className="teams-header-label anim-item anim-left-4">
                  CONNECTED TEAMS & CAPABILITIES
                </span>

                <div className="hub-network-container">

                  {/* HUB LINES */}

                  <svg
                    className="hub-lines-svg anim-item anim-hub-lines"
                    viewBox="0 0 340 220"
                  >

                    <line
                      x1="170"
                      y1="110"
                      x2="52"
                      y2="46"
                      className="hub-line"
                    />

                    <line
                      x1="170"
                      y1="110"
                      x2="288"
                      y2="46"
                      className="hub-line"
                    />

                    <line
                      x1="170"
                      y1="110"
                      x2="52"
                      y2="174"
                      className="hub-line"
                    />

                    <line
                      x1="170"
                      y1="110"
                      x2="288"
                      y2="174"
                      className="hub-line"
                    />

                  </svg>

                  {/* CENTER YUKTIC */}

                  <div
                    className="hub-center-node anim-item anim-hub-center"
                    title="Yuktic Core"
                  >

                    <img
                      src={Yuktic}
                      alt="Yuktic"
                      className="hub-yuktic-logo"
                    />

                  </div>

                  {/* OUTER NODES */}

                  {servicesData.map(
                    (srv, idx) => (

                      <button
                        key={srv.id}
                        onClick={() =>
                          handleServiceClick(idx)
                        }
                        className={`
                          hub-node
                          node-${idx + 1}
                          anim-item
                          anim-hub-node-${idx + 1}
                          ${
                            activeService === idx
                              ? "node-active"
                              : ""
                          }
                        `}
                        aria-label={srv.title}
                      >

                        <span className="hub-node-icon">
                          {srv.icon}
                        </span>

                        <span className="hub-node-title">
                          {srv.tag}
                        </span>

                      </button>

                    )
                  )}

                </div>

              </div>

            </div>

            {/* =============================================
                RIGHT — TYPOGRAPHY
            ============================================== */}

            <div className="text-content">

              <YukticWritingHeader />

              <div
                className="card-text-wrapper"
                key={currentItem.id}
              >

                {/* BADGE */}

                <div className="badge-chip anim-item anim-right-2">

                  <span className="chip-icon">
                    {currentItem.icon}
                  </span>

                  <span>
                    {currentItem.subtitle}
                  </span>

                </div>

                {/* TITLE */}

                <h1 className="service-title anim-item anim-right-3">
                  {currentItem.title}
                </h1>

                {/* DESCRIPTION */}

                <p className="service-description anim-item anim-right-4">
                  {currentItem.desc}
                </p>

                {/* SERVICE CARDS */}

                <div className="glass-services-grid">

                  {servicesData.map(
                    (item, idx) => {

                      const isActive =
                        activeService === idx;

                      return (

                        <div
                          key={item.id}
                          onClick={() =>
                            handleServiceClick(idx)
                          }
                          className={`
                            glass-service-card
                            anim-item
                            anim-card-${idx + 1}
                            ${
                              isActive
                                ? "active"
                                : ""
                            }
                          `}
                        >

                          <div className="card-left-group">

                            <span className="service-card-icon">
                              {item.icon}
                            </span>

                            <div className="card-text-block">

                              <h4 className="service-card-title">
                                {item.title}
                              </h4>

                              <p className="service-card-sub">
                                {item.subtitle}
                              </p>

                            </div>

                          </div>

                          {isActive && (
                            <div className="active-glow-bar" />
                          )}

                        </div>

                      );
                    }
                  )}

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