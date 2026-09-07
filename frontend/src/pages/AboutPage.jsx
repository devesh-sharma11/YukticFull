import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import "../styles/aboutPage.css";
import Footer from "../components/Footer";

const AboutPage = () => {
  const pageRef = useRef(null);

  const API = import.meta.env.VITE_API_URL;

  const [featuredTestimonial, setFeaturedTestimonial] = useState(null);

  /*
   * =========================================================
   * ALWAYS START ABOUT PAGE FROM TOP
   * =========================================================
   *
   * useLayoutEffect runs before the browser paints the page.
   * This prevents the "middle of page" flash when navigating
   * from another route.
   */
  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    window.scrollTo(0, 0);

    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    /*
     * Extra reset after browser/router has had a chance
     * to restore the previous scroll position.
     */
    const frame1 = requestAnimationFrame(() => {
      window.scrollTo(0, 0);

      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });

    const frame2 = requestAnimationFrame(() => {
      window.scrollTo(0, 0);

      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });

    return () => {
      cancelAnimationFrame(frame1);
      cancelAnimationFrame(frame2);

      /*
       * Let browser handle normal restoration after leaving
       * this page.
       */
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

    fetchFeaturedTestimonial();
  }, [API]);

  /*
   * =========================================================
   * SCROLL REVEAL ANIMATION
   * =========================================================
   */
  useEffect(() => {
    const page = pageRef.current;

    if (!page) return;

    /*
     * Give animation system a moment to initialise.
     * This prevents the page from becoming blank if JS
     * takes a moment to attach the classes.
     */
    page.classList.add("about-animation-ready");

    /*
     * Elements that should animate when entering viewport.
     */
    const revealElements = page.querySelectorAll(
      [
        ".our-story-section .story-heading",
        ".our-story-section .story-text",
        ".our-story-section .story-stat",

        ".featured-testimonial-section .featured-testimonial-header",
        ".featured-testimonial-section .featured-testimonial-card",

        ".mission-section .mission-intro",
        ".mission-section .mission-card",

        ".values-section .values-heading",
        ".values-section .value-card",

        ".thinking-section .thinking-intro",
        ".thinking-section .thinking-process-item",

        ".about-cta .about-eyebrow",
        ".about-cta h2",
        ".about-cta p",
        ".about-cta .cta-button",
      ].join(",")
    );

    /*
     * Add animation class.
     */
    revealElements.forEach((element) => {
      element.classList.add("about-reveal");
    });

    /*
     * Hero is intentionally handled separately.
     * It should animate immediately when page loads.
     */
    const heroContent = page.querySelector(".about-hero-content");
    const heroVisual = page.querySelector(".about-hero-visual");

    if (heroContent) {
      heroContent.classList.add("about-hero-load");
    }

    if (heroVisual) {
      heroVisual.classList.add("about-hero-load-visual");
    }

    /*
     * Intersection Observer
     */
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("about-reveal-visible");

            /*
             * Once visible, stop observing.
             *
             * This means the animation happens once instead
             * of replaying every time you scroll up/down.
             */
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -70px 0px",
      }
    );

    revealElements.forEach((element) => {
      observer.observe(element);
    });

    /*
     * =======================================================
     * STAGGER CARDS
     * =======================================================
     */

    const storyStats = page.querySelectorAll(".story-stat");

    storyStats.forEach((item, index) => {
      item.style.setProperty(
        "--about-delay",
        `${index * 0.10}s`
      );
    });

    const missionCards = page.querySelectorAll(".mission-card");

    missionCards.forEach((item, index) => {
      item.style.setProperty(
        "--about-delay",
        `${index * 0.12}s`
      );
    });

    const valueCards = page.querySelectorAll(".value-card");

    valueCards.forEach((item, index) => {
      item.style.setProperty(
        "--about-delay",
        `${index * 0.09}s`
      );
    });

    const thinkingItems = page.querySelectorAll(
      ".thinking-process-item"
    );

    thinkingItems.forEach((item, index) => {
      item.style.setProperty(
        "--about-delay",
        `${index * 0.11}s`
      );
    });

    /*
     * =======================================================
     * CLEANUP
     * =======================================================
     */
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <main
      ref={pageRef}
      className="about-page"
    >

      {/* =====================================================
          ABOUT HERO
      ===================================================== */}
      <section className="about-hero">

        {/* Decorative shapes */}
        <div className="about-orb about-orb-green"></div>
        <div className="about-orb about-orb-blue"></div>
        <div className="about-orb about-orb-orange"></div>


        {/* =====================================================
            LEFT CONTENT
        ===================================================== */}
        <div className="about-hero-content">

          <h1>
            Building ideas.
            <br />
            <span>Creating impact.</span>
          </h1>

          <p>
            We are Yuktic — a technology and innovation-driven company
            focused on creating meaningful digital solutions that help
            businesses grow, evolve and move forward.
          </p>

          <div className="about-hero-buttons">

            <a
              href="/contact"
              className="about-primary-btn"
            >
              Discover Our Story
              <span>↗</span>
            </a>

            <a
              href="/services"
              className="about-secondary-btn"
            >
              Our Service
            </a>

          </div>

        </div>


        {/* =====================================================
            RIGHT VISUAL
        ===================================================== */}
        <div className="about-hero-visual">

          <div className="about-visual-card">

            <div className="visual-card-top">

              <span className="visual-dot"></span>

              <span>
                Yuktic
              </span>

            </div>


            <div className="visual-circle">

              <div className="visual-circle-inner">
                <span>☘︎</span>
              </div>

            </div>


            <div className="visual-bottom">

              <strong>
                Think.
              </strong>

              <strong>
                Build.
              </strong>

              <strong>
                Grow.
              </strong>

            </div>

          </div>


          {/* Floating badges */}

          <div className="floating-badge badge-green">
            Innovation
          </div>

          <div className="floating-badge badge-blue">
            Technology
          </div>

          <div className="floating-badge badge-orange">
            Impact
          </div>

        </div>

      </section>


      {/* =====================================================
          OUR STORY
      ===================================================== */}
      <section
        className="our-story-section"
        id="our-story"
      >

        <div className="story-container">

          <div className="story-content">

            {/* Story heading */}

            <div className="story-heading">

              <h2>
                From Ideas
                <br />
                <span>To Real Impact.</span>
              </h2>

            </div>


            {/* Story text */}

            <div className="story-text">

              <p>
                Yuktic is a technology partner built around clarity,
                technical capability and execution. We help businesses
                turn complex technology challenges into practical
                solutions that create measurable value and support
                long-term growth.
              </p>

              <p>
                Our capabilities span software engineering, technology
                consulting, solution delivery, staff augmentation and
                product development. We bring the right combination of
                people, technology and delivery expertise to meet each
                client's unique business needs.
              </p>

              <p>
                Whether you need to transform an idea into a working
                product, strengthen your engineering team, modernize
                technology platforms or deliver a focused solution,
                Yuktic works alongside you from idea to execution to
                scale, with a clear focus on quality, flexibility and
                lasting impact.
              </p>

            </div>

          </div>


