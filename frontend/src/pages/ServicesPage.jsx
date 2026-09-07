
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../styles/servicesPage.css";
import Footer from "../components/Footer";

const ServicesPage = () => {
  const location = useLocation();

  /*
   * Always start /services from the top.
   *
   * If the URL contains #contact, we do NOT force
   * the page to the top because the anchor should work.
   */
  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });
    }
  }, [location.pathname, location.hash]);

  return (
    <main className="services-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="services-hero">

        <div className="services-hero-pattern"></div>

        <div className="services-hero-orbit services-orbit-one"></div>
        <div className="services-hero-orbit services-orbit-two"></div>
        <div className="services-hero-orbit services-orbit-three"></div>

        <div className="services-hero-corner services-corner-one"></div>
        <div className="services-hero-corner services-corner-two"></div>

        <div className="services-hero-inner">

          <span className="services-hero-kicker">
            YUKTIC / SERVICES
          </span>

          <h1>
            Technology
            <br />
            <span>built around you.</span>
          </h1>

          <p>
            We combine strategy, design and technology to create
            digital products, platforms and experiences that help
            businesses move forward.
          </p>

          <a
            href="/services#contact"
            className="services-cta-button"
          >
            <span>Start a Conversation</span>

            <strong>
              ↗
            </strong>
          </a>

          <div className="services-hero-navigation">

            <span>
              DIGITAL STRATEGY
            </span>

            <span>
              PRODUCT
            </span>

            <span>
              TECHNOLOGY
            </span>

            <span>
              EXPERIENCE
            </span>

          </div>

        </div>

      </section>


      {/* =====================================================
          SERVICES INTRO
      ===================================================== */}

      <section className="services-intro">

        <div className="services-intro-pattern"></div>

        <div className="services-intro-container">

          <div className="services-intro-heading">

            <span className="services-label">
              WHAT WE DO
            </span>

            <h2>
              From complex
              <br />
              <span>to possible.</span>
            </h2>

          </div>

          <div className="services-intro-text">

            <p>
              Technology should make business simpler, not more
              complicated. We bring strategy, creativity and
              engineering together to solve meaningful problems.
            </p>

            <p>
              Whether you are starting something new or improving
              something that already exists, we help turn ideas
              into products that work in the real world.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          SERVICES GRID
      ===================================================== */}

      <section className="services-grid-section">

        <div className="services-grid-container">

          <div className="services-section-heading">

            <h2>
              What We
              <br />
              <span>Can Build Together.</span>
            </h2>

          </div>


          <div className="services-grid">


            {/* DIGITAL STRATEGY */}

            <article className="service-card service-card-large service-card-blue">

              <div className="service-card-background">
                <span>STRATEGY</span>
              </div>

              <div className="service-card-top">

                <span className="service-card-category">
                  DIGITAL STRATEGY
                </span>

                <span className="service-card-arrow">
                  ↗
                </span>

              </div>

              <div className="service-card-content">

                <h3>
                  Direction before
                  <br />
                  development.
                </h3>

                <p>
                  We help businesses understand where to go,
                  what to build and why it matters before
                  investing in execution.
                </p>

              </div>

              <div className="service-card-footer">

                <span>
                  Research
                </span>

                <span>
                  Product Strategy
                </span>

                <span>
                  Roadmaps
                </span>

              </div>

            </article>


            {/* PRODUCT */}

            <article className="service-card service-card-green">

              <div className="service-card-background">
                <span>PRODUCT</span>
              </div>

              <div className="service-card-top">

                <span className="service-card-category">
                  PRODUCT
                </span>

                <span className="service-card-arrow">
                  ↗
                </span>

              </div>

              <div className="service-card-content">

                <h3>
                  Products people
                  <br />
                  want to use.
                </h3>

                <p>
                  From first concept to launch, we create
                  thoughtful digital products designed around
                  real users and real business needs.
                </p>

              </div>

              <div className="service-card-footer">

                <span>
                  UX / UI
                </span>

                <span>
                  Product Design
                </span>

                <span>
                  Prototyping
                </span>

              </div>

            </article>


            {/* TECHNOLOGY */}

            <article className="service-card service-card-dark">

              <div className="service-card-background">
                <span>TECH</span>
              </div>

              <div className="service-card-top">

                <span className="service-card-category">
                  TECHNOLOGY
                </span>

                <span className="service-card-arrow">
                  ↗
                </span>

              </div>

              <div className="service-card-content">

                <h3>
                  Engineering built
                  <br />
                  for what's next.
                </h3>

                <p>
                  Scalable applications, platforms and
                  technical systems engineered to perform
                  today and adapt tomorrow.
                </p>

              </div>

              <div className="service-card-footer">

                <span>
                  Web
                </span>

                <span>
                  Cloud
                </span>

                <span>
                  Platforms
                </span>

              </div>

            </article>


            {/* EXPERIENCE */}

            <article className="service-card service-card-orange">

              <div className="service-card-background">
                <span>EXPERIENCE</span>
              </div>

              <div className="service-card-top">

                <span className="service-card-category">
                  EXPERIENCE
                </span>

                <span className="service-card-arrow">
                  ↗
                </span>

              </div>

              <div className="service-card-content">

                <h3>
                  Experiences that
                  <br />
                  feel effortless.
                </h3>

                <p>
                  We design clear, intuitive experiences that
                  make technology easier and more enjoyable
                  for the people using it.
                </p>

              </div>

              <div className="service-card-footer">

                <span>
                  UX
                </span>

                <span>
                  Interaction
                </span>

                <span>
                  Design Systems
                </span>

              </div>

            </article>


            {/* CONSULTING */}

            <article className="service-card service-card-wide">

              <div className="service-card-background">
                <span>ADVISORY</span>
              </div>

              <div className="service-card-top">

                <span className="service-card-category">
                  CONSULTING
                </span>

                <span className="service-card-arrow">
                  ↗
                </span>

              </div>

              <div className="service-card-wide-content">

                <h3>
                  Need a clearer
                  <br />
                  technology direction?
                </h3>

                <p>
                  We work alongside leadership and product teams
                  to identify opportunities, improve digital
                  operations and create a practical technology
                  strategy.
                </p>

              </div>

              <div className="service-card-wide-line"></div>

            </article>

          </div>

        </div>

      </section>


      {/* =====================================================
          HOW WE WORK
      ===================================================== */}

      <section className="services-process">

        <div className="process-pattern"></div>

        <div className="process-glow process-glow-one"></div>
        <div className="process-glow process-glow-two"></div>

        <div className="process-container">

          <div className="process-intro">

            <span className="process-label">
              HOW WE WORK
            </span>

            <h2>
              Simple process.
              <br />
              <span>Serious outcomes.</span>
            </h2>

            <p>
              We keep the process collaborative, transparent and
              focused on solving the right problem before building
              the solution.
            </p>

          </div>


          <div className="services-process-list">


            {/* DISCOVER */}

            <div className="process-row">

              <div className="process-word">
                DISCOVER
              </div>

              <div className="process-description">

                <h3>
                  Understand the problem.
                </h3>

                <p>
                  We learn about your business, users, challenges
                  and opportunities before defining the direction.
                </p>

              </div>

              <div className="process-arrow">
                ↗
              </div>

            </div>


            {/* DEFINE */}

            <div className="process-row">

              <div className="process-word">
                DEFINE
              </div>

              <div className="process-description">

                <h3>
                  Find the right direction.
                </h3>

                <p>
                  Strategy, research and planning come together
                  to establish a clear and practical roadmap.
                </p>

              </div>

              <div className="process-arrow">
                ↗
              </div>

            </div>


            {/* CREATE */}

            <div className="process-row">

              <div className="process-word">
                CREATE
              </div>

              <div className="process-description">

                <h3>
                  Design and build.
                </h3>

                <p>
                  Our designers and engineers turn the strategy
                  into a functional and meaningful digital product.
                </p>

              </div>

              <div className="process-arrow">
                ↗
              </div>

            </div>


            {/* EVOLVE */}

            <div className="process-row">

              <div className="process-word">
                EVOLVE
              </div>

              <div className="process-description">

                <h3>
                  Keep making it better.
                </h3>

                <p>
                  Launch is only the beginning. We use data,
                  feedback and iteration to continuously improve.
                </p>

              </div>

              <div className="process-arrow">
                ↗
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          CAPABILITIES
      ===================================================== */}

      <section className="services-capabilities">

        <div className="capabilities-container">

          <div className="capabilities-heading">

            <span className="services-label">
              OUR CAPABILITIES
            </span>

            <h2>
              One team.
              <br />
              <span>Many disciplines.</span>
            </h2>

          </div>


          <div className="capabilities-content">

            <div className="capability-column">

              <span>
                STRATEGY
              </span>

              <p>
                Digital transformation
              </p>

              <p>
                Product strategy
              </p>

              <p>
                Technology consulting
              </p>

              <p>
                Discovery workshops
              </p>

            </div>


            <div className="capability-column">

              <span>
                DESIGN
              </span>

              <p>
                UX research
              </p>

              <p>
                UI design
              </p>

              <p>
                Design systems
              </p>

              <p>
                Prototyping
              </p>

            </div>


            <div className="capability-column">

              <span>
                ENGINEERING
              </span>

              <p>
                Web applications
              </p>

              <p>
                Cloud platforms
              </p>

              <p>
                API development
              </p>

              <p>
                System integration
              </p>

            </div>


            <div className="capability-column">

              <span>
                EXPERIENCE
              </span>

              <p>
                Digital experiences
              </p>

              <p>
                Product interfaces
              </p>

              <p>
                Interaction design
              </p>

              <p>
                Design language
              </p>

            </div>

          </div>

        </div>

        <br />
        <br />
        <br />
        <br />
        <br />

      </section>


      {/* =====================================================
          CONTACT CTA
      ===================================================== */}

      <section
        className="services-contact"
        id="contact"
      >

        <div className="contact-pattern"></div>

        <div className="contact-ring contact-ring-one"></div>
        <div className="contact-ring contact-ring-two"></div>

        <div className="services-contact-content">

          <h2>
            Let's build something
            <br />
            <span>worth building.</span>
          </h2>

          <p>
            Tell us what you're working on, where you want to go
            and what needs to change. We'll figure out the next
            step together.
          </p>

          <a
            href="/contact"
            className="contact-button"
          >
            <span>
              Start a Conversation
            </span>

            <strong>
              ↗
            </strong>
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

export default ServicesPage;


