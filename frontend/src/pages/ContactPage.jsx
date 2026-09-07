import React, { useEffect, useState } from "react";
import "../styles/contactPage.css";
import Footer from "../components/Footer";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  /* =====================================================
     ALWAYS START CONTACT PAGE FROM TOP
  ===================================================== */

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });

    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  /* =====================================================
     FORM CHANGE
  ===================================================== */

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* =====================================================
     FORM SUBMIT
  ===================================================== */

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Contact form:", formData);

    setSubmitted(true);

    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      subject: "",
      message: "",
    });

    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  return (
    <div className="contact-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="contact-hero">

        <div className="contact-hero-orb contact-orb-one"></div>
        <div className="contact-hero-orb contact-orb-two"></div>

        <div className="contact-hero-grid"></div>

        <div className="contact-hero-container">

          <div className="contact-hero-content">

            <h1>
              Let’s talk about
              <span> what’s next.</span>
            </h1>

            <p>
              Have a question, an idea, or a project in mind?
              Tell us what you’re working on and our team will
              get back to you within 24 hours.
            </p>

            <div className="contact-hero-bottom">

              <div className="hero-response">

                <div className="response-icon">
                  <span></span>
                </div>

                <div>
                  <small>AVERAGE RESPONSE</small>
                  <strong>Within 24 hours</strong>
                </div>

              </div>

              <div className="hero-email">

                <small>WRITE TO US</small>

                <a href="mailto:info@yuktic.com">
                  info@yuktic.com
                  <span>↗</span>
                </a>

              </div>

            </div>

          </div>

          <div className="contact-hero-side">

            <div className="hero-side-card">

              <div className="side-card-top">
                <span>01</span>
                <span>START HERE</span>
              </div>

              <div className="side-card-line"></div>

              <h3>
                Tell us a little
                <br />
                <em>about yourself.</em>
              </h3>

              <p>
                The more context you share, the better we can
                understand how to help.
              </p>

              <div className="side-arrow">
                ↓
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          MAIN CONTACT
      ===================================================== */}

      <section className="contact-main">

        <div className="contact-main-container">

          {/* =================================================
              CONTACT INFORMATION
          ================================================= */}

          <aside className="contact-info">

            <div className="info-label">
              GET IN TOUCH
            </div>

            <h2>
              Start a
              <br />
              <span>conversation.</span>
            </h2>

            <p className="info-intro">
              Whether you’re reaching out with a question,
              exploring an opportunity, or simply want to
              know more about Yuktic, we’re here to listen.
            </p>

            <div className="info-items">

              <div className="info-item">

                <div className="info-number">
                  01
                </div>

                <div className="info-item-content">

                  <small>EMAIL</small>

                  <a href="mailto:info@yuktic.com">
                    info@yuktic.com
                  </a>

                </div>

              </div>


              <div className="info-item">

                <div className="info-number">
                  02
                </div>

                <div className="info-item-content">

                  <small>RESPONSE TIME</small>

                  <strong>
                    Within 24 hours
                  </strong>

                </div>

              </div>


              <div className="info-item">

                <div className="info-number">
                  03
                </div>

                <div className="info-item-content">

                  <small>WHAT TO EXPECT</small>

                  <strong>
                    A thoughtful response
                  </strong>

                </div>

              </div>

            </div>


            <div className="info-highlight">

              <div className="highlight-mark">
                “
              </div>

              <p>
                Good conversations often lead to
                great things.
              </p>

            </div>

          </aside>


          {/* =================================================
              CONTACT FORM
          ================================================= */}

          <div className="contact-form-card">

            <div className="form-card-header">

              <div>

                <span>
                  SEND A MESSAGE
                </span>

                <h3>
                  How can we help?
                </h3>

              </div>

            </div>


            {submitted && (
              <div className="contact-success">

                <div className="success-icon">
                  ✓
                </div>

                <div>

                  <strong>
                    Thanks for reaching out.
                  </strong>

                  <p>
                    Your message has been received.
                    We’ll get back to you within 24 hours.
                  </p>

                </div>

              </div>
            )}


            <form onSubmit={handleSubmit}>

              {/* NAME + EMAIL */}

              <div className="form-row">

                <div className="form-field">

                  <label htmlFor="name">
                    <span>01</span>
                    Full name
                  </label>

                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />

                </div>


                <div className="form-field">

                  <label htmlFor="email">
                    <span>02</span>
                    Email address
                  </label>

                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                  />

                </div>

              </div>


              {/* PHONE + COMPANY */}

              <div className="form-row">

                <div className="form-field">

                  <label htmlFor="phone">
                    <span>03</span>
                    Phone number
                  </label>

                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 00000 00000"
                  />

                </div>


                <div className="form-field">

                  <label htmlFor="company">
                    <span>04</span>
                    Company
                  </label>

                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Your company"
                  />

                </div>

              </div>


              {/* SUBJECT */}

              <div className="form-field full-field">

                <label htmlFor="subject">
                  <span>05</span>
                  Subject
                </label>

                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    What would you like to discuss?
                  </option>

                  <option value="general">
                    General enquiry
                  </option>

                  <option value="services">
                    Our services
                  </option>

                  <option value="hiring">
                    Hiring & talent
                  </option>

                  <option value="project">
                    Project enquiry
                  </option>

                  <option value="support">
                    Support
                  </option>

                  <option value="other">
                    Something else
                  </option>

                </select>

              </div>


              {/* MESSAGE */}

              <div className="form-field full-field message-field">

                <label htmlFor="message">
                  <span>06</span>
                  Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us what’s on your mind..."
                  rows="7"
                  required
                ></textarea>

              </div>


              {/* SUBMIT */}

              <div className="form-submit-area">

                <div className="form-privacy">

                  <div className="privacy-symbol">
                    ✓
                  </div>

                  <p>
                    Your information is used only to
                    respond to your enquiry.
                  </p>

                </div>


                <button
                  type="submit"
                  className="contact-submit"
                >

                  <span>
                    Send message
                  </span>

                  <div className="submit-arrow">
                    ↗
                  </div>

                </button>

              </div>

            </form>

          </div>

        </div>

      </section>


      {/* =====================================================
          WHY REACH OUT
      ===================================================== */}

      <section className="contact-values">

        <div className="values-container">

          <div className="values-intro">

            <h2>
              One message can
              <br />
              <em>start something.</em>
            </h2>

          </div>


          <div className="values-grid">

            {/* CARD 01 */}

            <div className="value-card">

              <div className="value-card-top">

                <span className="value-number">
                  01
                </span>

                <div className="value-icon">
                  →
                </div>

              </div>

              <div className="value-card-content">

                <h3>
                  Clear answers
                </h3>

                <p>
                  Ask us anything. We’ll give you a
                  straightforward answer without
                  unnecessary complexity.
                </p>

              </div>

            </div>


            {/* CARD 02 */}

            <div className="value-card">

              <div className="value-card-top">

                <span className="value-number">
                  02
                </span>

                <div className="value-icon">
                  ↗
                </div>

              </div>

              <div className="value-card-content">

                <h3>
                  Real conversations
                </h3>

                <p>
                  Every enquiry is reviewed by a real
                  member of our team who understands
                  the context behind your message.
                </p>

              </div>

            </div>


            {/* CARD 03 */}

            <div className="value-card">

              <div className="value-card-top">

                <span className="value-number">
                  03
                </span>

                <div className="value-icon">
                  ✦
                </div>

              </div>

              <div className="value-card-content">

                <h3>
                  Fast response
                </h3>

                <p>
                  We aim to respond to every genuine
                  enquiry within 24 hours.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="contact-final">

        <div className="final-decoration"></div>

        <div className="contact-final-container">

          <div className="final-copy">

            <h2>
              Just say
              <br />
              <em>hello.</em>
            </h2>

          </div>


          <div className="final-right">

            <p>
              No complicated process.
              No unnecessary steps.
              Just send us a message.
            </p>

            <a
              href="mailto:info@yuktic.com"
              className="final-email"
            >

              <span>
                info@yuktic.com
              </span>

              <strong>
                ↗
              </strong>

            </a>

          </div>

        </div>

        <br />
        <br />
        <br />

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <Footer />

    </div>
  );
};

export default ContactPage;