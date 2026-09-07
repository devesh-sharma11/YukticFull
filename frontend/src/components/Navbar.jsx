import React, {
  forwardRef,
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";

import Yuktic from "../assets/Yuktic.png";
import "../styles/navbar.css";
import { Link, useLocation } from "react-router-dom";


const Navbar = forwardRef(({ visible }, ref) => {

  /* =========================================================
     ROUTE
  ========================================================= */

  const location = useLocation();


  /* =========================================================
     SCROLL STATE
  ========================================================= */

  const [scrolled, setScrolled] = useState(false);


  /* =========================================================
     HOME NAVBAR HIDE
     
     Navbar remains completely hidden for 5 seconds
     whenever Home is loaded.
  ========================================================= */

  const [homeLoading, setHomeLoading] = useState(
    location.pathname === "/"
  );


  /* =========================================================
     ROUTE CHANGE TIMER
  ========================================================= */

  const homeTimerRef = useRef(null);


  /* =========================================================
     SCROLL LISTENER
  ========================================================= */

  useEffect(() => {

    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };


    handleScroll();


    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );


    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };

  }, []);


  /* =========================================================
     HOME PAGE 5 SECOND HIDE
     
     IMPORTANT:
     
     This works on:
     
     1. Fresh reload on Home
     2. About -> Home
     3. Services -> Home
     4. Career -> Home
     5. Jobs -> Home
     6. Article -> Home
     7. Contact -> Home
  ========================================================= */

  useLayoutEffect(() => {

    /* -----------------------------------------
       CLEAR PREVIOUS TIMER
    ----------------------------------------- */

    if (homeTimerRef.current) {

      clearTimeout(homeTimerRef.current);

      homeTimerRef.current = null;
    }


    /* -----------------------------------------
       HOME PAGE
    ----------------------------------------- */

    if (location.pathname === "/") {

      /*
        Hide navbar immediately.
      */

      setHomeLoading(true);


      /*
        Keep it hidden for exactly 5 seconds.
      */

      homeTimerRef.current = setTimeout(() => {

        setHomeLoading(false);

        homeTimerRef.current = null;

      }, 2850);

    } else {

      /*
        Other pages:
        navbar immediately available.
      */

      setHomeLoading(false);

    }


    /* -----------------------------------------
       CLEANUP
    ----------------------------------------- */

    return () => {

      if (homeTimerRef.current) {

        clearTimeout(homeTimerRef.current);

        homeTimerRef.current = null;
      }

    };

  }, [location.pathname]);


  /* =========================================================
     FINAL NAVBAR VISIBILITY
     
     Hidden when:
     
     - parent says visible=false
     OR
     - Home is still in its 5 second loading period
  ========================================================= */

  const shouldHideNavbar =
    !visible ||
    homeLoading;


  /* =========================================================
     NAVBAR CLASS
  ========================================================= */

  const navbarClassName = [
    "navbar",

    shouldHideNavbar
      ? "navbar-hidden"
      : "navbar-visible",

    scrolled
      ? "navbar-scrolled"
      : "",

  ]
    .filter(Boolean)
    .join(" ");


  /* =========================================================
     RENDER
  ========================================================= */

  return (

    <header
      ref={ref}
      className={navbarClassName}
    >

      <div className="navbar-container">


        {/* =====================================================
            LOGO
        ===================================================== */}

        <Link
          to="/"
          className="navbar-logo"
          aria-label="Yuktic Home"
        >

          <img
            src={Yuktic}
            alt="Yuktic"
          />

        </Link>


        {/* =====================================================
            NAVIGATION
        ===================================================== */}

      
<nav
  className="navbar-links"
  aria-label="Main navigation"
>
  <Link
    to="/"
    className={location.pathname === "/" ? "active" : ""}
  >
    Home
  </Link>


  <Link
    to="/services"
    className={location.pathname === "/services" ? "active" : ""}
  >
    Services
  </Link>

  
  <Link
    to="/about"
    className={location.pathname === "/about" ? "active" : ""}
  >
    Project
  </Link>

  <Link
    to="/jobs"
    className={location.pathname === "/jobs" ? "active" : ""}
  >
    Jobs
  </Link>

  <Link
    to="/article"
    className={location.pathname === "/article" ? "active" : ""}
  >
    Article
  </Link>

  <Link
    to="/contact"
    className={location.pathname === "/contact" ? "active" : ""}
  >
    Contact
  </Link>
</nav>




        {/* =====================================================
            MOBILE MENU
        ===================================================== */}

        <button
          className="navbar-menu-button"
          aria-label="Open navigation menu"
          type="button"
        >

          <span></span>
          <span></span>
          <span></span>

        </button>


      </div>

    </header>

  );

});


Navbar.displayName = "Navbar";


export default Navbar;