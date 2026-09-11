import React from "react";
import "../styles/footer.css";
import yukticLogo from "../assets/Yuktic.png";
import { FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer-container">
      {/* Dynamic Multi-Shaded Floating Waves */}
      <div className="waves">
        <div className="wave" id="wave1"></div>
        <div className="wave" id="wave2"></div>
        <div className="wave" id="wave3"></div>
        <div className="wave" id="wave4"></div>
      </div>

      <div className="footer-inner">
        {/* Main Grid */}
        <div className="footer-main-grid">
          {/* Brand Column */}
          <div className="footer-brand-col">
            <img src={yukticLogo} alt="Yuktic" className="footer-logo" />
            <p className="footer-tagline">
              YUKTIC, Ideas Become What We Build Together
            </p>
            <p className="footer-subtext">
              Driven by Logic. Defined by Solutions.​
            </p>
            <div className="footer-social-wrapper">
              <a
                href="https://www.linkedin.com/company/yuktic/posts/"
                target="_blank"
                rel="noreferrer"
                className="footer-social-box-wide"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="footer-nav-grid">
            {/* Services */}
            <div className="footer-col">
              <h4>SERVICES</h4>
              <ul>
                <li><a href="#advisory">Fixed Cost</a></li>
                <li><a href="#implementation">T&M</a></li>
                <li><a href="#design">Staff Augmentation</a></li>
                <li><a href="#optimisation">Recruitment</a></li>
              
              </ul>
            </div>

            {/* Company */}
            <div className="footer-col">
              <h4>COMPANY</h4>
              <ul>
                <li><a href="#about">About</a></li>
                <li><a href="#case-study">Job</a></li>
                <li><a href="#contact">Article</a></li>
              
              </ul>
            </div>

            {/* Legal */}
            <div className="footer-col">
              <h4>LEGAL</h4>
              <ul>
                <li><a href="#privacy">Privacy Policy</a></li>
                <li><a href="#cookies">Cookie Policy</a></li>
               
                <li><a href="#disclaimer">Disclaimer</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Legal Details */}
        <div className="footer-divider" />
        <div className="footer-company-details">
          <p>
            Registered in India • Company No. 1234567890 • Email Id: info@yuktic.com
          </p>
          <p>
            8th Floor, Platina Heights, c-24, c block, phase 2, industrial area, sector 62, Noida, Uttar Pradesh 201301
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <span>Copyright © {new Date().getFullYear()} Yuktic Limited.</span>
          <span className="powered-by">
            Powered by <img src={yukticLogo} alt="Yuktic" className="powered-logo" /> Yuktic.com
          </span>
        </div>
      </div>
    </footer>
  );
}