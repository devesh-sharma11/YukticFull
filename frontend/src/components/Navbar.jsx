import React, {
  forwardRef,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { Link, useLocation } from "react-router-dom";
import Yuktic from "../assets/Yuktic.png";
import "../styles/navbar.css";

const NAVIGATION_ITEMS = [
  { label: "Services", path: "/services" },
  { label: "Products", path: "/product" },
  { label: "Careers", path: "/careers" },
  { label: "Articles", path: "/article" },
];

const Navbar = forwardRef(({ visible = true }, ref) => {
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const [pillStyle, setPillStyle] = useState({ opacity: 0, left: 0, width: 0 });
  const navTrackRef = useRef(null);

  // Close drawer on path change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Initial glide expand
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => setIsExpanded(true), 400);
    return () => clearTimeout(timer);
  }, [visible]);

  // Scroll listener
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Desktop active pill position
  const updatePillToActive = useCallback(() => {
    if (!navTrackRef.current) return;
    const activeEl = navTrackRef.current.querySelector(".navbar-link.active");
    if (activeEl) {
      const trackRect = navTrackRef.current.getBoundingClientRect();
      const elRect = activeEl.getBoundingClientRect();
      setPillStyle({
        opacity: 1,
        left: elRect.left - trackRect.left,
        width: elRect.width,
      });
    } else {
      setPillStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  }, []);

  useEffect(() => {
    if (isExpanded) {
      const timeout = setTimeout(updatePillToActive, 100);
      return () => clearTimeout(timeout);
    }
  }, [location.pathname, isExpanded, updatePillToActive]);

  const handleLinkHover = (e) => {
    if (!navTrackRef.current) return;
    const trackRect = navTrackRef.current.getBoundingClientRect();
    const elRect = e.currentTarget.getBoundingClientRect();
    setPillStyle({
      opacity: 1,
      left: elRect.left - trackRect.left,
      width: elRect.width,
    });
  };

  // Lock body scroll on mobile
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e) => {
        if (e.key === "Escape") setMobileMenuOpen(false);
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        document.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileMenuOpen]);

  const isActiveRoute = useCallback(
    (path) => location.pathname === path,
    [location.pathname]
  );

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  const handleLogoClick = useCallback(() => {
    closeMobileMenu();
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.pathname, closeMobileMenu]);

  if (!visible) return null;

  return (
    <header
      ref={ref}
      className={`navbar ${scrolled ? "navbar-scrolled" : ""} ${
        isExpanded ? "navbar-expanded" : "navbar-collapsed"
      }`}
    >
      <div className="navbar-shell">
        <div className="navbar-ambient-aura" aria-hidden="true" />

        <div className="navbar-container">
          <Link
            to="/"
            className="navbar-brand"
            aria-label="Yuktic Homepage"
            onClick={handleLogoClick}
          >
            <div className="logo-pod">
              <img
                src={Yuktic}
                alt="Yuktic"
                className="navbar-logo-img"
                loading="eager"
              />
            </div>
            <span className="brand-name">YUKTIC</span>
          </Link>

          {/* Desktop Links */}
          <nav className="navbar-links" aria-label="Main navigation">
            <div
              className="links-track"
              ref={navTrackRef}
              onMouseLeave={updatePillToActive}
            >
              <div
                className="magic-pill"
                style={{
                  transform: `translateX(${pillStyle.left}px)`,
                  width: `${pillStyle.width}px`,
                  opacity: pillStyle.opacity,
                }}
              />

              {NAVIGATION_ITEMS.map((item) => {
                const active = isActiveRoute(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`navbar-link ${active ? "active" : ""}`}
                    onMouseEnter={handleLinkHover}
                  >
                    <span className="link-text">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* CTA + Mobile Toggle */}
          <div className="navbar-actions">
            <Link
              to="/contact"
              className={`navbar-cta ${isActiveRoute("/contact") ? "active" : ""}`}
              onClick={closeMobileMenu}
            >
              <span className="cta-border-sheen" />
              <span className="cta-content">
                
                <span>Contact</span>
               
              </span>
            </Link>

            <button
              type="button"
              className={`navbar-hamburger ${mobileMenuOpen ? "is-open" : ""}`}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              <div className="hamburger-box">
                <span className="hamburger-line line-1" />
                <span className="hamburger-line line-2" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Clean Mobile Card (Zero extra full-screen blue overlay) */}
      <div className={`mobile-navigation ${mobileMenuOpen ? "open" : ""}`}>
        <div
          className="mobile-backdrop"
          aria-hidden="true"
          onClick={closeMobileMenu}
        />
        <div className="mobile-panel">
          <nav className="mobile-links">
            {NAVIGATION_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`mobile-link-item ${isActiveRoute(item.path) ? "active" : ""}`}
                onClick={closeMobileMenu}
              >
                <span className="mobile-item-title">{item.label}</span>
                
                <span className="mobile-item-arrow" aria-hidden="true"></span>
              </Link>
            ))}
          </nav>

          <div className="mobile-footer">
            <Link
              to="/contact"
              className="mobile-primary-action"
              onClick={closeMobileMenu}
            >
              <span>Contact Us</span>
              <span className="btn-icon">→</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
});

Navbar.displayName = "Navbar";
export default Navbar;