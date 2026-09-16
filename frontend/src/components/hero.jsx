import React, { useState, useEffect } from "react";

import Yuktic from "../assets/Yuktic.png";
import LightHeartSection from "../sections/HeroSection";
import CapabilitiesSection from "../sections/CapabilitiesSection";
import ProjectsSection from "../sections/ProductsSection";
import TestimonialsSection from "../sections/TestimonialsSection";
import ContactSection from "../sections/ContactSection";
import AboutYukticSection from "../sections/AboutYukticSection";
import FixedbackgroundSectionn from "../sections/FixedbackgroundSection";

import "../styles/hero.css";

const Hero = ({ onLogoAnimationComplete }) => {
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    // Always start this page from the top section
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });

    // Check if logo animation has already run in this session
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
      },);

      return () => clearTimeout(timer);
    } else {
      if (onLogoAnimationComplete) {
        onLogoAnimationComplete();
      }
    }
  }, [onLogoAnimationComplete]);

  return (
    <main className="hero-page">
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