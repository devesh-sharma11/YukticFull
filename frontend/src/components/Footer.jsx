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

  {/* Logo */}
  <div className="footer-logo-wrapper">
    <img
      src={yukticLogo}
      alt="Yuktic"
      className="footer-logo"
    />
  </div>

  {/* Content beside logo */}
  <div className="footer-brand-content">

    {/* Yuktic */}
    <h3 className="footer-brand-title">
      YUKTIC
    </h3>

    {/* Description */}
    <p className="footer-subtext">
      Driven by Logic. Defined by Solutions.
    </p>

    {/* LinkedIn */}
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
                <li><a href="/services">Services</a></li>
                <li><a href="/product">Products</a></li>
                <li><a href="/careers">Careers</a></li>
                <li><a href="/contact">Contact</a></li>

              </ul>
            </div>

            {/* Legal */}
            <div className="footer-col">
              <h4>LEGAL</h4>
              <ul>
                <li><a href="#privacy">Privacy Policy</a></li>
                {/* <li><a href="#cookies">Cookie Policy</a></li>

                <li><a href="#disclaimer">Disclaimer</a></li> */}
              </ul>
            </div>
          </div>
        </div>

        {/* Legal Details */}
        <div className="footer-divider" />
        <div className="footer-company-details">
          
          <p>
            Platina Heights, C-24, C Block, Phase 2, Industrial Area, Sector 62, Noida, Uttar Pradesh 201301
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