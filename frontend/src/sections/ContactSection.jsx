import React, { useState } from 'react';
import leafImg from '../assets/leaf.png';
import '../styles/contactSection.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Other',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  /* =====================================================
     FORM CHANGE
  ===================================================== */

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));

    if (error) {
      setError('');
    }
  };

  /* =====================================================
     FORM SUBMIT
  ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    setSubmitted(false);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          subject: formData.subject || 'Other',
          message: formData.message.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail ||
          data?.message ||
          'Failed to submit enquiry.'
        );
      }

      console.log('Contact form submitted successfully:', data);

      setSubmitted(true);

      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'Other',
        message: ''
      });

      setTimeout(() => {
        setSubmitted(false);
      }, 5000);

    } catch (err) {
      console.error('Contact form submission error:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.'
      );

    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="contact-section" id="contact">

      {/* Ambient Leaf Background */}
      {/* <div className="contact-leaf-decor" aria-hidden="true">
        <img src={leafImg} alt="" className="leaf-bg-image" />
      </div> */}

      {/* TOP CENTERED HEADER */}

      <div className="contact-header-center">

        <span className="contact-main-eyebrow">
          ☘︎ GET IN TOUCH
        </span>

        <h2 className="contact-main-title">
          CONNECT WITH OUR TEAM
        </h2>

        <p className="contact-main-subtitle">
          Discover how our specialized engineering and advisory teams empower modern enterprises and healthcare providers.
        </p>

      </div>

      <div className="contact-container">

        {/* =====================================================
            LEFT SIDE
        ===================================================== */}

        <div className="contact-info-panel">

          <div className="contact-eyebrow">
            <span className="eyebrow-dot"></span>
            Global Collaborations
          </div>

          <h3 className="contact-heading">
            Let’s build something{' '}
            <span className="highlight-text2">
              impactful
            </span>{' '}
            together.
          </h3>

          <div className="heading-line contact-line"></div>

          <p className="contact-desc">
            Have an architectural vision, enterprise requirements, or a high-impact engineering challenge? Let's turn complex systems into robust reality.
          </p>

          <div className="contact-meta-grid">

            <div className="meta-card">
              <span className="meta-label">
                Location
              </span>

              <span className="meta-val">
                Worldwide
              </span>
            </div>

            <div className="meta-card">
              <span className="meta-label">
                Turnaround
              </span>

              <span className="meta-val">
                &lt; 24h Response
              </span>
            </div>

            <div className="meta-card">
              <span className="meta-label">
                Engagement
              </span>

              <span className="meta-val">
                Contract / Consulting
              </span>
            </div>

            <div className="meta-card">
              <span className="meta-label">
                Timezones
              </span>

              <span className="meta-val">
                BST / GMT & IST Compatible
              </span>
            </div>

            <div className="meta-card meta-card-full">

              <span className="meta-label">
                Direct Channel
              </span>

              <a
                href="mailto:info@yuktic.com"
                className="meta-link"
              >
                info@yuktic.com

                <span className="link-arrow">
                  ↗
                </span>
              </a>

            </div>

          </div>

        </div>


        {/* =====================================================
            RIGHT SIDE FORM
        ===================================================== */}

        <div className="contact-card">

          <div className="card-glass-glow"></div>

          {/* SUCCESS MESSAGE */}

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


          {/* ERROR MESSAGE */}

          {error && (
            <div
              className="contact-error"
              role="alert"
            >
              <strong>
                Unable to send your message.
              </strong>

              <p>
                {error}
              </p>
            </div>
          )}


          <form
            className="contact-form"
            onSubmit={handleSubmit}
          >

            {/* =================================================
                NAME
            ================================================= */}

            <div className="form-group">

              <label
                htmlFor="name"
                className="form-label"
              >
                Full Name
              </label>

              <div className="input-wrapper">

                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  placeholder="Alex Morgan"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  autoComplete="name"
                  disabled={submitting}
                />

              </div>

            </div>


            {/* =================================================
                EMAIL
            ================================================= */}

            <div className="form-group">

              <label
                htmlFor="email"
                className="form-label"
              >
                Email Address
              </label>

              <div className="input-wrapper">

                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="alex@enterprise.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  autoComplete="email"
                  disabled={submitting}
                />

              </div>

            </div>


            {/* =================================================
                PHONE
            ================================================= */}

            <div className="form-group">

              <label
                htmlFor="phone"
                className="form-label"
              >
                Phone Number
              </label>

              <div className="input-wrapper">

                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  placeholder="+91 99999 99999"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-input"
                  autoComplete="tel"
                  disabled={submitting}
                />

              </div>

            </div>


            {/* =================================================
                SUBJECT
            ================================================= */}

            <div className="form-group">

              <label
                htmlFor="subject"
                className="form-label"
              >
                Subject
              </label>

              <div className="input-wrapper select-wrapper">

                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="form-input form-select"
                  required
                  disabled={submitting}
                >

                  <option value="Fixed Cost">
                    Fixed Cost
                  </option>

                  <option value="Time & Material">
                    Time & Material
                  </option>

                  <option value="Staff Augmentation">
                    Staff Augmentation
                  </option>

                  <option value="Recruitment">
                    Recruitment
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

                <span className="select-arrow">
                  ▼
                </span>

              </div>

            </div>


            {/* =================================================
                MESSAGE
            ================================================= */}

            <div className="form-group">

              <label
                htmlFor="message"
                className="form-label"
              >
                Message
              </label>

              <div className="input-wrapper">

                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  required
                  placeholder="Tell us about your project or inquiry..."
                  value={formData.message}
                  onChange={handleChange}
                  className="form-input form-textarea"
                  disabled={submitting}
                ></textarea>

              </div>

            </div>


            {/* =================================================
                SUBMIT
            ================================================= */}

            <button
              type="submit"
              className="contact-submit-btn"
              disabled={submitting}
            >

              <span>
                {submitting
                  ? 'Sending...'
                  : 'Send Message'}
              </span>

              <span className="btn-arrow">
                {submitting ? '...' : '→'}
              </span>

            </button>

          </form>

        </div>

      </div>

    </section>
  );
};

export default ContactSection;