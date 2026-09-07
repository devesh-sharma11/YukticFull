import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import Yuktic from "../assets/Yuktic.png";
import LightHeartSection from "../sections/HeroSection";
import CapabilitiesSection from '../sections/CapabilitiesSection';
import ProjectsSection from "../sections/ProjectsSection";
import TestimonialsSection from "../sections/TestimonialsSection";
import ContactSection from '../sections/ContactSection';
import AboutYukticSection from '../sections/AboutYukticSection';
import FixedbackgroundSectionn from '../sections/FixedbackgroundSection';

import "../styles/hero.css";

const Hero = ({ onLogoAnimationComplete }) => {
  const fakeNavbarLogoRef = useRef(null);
  const heroLogoRef = useRef(null);

  const [animationReady, setAnimationReady] = useState(false);
  const [animationFinished, setAnimationFinished] = useState(false);

  /* =========================================
      SCROLL LOCK FOR 4s WITHOUT HIDING SECTIONS
  ========================================= */
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    window.scrollTo(0, 0);

    // Prevent wheel and touch scrolling without modifying overflow/DOM visibility
    const preventDefault = (e) => {
      e.preventDefault();
    };

    const preventScrollKeys = (e) => {
      const keys = ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "];
      if (keys.includes(e.key)) {
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", preventDefault, { passive: false });
    window.addEventListener("touchmove", preventDefault, { passive: false });
    window.addEventListener("keydown", preventScrollKeys, { passive: false });

    // Release scroll lock after 4 seconds
    const timer = setTimeout(() => {
      window.removeEventListener("wheel", preventDefault);
      window.removeEventListener("touchmove", preventDefault);
      window.removeEventListener("keydown", preventScrollKeys);
    }, 4000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("wheel", preventDefault);
      window.removeEventListener("touchmove", preventDefault);
      window.removeEventListener("keydown", preventScrollKeys);
    };
  }, []);

  /* =========================================
      CALCULATE LOGO DESTINATION
  ========================================= */
  useEffect(() => {
    const calculateAnimation = () => {
      const heroLogo = heroLogoRef.current;
      const fakeNavbarLogo = fakeNavbarLogoRef.current;

      if (!heroLogo || !fakeNavbarLogo) return;

      const heroRect = heroLogo.getBoundingClientRect();
      const navbarRect = fakeNavbarLogo.getBoundingClientRect();

      const heroCenterX = heroRect.left + heroRect.width / 2;
      const heroCenterY = heroRect.top + heroRect.height / 2;

      const navbarCenterX = navbarRect.left + navbarRect.width / 2;
      const navbarCenterY = navbarRect.top + navbarRect.height / 2;

      const moveX = navbarCenterX - heroCenterX;
      const moveY = navbarCenterY - heroCenterY;

      const finalScale = navbarRect.width / heroRect.width;

      heroLogo.style.setProperty("--move-x", `${moveX}px`);
      heroLogo.style.setProperty("--move-y", `${moveY}px`);
      heroLogo.style.setProperty("--final-scale", finalScale);

      setAnimationReady(true);
    };

    const frame1 = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        calculateAnimation();
      });
    });

    window.addEventListener("resize", calculateAnimation);

    return () => {
      cancelAnimationFrame(frame1);
      window.removeEventListener("resize", calculateAnimation);
    };
  }, []);

  const handleAnimationEnd = (event) => {
    if (event.target !== heroLogoRef.current) return;
    if (event.animationName !== "travel-to-fake-navbar") return;

    if (onLogoAnimationComplete) {
      onLogoAnimationComplete();
    }
    setAnimationFinished(true);
  };

  return (
    <main className="hero-page">
      {!animationFinished && (
        <header className="fake-navbar" aria-hidden="true">
          <div className="fake-navbar-container">
            <div ref={fakeNavbarLogoRef} className="fake-navbar-logo">
              <img src={Yuktic} alt="" />
            </div>

            <nav className="fake-navbar-links" aria-hidden="true">
              <span>Home</span>
              <span>About</span>
              <span>Our Services</span>
            
              <span>Jobs</span>
              <span>Article</span>
              <span className="fake-contact">Contact</span>
            </nav>

            <div className="fake-navbar-menu-button" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </header>
      )}

      <div
        ref={heroLogoRef}
        className={`hero-logo-animation ${
          animationReady ? "hero-logo-ready" : ""
        } ${animationFinished ? "hero-logo-finished" : ""}`}
        onAnimationEnd={handleAnimationEnd}
      >
        <div className="hero-logo-glow"></div>
        <img src={Yuktic} alt="Yuktic" />
      </div>

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
        <ContactSection />
        <TestimonialsSection />
      </div>
    </main>
  );
};

export default Hero;