{/* =====================================================
    FEATURED TESTIMONIAL
===================================================== */}

{featuredTestimonial && (
  <section
    className="featured-testimonial-section"
    id="featured-testimonial"
  >
    <div className="featured-testimonial-container">

      {/* =================================================
          SECTION TITLE
      ================================================= */}

      <div className="featured-testimonial-heading">

        

        <h2>
          Featured Testimonial
          <br />
          <span>From Our Trusted Clients.</span>
        </h2>

      </div>


      {/* =================================================
          TESTIMONIAL CONTENT
      ================================================= */}

      <div className="featured-testimonial-content">

        {/* LEFT — MESSAGE */}

        <div className="featured-testimonial-left">

          <div className="featured-testimonial-quote-mark">
            “
          </div>

          <blockquote>
            {featuredTestimonial.testimonial}
          </blockquote>

        </div>


        {/* RIGHT — CLIENT */}

        <div className="featured-testimonial-right">

          <span className="featured-testimonial-client-label">
            FEATURED CLIENT
          </span>


          {/* Rating */}

          <div className="featured-testimonial-stars">

            {Array.from(
              { length: 5 },
              (_, index) => (
                <span
                  key={index}
                  className={
                    index <
                    Number(featuredTestimonial.rating || 0)
                      ? "active"
                      : ""
                  }
                >
                  ★
                </span>
              )
            )}

          </div>


          {/* Client information */}

          <div className="featured-testimonial-client">

            <div className="featured-testimonial-avatar">

              {featuredTestimonial.avatar ? (
                featuredTestimonial.avatar.startsWith("http") ? (
                  <img
                    src={featuredTestimonial.avatar}
                    alt={featuredTestimonial.name}
                  />
                ) : (
                  <span>
                    {featuredTestimonial.avatar}
                  </span>
                )
              ) : (
                <span>
                  {featuredTestimonial.name
                    ?.charAt(0)
                    ?.toUpperCase()}
                </span>
              )}

            </div>


            <div className="featured-testimonial-client-info">

              <h3>
                {featuredTestimonial.name}
              </h3>

              {featuredTestimonial.designation && (
                <p>
                  {featuredTestimonial.designation}
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
              STORY STATS
          ===================================================== */}

          <div className="story-stats">

            <div className="story-stat">

              <span className="stat-text">
                Think beyond
                <br />
                boundaries
              </span>

            </div>


            <div className="story-stat">

              <span className="stat-text">
                Build with
                <br />
                purpose
              </span>

            </div>


            <div className="story-stat">

              <span className="stat-text">
                Create lasting
                <br />
                impact
              </span>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          MISSION + VISION
      ===================================================== */}
      <section className="mission-section">

        <div className="mission-container">

          <div className="mission-intro">

            <h2>
              Purpose 
              <br />
              <span>Behind Every Solution.</span>
            </h2>

          </div>
<br/><br/><br/><br/>




          <div className="mission-grid">

            {/* MISSION */}

            <article className="mission-card mission-card-green">

              <div className="mission-card-glow"></div>

              <div className="mission-card-grid"></div>

              <div className="mission-card-top">

                <div className="mission-card-symbol">
                  ✦
                </div>

                <span className="mission-card-label">
                  MISSION
                </span>

                <div className="mission-card-arrow">
                  ↗
                </div>

              </div>


              <div className="mission-card-content">

                <h3>
                  Our Mission
                </h3>

                <p>
                  To empower businesses with innovative technology
                  solutions that simplify complexity, unlock growth
                  and create measurable value.
                </p>

              </div>


              <div className="mission-card-ghost">
                MISSION
              </div>

              <div className="mission-card-line"></div>

            </article>


            {/* VISION */}

            <article className="mission-card mission-card-blue">

              <div className="mission-card-glow"></div>

              <div className="mission-card-grid"></div>

              <div className="mission-card-top">

                <div className="mission-card-symbol">
                  ◌
                </div>

                <span className="mission-card-label">
                  VISION
                </span>

                <div className="mission-card-arrow">
                  ↗
                </div>

              </div>


              <div className="mission-card-content">

                <h3>
                  Our Vision
                </h3>

                <p>
                  To create a future where technology, people and ideas
                  come together to build a smarter, more connected world.
                </p>

              </div>


              <div className="mission-card-ghost">
                VISION
              </div>

              <div className="mission-card-line"></div>

            </article>

          </div>

        </div>

      </section>


      {/* =====================================================
          OUR VALUES
      ===================================================== */}
      <section
        className="values-section"
        id="our-values"
      >

        <div className="values-container">

          <div className="values-heading">

            <div className="values-heading-left">

              <h2>
                The Way
                <span> We Work.</span>
              </h2>

            </div>


            <p>
              Our values shape how we think, how we collaborate and
              how we create solutions for the people and businesses
              we work with.
            </p>

          </div>


          <div className="values-grid">

            {/* VALUE 01 */}

            <article className="value-card">

              <div className="value-number">
                01
              </div>

              <div className="value-icon green-icon">
                ✦
              </div>

              <h3>
                Innovation
              </h3>

              <p>
                We challenge conventional thinking and constantly
                search for smarter ways to solve problems.
              </p>

            </article>


            {/* VALUE 02 */}

            <article className="value-card value-card-highlight">

              <div className="value-number">
                02
              </div>

              <div className="value-icon blue-icon">
                ↗
              </div>

              <h3>
                Growth
              </h3>

              <p>
                We create solutions designed not only for today,
                but for long-term progress and scalability.
              </p>

            </article>


            {/* VALUE 03 */}

            <article className="value-card">

              <div className="value-number">
                03
              </div>

              <div className="value-icon orange-icon">
                ♡
              </div>

              <h3>
                People First
              </h3>

              <p>
                Technology is meaningful when it improves experiences
                and creates genuine value for people.
              </p>

            </article>


            {/* VALUE 04 */}

            <article className="value-card">

              <div className="value-number">
                04
              </div>

              <div className="value-icon green-icon">
                ∞
              </div>

              <h3>
                Integrity
              </h3>

              <p>
                We believe in transparent relationships, responsible
                decisions and doing the right thing.
              </p>

            </article>

          </div>

        </div>

      </section>


      {/* =====================================================
          HOW WE THINK
      ===================================================== */}
      <section className="thinking-section">

        <div className="thinking-container">

          {/* LEFT */}

          <div className="thinking-intro">

            <h2>
              Ideas are only
              <br />
              <span>the beginning.</span>
            </h2>

            <p>
              Great products are created when strategy, design,
              technology and people move in the same direction.
            </p>

          </div>


          {/* RIGHT */}

          <div className="thinking-process">

            {/* PROCESS 01 */}

            <article className="thinking-process-item">

              <div className="thinking-process-number">
                01
              </div>

              <div className="thinking-process-line"></div>

              <div className="thinking-process-content">

                <div className="thinking-process-top">
                  <span>DISCOVER</span>
                </div>

                <h3>
                  Understand
                </h3>

                <p>
                  We start by understanding the real challenge,
                  the people behind it and the opportunity waiting
                  to be discovered.
                </p>

              </div>

            </article>


            {/* PROCESS 02 */}

            <article className="thinking-process-item">

              <div className="thinking-process-number">
                02
              </div>

              <div className="thinking-process-line"></div>

              <div className="thinking-process-content">

                <div className="thinking-process-top">
                  <span>EXPLORE</span>
                </div>

                <h3>
                  Imagine
                </h3>

                <p>
                  We challenge assumptions, explore possibilities
                  and find a smarter direction before we start
                  building.
                </p>

              </div>

            </article>


            {/* PROCESS 03 */}

            <article className="thinking-process-item">

              <div className="thinking-process-number">
                03
              </div>

              <div className="thinking-process-line"></div>

              <div className="thinking-process-content">

                <div className="thinking-process-top">
                  <span>CREATE</span>
                </div>

                <h3>
                  Create
                </h3>

                <p>
                  We turn the strongest ideas into practical,
                  scalable solutions designed to create lasting
                  value.
                </p>

              </div>

            </article>

          </div>

        </div>

      </section>


      {/* =====================================================
          CTA
      ===================================================== */}
      <section className="about-cta">

        <div className="cta-shape cta-shape-one"></div>

        <div className="cta-shape cta-shape-two"></div>


        <div className="cta-content">

          <span className="about-eyebrow">
            LET'S BUILD TOGETHER
          </span>

          <h2>
            Have an idea?
            <br />
            <span>Let's make it happen.</span>
          </h2>

          <p>
            Let's create something meaningful, innovative and
            built to make an impact.
          </p>

          <a
            href="/contact"
            className="cta-button"
          >
            Start a Conversation
            <span>↗</span>
          </a>

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <Footer />

    </main>
  );
};

export default AboutPage;

