import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/articleOpenPage.css";
import Footer from "../components/Footer";

const API = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

/* =========================================================
   UTILITIES
========================================================= */

const getUrl = (img) => {
  if (!img) return "";

  const path =
    typeof img === "string"
      ? img
      : img?.image ||
        img?.url ||
        img?.src ||
        "";

  if (!path) return "";

  if (path.startsWith("http")) return path;

  return `${API}${path.startsWith("/") ? "" : "/"}${path}`;
};

const formatDate = (value) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getArray = (value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return [];
  }

  return [value];
};

const getText = (...values) => {
  for (const value of values) {
    if (
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ""
    ) {
      return String(value);
    }
  }

  return "";
};

/* =========================================================
   ARTICLE PAGE
========================================================= */

const ArticleOpenPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  /* =======================================================
     ALWAYS START FROM TOP
  ======================================================= */

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [slug]);

  /* =======================================================
     ARTICLE PAGE NAVBAR SCOPE
     ONLY ARTICLE OPEN PAGE
  ======================================================= */

  useEffect(() => {
    document.body.classList.add("article-open-active");

    return () => {
      document.body.classList.remove("article-open-active");
    };
  }, []);

  /* =======================================================
     READING PROGRESS
  ======================================================= */

  useEffect(() => {
    const handleScroll = () => {
      const documentHeight =
        document.documentElement.scrollHeight;

      const viewportHeight =
        window.innerHeight;

      const totalScrollable =
        documentHeight - viewportHeight;

      if (totalScrollable <= 0) {
        setProgress(0);
        return;
      }

      const current =
        (window.scrollY / totalScrollable) * 100;

      setProgress(
        Math.min(100, Math.max(0, current))
      );
    };

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    handleScroll();

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  /* =======================================================
     FETCH DATA
  ======================================================= */

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      if (!slug) return;

      setLoading(true);
      setError("");

      try {
        const [singleResponse, listResponse] =
          await Promise.all([
            fetch(
              `${API}/case-studies/${encodeURIComponent(
                slug
              )}`
            ),
            fetch(`${API}/case-studies`),
          ]);

        if (!singleResponse.ok) {
          throw new Error(
            "Artcile not found."
          );
        }

        const singleData =
          await singleResponse.json();

        const listData = listResponse.ok
          ? await listResponse.json()
          : [];

        if (!active) return;

        setArticle(singleData);

        setArticles(
          Array.isArray(listData)
            ? listData
            : []
        );
      } catch (err) {
        if (active) {
          setError(
            err?.message ||
              "Failed to load Article."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, [slug]);

  /* =======================================================
     DATABASE DATA
  ======================================================= */

  const summary =
    article?.project_summary || {};

  const organisation = getText(
    summary.organisation
  );

  const region = getText(
    summary.region
  );

  const serviceTypes = getArray(
    summary.service_types
  );

  const stakeholders = getArray(
    summary.stakeholders
  );

  const epicModules = getArray(
    summary.epic_modules
  );

  const specialties = getArray(
    summary.specialties
  );

  const landmark = getText(
    summary.landmark,
    article?.landmark
  );

  const filterTitle = getText(
    article?.filter_title
  );

  const landmarkTitle = getText(
    article?.landmark_title
  );

  const landmarkDescription = getText(
    article?.landmark_description
  );

  const eventTypes = getArray(
    article?.event_types
  );

  const difficultFactors = getArray(
    article?.difficult_factors
  );

  /* =======================================================
     RELATED CASE STUDIES
     EXACTLY 3
  ======================================================= */

  const moreArticles = useMemo(() => {
    return articles
      .filter(
        (item) =>
          item?.slug &&
          item.slug !== slug
      )
      .slice(0, 3);
  }, [articles, slug]);

  /* =======================================================
     SECTION NAVIGATION
  ======================================================= */

  const scrollTo = (id) => {
    const element =
      document.getElementById(id);

    if (!element) return;

    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="sw-loader-wrap">

        <div className="sw-loader-circle sw-loader-circle-left" />

        <div className="sw-loader-circle sw-loader-circle-right" />

        <div className="sw-loader-system">

          <div className="sw-loader-ring" />

          <div className="sw-loader-ring-inner" />

          <div className="sw-loader-dot" />

        </div>

        <div className="sw-loader-line-track">
          <div className="sw-loader-line-bar" />
        </div>

        <span className="sw-loader-text">
          LOADING Article
        </span>

        <span className="sw-loader-subtext">
          {slug || "LOADING"}
        </span>

      </div>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (error || !article) {
    return (
      <div className="sw-error-wrap">

        <span className="sw-error-code">
          STATUS 404 // MISSING
        </span>

        <h1>
          Document Unavailable.
        </h1>

        <p>
          {error ||
            "The requested article does not exist or has been archived."}
        </p>

        <button
          className="sw-btn"
          onClick={() =>
            navigate("/article")
          }
        >
          ← RETURN TO Article
        </button>

      </div>
    );
  }

  /* =======================================================
     IMAGE DATA
  ======================================================= */

  const architectureImage =
    article?.architecture_image;

  const workflowImage =
    article?.workflow_image;

  const productImage =
    article?.product_image;

  return (
    <div className="sw-page">

      {/* ===================================================
          LARGE BACKGROUND CIRCLES
      =================================================== */}

      <div className="sw-background-circle sw-background-circle-left" />

      <div className="sw-background-circle sw-background-circle-right" />

      {/* ===================================================
          READING PROGRESS
      =================================================== */}

      <div className="sw-progress-bar">

        <div
          className="sw-progress-fill"
          style={{
            width: `${progress}%`,
          }}
        />

      </div>

      {/* ===================================================
          FULL WIDTH ARTICLE LAYOUT
      =================================================== */}

      <div className="sw-layout">

        {/* =================================================
            LEFT SIDEBAR
        ================================================= */}

        <aside className="sw-sidebar">

          <div className="sw-sidebar-inner">

            {/* =================================================
                AT A GLANCE
            ================================================= */}

            <div className="sw-glance-heading">

              <span className="sw-glance-line" />

              <span>
                Overview
              </span>

            </div>

            <div className="sw-glance-title">
              About This Article
            </div>

            {/* =================================================
                ORGANISATION
            ================================================= */}

            {organisation && (
              <div className="sw-glance-item">

                <div className="sw-glance-icon">
                   👤
                </div>

                <div className="sw-glance-content">

                  <span className="sw-glance-label">
                    About
                  </span>

                  <span className="sw-glance-value">
                    {organisation}
                  </span>

                </div>

              </div>
            )}

            {/* =================================================
                REGION
            ================================================= */}

            {region && (
              <div className="sw-glance-item">

                <div className="sw-glance-icon">
                  📍
                </div>

                <div className="sw-glance-content">

                  <span className="sw-glance-label">
                    Location
                  </span>

                  <span className="sw-glance-value">
                    {region}
                  </span>

                </div>

              </div>
            )}

            {/* =================================================
                SERVICE TYPES
            ================================================= */}

            {serviceTypes.length > 0 && (
              <div className="sw-glance-item">

                <div className="sw-glance-icon">
                  🔎
                </div>

                <div className="sw-glance-content">

                  <span className="sw-glance-label">
                    Focus
                  </span>

                  <span className="sw-glance-value">
                    {serviceTypes.join(", ")}
                  </span>

                </div>

              </div>
            )}

            {/* =================================================
                STAKEHOLDERS
            ================================================= */}

            {stakeholders.length > 0 && (
              <div className="sw-glance-item">

                <div className="sw-glance-icon">
                  👥
                </div>

                <div className="sw-glance-content">

                  <span className="sw-glance-label">
                    People Involved
                  </span>

                  <span className="sw-glance-value">
                    {stakeholders.join(", ")}
                  </span>

                </div>

              </div>
            )}

            {/* =================================================
                EPIC MODULES
            ================================================= */}

            {epicModules.length > 0 && (
              <div className="sw-glance-item">

                <div className="sw-glance-icon">
                  💻
                </div>

                <div className="sw-glance-content">

                  <span className="sw-glance-label">
                    Technology
                  </span>

                  <span className="sw-glance-value">
                    {epicModules.join(", ")}
                  </span>

                </div>

              </div>
            )}

            {/* =================================================
                SPECIALTIES
            ================================================= */}

            {specialties.length > 0 && (
              <div className="sw-glance-item">

                <div className="sw-glance-icon">
                   🎯
                </div>

                <div className="sw-glance-content">

                  <span className="sw-glance-label">
                    Area
                  </span>

                  <span className="sw-glance-value">
                    {specialties.join(", ")}
                  </span>

                </div>

              </div>
            )}

            {/* =================================================
                LANDMARK
            ================================================= */}

            {landmark && (
              <div className="sw-glance-item">

                <div className="sw-glance-icon">
                   💡
                </div>

                <div className="sw-glance-content">

                  <span className="sw-glance-label">
                    Key Insight
                  </span>

                  <span className="sw-glance-value">
                    {landmark}
                  </span>

                </div>

              </div>
            )}

            {/* =================================================
                STICKY NAVIGATION AREA

                ONLY THIS PART FOLLOWS THE SCREEN.
            ================================================= */}

            <div className="sw-sidebar-nav-sticky">

              {/* =================================================
                  JUMP TO
              ================================================= */}

              <div className="sw-sidebar-jump">

                <div className="sw-jump-title">
                  In This Article
                </div>

                <button
                  onClick={() =>
                    scrollTo("case-overview")
                  }
                >
                  <span>01</span>
                  Overview
                </button>

                {architectureImage && (
                  <button
                    onClick={() =>
                      scrollTo("architecture")
                    }
                  >
                    <span>02</span>
                    Architecture
                  </button>
                )}

                {article.backgrounds?.length > 0 && (
                  <button
                    onClick={() =>
                      scrollTo("background")
                    }
                  >
                    <span>03</span>
                    Background
                  </button>
                )}

                {eventTypes.length > 0 && (
                  <button
                    onClick={() =>
                      scrollTo("events")
                    }
                  >
                    <span>04</span>
                    Event Types
                  </button>
                )}

                {article.challenges?.length > 0 && (
                  <button
                    onClick={() =>
                      scrollTo("challenge")
                    }
                  >
                    <span>05</span>
                    Challenge
                  </button>
                )}

                {difficultFactors.length > 0 && (
                  <button
                    onClick={() =>
                      scrollTo("difficulty")
                    }
                  >
                    <span>06</span>
                    Complexity
                  </button>
                )}

                {workflowImage && (
                  <button
                    onClick={() =>
                      scrollTo("workflow")
                    }
                  >
                    <span>07</span>
                    Workflow
                  </button>
                )}

                {(article.intervention_intro ||
                  article.steps?.length > 0) && (
                  <button
                    onClick={() =>
                      scrollTo("execution")
                    }
                  >
                    <span>08</span>
                   The Approach
                  </button>
                )}

                {(article.results?.length > 0 ||
                  article.stats?.length > 0) && (
                  <button
                    onClick={() =>
                      scrollTo("results")
                    }
                  >
                    <span>09</span>
                    Outcomes
                  </button>
                )}

                {(article.my_role_intro ||
                  article.my_role_points?.length > 0) && (
                  <button
                    onClick={() =>
                      scrollTo("role")
                    }
                  >
                    <span>10</span>
                    My Contribution
                  </button>
                )}

                {article.client_said && (
                  <button
                    onClick={() =>
                      scrollTo("client")
                    }
                  >
                    <span>11</span>
                    Client Said
                  </button>
                )}

                {productImage && (
                  <button
                    onClick={() =>
                      scrollTo("product")
                    }
                  >
                    <span>12</span>
                    Product
                  </button>
                )}

                {(landmarkTitle ||
                  landmarkDescription) && (
                  <button
                    onClick={() =>
                      scrollTo("landmark")
                    }
                  >
                    <span>13</span>
                    Key Takeaway
                  </button>
                )}

              </div>

              {/* =================================================
                  CONTACT
              ================================================= */}

              <button
                className="sw-sidebar-contact"
                onClick={() =>
                  navigate("/contact")
                }
              >
                LET'S TALK ↗
              </button>

            </div>

          </div>

        </aside>

        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <main className="sw-content">

          {/* =================================================
              01 CASE STUDY TITLE
          ================================================= */}

          <section
            id="case-overview"
            className="sw-section sw-hero-section"
          >

            <div className="sw-eyebrow">
              Article
            </div>

            <h1 className="sw-main-title">
              {article.title}
            </h1>

            

            {filterTitle && (
              <div className="sw-filter-title">
                {filterTitle}
              </div>
            )}

            {article.subtitle && (
              <p className="sw-main-subtitle">
                {article.subtitle}
              </p>
            )}

            {article.landmark_banner && (
              <div className="sw-landmark-banner">
                {article.landmark_banner}
              </div>
            )}

          </section>

          {/* =================================================
              02 ARCHITECTURE
          ================================================= */}

          {architectureImage && (
            <section
              id="architecture"
              className="sw-section"
            >

              <div className="sw-section-heading">
                Architecture
              </div>

              <div className="sw-image-frame">

                <img
                  src={getUrl(
                    architectureImage
                  )}
                  alt="Architecture Illustration"
                />

                {architectureImage.caption && (
                  <div className="sw-image-caption">
                    {
                      architectureImage.caption
                    }
                  </div>
                )}

              </div>

            </section>
          )}

          {/* =================================================
              03 BACKGROUND
          ================================================= */}

          {article.backgrounds?.length > 0 && (
            <section
              id="background"
              className="sw-section"
            >

              <h2 className="sw-section-title">
                Background
              </h2>

              <div className="sw-text-stack">

                {article.backgrounds.map(
                  (text, index) => (
                    <div
                      className="sw-text-row"
                      key={index}
                    >

                      <span className="sw-text-index">
                        {String(
                          index + 1
                        ).padStart(2, "0")}
                      </span>

                      <p>
                        {text}
                      </p>

                    </div>
                  )
                )}

              </div>

            </section>
          )}

          {/* =================================================
              04 EVENT TYPES
          ================================================= */}

          {eventTypes.length > 0 && (
            <section
              id="events"
              className="sw-section"
            >

              <div className="sw-section-heading">
                Event Types
              </div>

              <div className="sw-event-list">

                {eventTypes.map(
                  (event, index) => (
                    <div
                      className="sw-event-row"
                      key={index}
                    >

                      <span>
                        {String(
                          index + 1
                        ).padStart(2, "0")}
                      </span>

                      <p>
                        {event}
                      </p>

                    </div>
                  )
                )}

              </div>

            </section>
          )}

          {/* =================================================
              05 CHALLENGE
          ================================================= */}

          {article.challenges?.length > 0 && (
            <section
              id="challenge"
              className="sw-section"
            >

              <h2 className="sw-section-title">
                The Challenge
              </h2>

              <div className="sw-challenge-list">

                {article.challenges.map(
                  (challenge, index) => (
                    <div
                      className="sw-challenge-item"
                      key={index}
                    >

                      <span>
                        {String(
                          index + 1
                        ).padStart(2, "0")}
                      </span>

                      <p>
                        {challenge}
                      </p>

                    </div>
                  )
                )}

              </div>

            </section>
          )}

          {/* =================================================
              06 DIFFICULTY
          ================================================= */}

          {difficultFactors.length > 0 && (
            <section
              id="difficulty"
              className="sw-section"
            >

              <h2 className="sw-section-title">
                The Complexity
              </h2>

              <div className="sw-difficulty-list">

                {difficultFactors.map(
                  (factor, index) => (
                    <div
                      className="sw-difficulty-row"
                      key={index}
                    >

                      <span>
                        {String(
                          index + 1
                        ).padStart(2, "0")}
                      </span>

                      <p>
                        {factor}
                      </p>

                    </div>
                  )
                )}

              </div>

            </section>
          )}

          {/* =================================================
              07 WORKFLOW
          ================================================= */}

          {workflowImage && (
            <section
              id="workflow"
              className="sw-section"
            >

              <div className="sw-section-heading">
                Workflow
              </div>

              <div className="sw-image-frame">

                <img
                  src={getUrl(
                    workflowImage
                  )}
                  alt="Workflow Diagram"
                />

                {workflowImage.caption && (
                  <div className="sw-image-caption">
                    {
                      workflowImage.caption
                    }
                  </div>
                )}

              </div>

            </section>
          )}

          {/* =================================================
              08 WHAT WAS DONE
          ================================================= */}

          {(article.intervention_intro ||
            article.steps?.length > 0) && (
            <section
              id="execution"
              className="sw-section"
            >

              <h2 className="sw-section-title">
                The Approach
              </h2>

              {article.intervention_intro && (
                <p className="sw-section-intro">
                  {
                    article.intervention_intro
                  }
                </p>
              )}

              {article.steps?.length > 0 && (
                <div className="sw-step-list">

                  {article.steps.map(
                    (step, index) => (
                      <div
                        className="sw-step-row"
                        key={index}
                      >

                        <div className="sw-step-number">
                          STEP {index + 1}
                        </div>

                        <div className="sw-step-content">
                          {step}
                        </div>

                      </div>
                    )
                  )}

                </div>
              )}

            </section>
          )}

          {/* =================================================
              09 RESULTS
          ================================================= */}

          {(article.results?.length > 0 ||
            article.stats?.length > 0) && (
            <section
              id="results"
              className="sw-section"
            >

              <h2 className="sw-section-title">
                Outcomes
              </h2>

              {article.stats?.length > 0 && (
                <div className="sw-stats">

                  {article.stats.map(
                    (stat, index) => (
                      <div
                        className="sw-stat"
                        key={index}
                      >

                        <strong>
                          {stat.number}
                        </strong>

                        <span>
                          {stat.label}
                        </span>

                      </div>
                    )
                  )}

                </div>
              )}

              {article.results?.length > 0 && (
                <div className="sw-results">

                  {article.results.map(
                    (result, index) => (
                      <div
                        className="sw-result-row"
                        key={index}
                      >

                        <div className="sw-result-icon">
                          {result?.icon || "✓"}
                        </div>

                        <p>
                          {result?.text ||
                            result}
                        </p>

                      </div>
                    )
                  )}

                </div>
              )}

            </section>
          )}

          {/* =================================================
              10 MY ROLE
          ================================================= */}

          {(article.my_role_intro ||
            article.my_role_points?.length > 0) && (
            <section
              id="role"
              className="sw-section sw-role-section"
            >

              <h2 className="sw-section-title">
                My Contribution
              </h2>

              {article.my_role_intro && (
                <p className="sw-section-intro">
                  {
                    article.my_role_intro
                  }
                </p>
              )}

              {article.my_role_points?.length > 0 && (
                <ul className="sw-role-list">

                  {article.my_role_points.map(
                    (point, index) => (
                      <li key={index}>

                        <span>
                          →
                        </span>

                        <p>
                          {point}
                        </p>

                      </li>
                    )
                  )}

                </ul>
              )}

            </section>
          )}

          {/* =================================================
              11 CLIENT
          ================================================= */}

          {article.client_said && (
            <section
              id="client"
              className="sw-section"
            >

              <h2 className="sw-section-title">
                What the Client Said?
              </h2>

              <div className="sw-client-quote">

                <div className="sw-quote-symbol">
                  “
                </div>

                <blockquote>
                  {article.client_said}
                </blockquote>

              </div>

            </section>
          )}

          {/* =================================================
              12 PRODUCT
          ================================================= */}

          {productImage && (
            <section
              id="product"
              className="sw-section"
            >

              <div className="sw-section-heading">
                Product Screenshot
              </div>

              <div className="sw-image-frame">

                <img
                  src={getUrl(
                    productImage
                  )}
                  alt="Product Screenshot"
                />

                {productImage.caption && (
                  <div className="sw-image-caption">
                    {
                      productImage.caption
                    }
                  </div>
                )}

              </div>

            </section>
          )}

          {/* =================================================
              13 LANDMARK
          ================================================= */}

          {(landmarkTitle ||
            landmarkDescription) && (
            <section
              id="landmark"
              className="sw-section sw-landmark-section"
            >

              <div className="sw-landmark-trophy">
                🏆
              </div>

              {landmarkTitle && (
                <h2 className="sw-landmark-title">
                  {landmarkTitle}
                </h2>
              )}

              {landmarkDescription && (
                <p className="sw-landmark-description">
                  {
                    landmarkDescription
                  }
                </p>
              )}

            </section>
          )}

          {/* =================================================
              MORE CASE STUDIES
              EXACTLY 3
          ================================================= */}

          {moreArticles.length > 0 && (
            <section
              className="sw-section sw-more-section"
            >

              <h2 className="sw-section-title">
                More Article
              </h2>

              <div className="sw-more-grid">

                {moreArticles.map(
                  (item, index) => (
                    <article
                      key={item.slug}
                      className="sw-more-card"
                      onClick={() =>
                        navigate(
                          `/articles/${encodeURIComponent(
                            item.slug
                          )}`
                        )
                      }
                    >

                      <div className="sw-more-number">
                        0{index + 1}
                      </div>

                      <div className="sw-more-body">

                        <h3>
                          {item.title}
                        </h3>

                        {item.subtitle && (
                          <p>
                            {item.subtitle}
                          </p>
                        )}

                      </div>

                      <div className="sw-more-link">
                        VIEW Artcile →
                      </div>

                    </article>
                  )
                )}

              </div>

            </section>
          )}

        </main>

      </div>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <Footer />

    </div>
  );
};

export default ArticleOpenPage;