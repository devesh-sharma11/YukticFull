import React, { useState, useEffect } from "react";

import Yuktic from "../assets/Yuktic.png";
import LightHeartSection from "../sections/HeroSection";
import CapabilitiesSection from "../sections/CapabilitiesSection";
import ProjectsSection from "../sections/ProjectsSection";
import TestimonialsSection from "../sections/TestimonialsSection";
import ContactSection from "../sections/ContactSection";
import AboutYukticSection from "../sections/AboutYukticSection";
import FixedbackgroundSectionn from "../sections/FixedbackgroundSection";

import "../styles/hero.css";

const Hero = ({ onLogoAnimationComplete }) => {
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    // Check if it has already run in this session
    const hasAnimated = sessionStorage.getItem("yuktic_logo_animated");

    if (!hasAnimated) {
      setShowLogo(true);

      // Auto cleanup after 2.5s even if CSS event doesn't fire
      const timer = setTimeout(() => {
        sessionStorage.setItem("yuktic_logo_animated", "true");
        setShowLogo(false);
        if (onLogoAnimationComplete) {
          onLogoAnimationComplete();
        }
      }, 2500);

      return () => clearTimeout(timer);
    } else {
      if (onLogoAnimationComplete) {
        onLogoAnimationComplete();
      }
    }
  }, [onLogoAnimationComplete]);

  return (
    <main className="hero-page">
      {/* Centered blinking & fading logo */}
      

      {/* Sections */}
      <section id="home" className="hero-section-wrapper">
        <LightHeartSection />
      </section>

      <div className="blue-flow">
        <AboutYukticSection />
        <CapabilitiesSection />
        <FixedbackgroundSectionn />
      </div>

      <div className="green-flow">
        <ProjectsSection />
        {/* <ContactSection /> */}
        <TestimonialsSection />
      </div>
    </main>
  );
};

export default Hero;