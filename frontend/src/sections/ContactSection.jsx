
import React, { useState } from 'react';
import leafImg from '../assets/leaf.png';
import '../styles/contactSection.css';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'HealthTech / EHR',
    message: ''
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.group('--- New Project Consultation Request ---');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Full Name:', formData.name);
    console.log('Email Address:', formData.email);
    console.log('Phone Number:', formData.phone);
    console.log('Selected Service:', formData.service);
    console.log('Message Body:', formData.message);
    console.groupEnd();
  };

  return (
    <section className="contact-section" id="contact">
      {/* Ambient Leaf Background */}
      {/* <div className="contact-leaf-decor" aria-hidden="true">
        <img src={leafImg} alt="" className="leaf-bg-image" />
      </div> */}

      {/* TOP CENTERED HEADER */}
      <div className="contact-header-center">
        <span className="contact-main-eyebrow">☘︎ GET IN TOUCH</span>
        <h2 className="contact-main-title">CONNECT WITH OUR TEAM</h2>
        <p className="contact-main-subtitle">
          Discover how our specialized engineering and advisory teams empower modern enterprises and healthcare providers.
        </p>
      </div>

      <div className="contact-container">
        
        {/* Left Side: Typography, Badges & Global Reach */}
        <div className="contact-info-panel">
          <div className="contact-eyebrow">
            <span className="eyebrow-dot"></span>
            Global Collaborations
          </div>
          
          <h3 className="contact-heading">
            Let’s build something <span className="highlight-text2">impactful</span> together.
          </h3>
          
          <div className="heading-line contact-line"></div>

          <p className="contact-desc">
            Have an architectural vision, enterprise requirements, or a high-impact engineering challenge? Let's turn complex systems into robust reality.
          </p>

          <div className="contact-meta-grid">
            <div className="meta-card">
              <span className="meta-label">Location</span>
              <span className="meta-val">Worldwide</span>
            </div>
            <div className="meta-card">
              <span className="meta-label">Turnaround</span>
              <span className="meta-val">&lt; 24h Response</span>
            </div>
            <div className="meta-card">
              <span className="meta-label">Engagement</span>
              <span className="meta-val">Contract / Consulting</span>
            </div>
            <div className="meta-card">
              <span className="meta-label">Timezones</span>
              <span className="meta-val">BST / GMT & IST Compatible</span>
            </div>
            <div className="meta-card meta-card-full">
              <span className="meta-label">Direct Channel</span>
              <a href="info@yuktic.com" className="meta-link">
                info@yuktic.com
                <span className="link-arrow">↗</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Side: Elevated Glassmorphic Card */}
        <div className="contact-card">
          <div className="card-glass-glow"></div>
          <form className="contact-form" onSubmit={handleSubmit}>
            
            <div className="form-group">
              <label htmlFor="name" className="form-label">Full Name</label>
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
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
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
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">Phone Number</label>
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
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="service" className="form-label">Primary Interest</label>
              <div className="input-wrapper select-wrapper">
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="form-input form-select"
                >
                  <option value="HealthTech / EHR">Fixed Cost</option>
                  <option value="Cloud Architecture">T&M</option>
                  <option value="AI & Automation">Staff Augmentation</option>
                  <option value="Full-Stack Engineering">Recruitment</option>
                </select>
                <span className="select-arrow">▼</span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message" className="form-label">Message</label>
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
                ></textarea>
              </div>
            </div>

            <button type="submit" className="contact-submit-btn">
              <span>Send Message</span>
              <span className="btn-arrow">→</span>
            </button>

          </form>
        </div>

      </div>
    </section>
  );
};

export default ContactSection;

