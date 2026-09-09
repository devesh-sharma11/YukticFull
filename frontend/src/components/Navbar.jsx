// import React, {
//   forwardRef,
//   useState,
//   useEffect,
//   useLayoutEffect,
//   useRef,
// } from "react";

// import Yuktic from "../assets/Yuktic.png";
// import "../styles/navbar.css";
// import { Link, useLocation } from "react-router-dom";


// const Navbar = forwardRef(({ visible }, ref) => {

//   /* =========================================================
//      ROUTE
//   ========================================================= */

//   const location = useLocation();


//   /* =========================================================
//      SCROLL STATE
//   ========================================================= */

//   const [scrolled, setScrolled] = useState(false);


//   /* =========================================================
//      HOME NAVBAR HIDE
     
//      Navbar remains completely hidden for 5 seconds
//      whenever Home is loaded.
//   ========================================================= */

//   const [homeLoading, setHomeLoading] = useState(
//     location.pathname === "/"
//   );


//   /* =========================================================
//      ROUTE CHANGE TIMER
//   ========================================================= */

//   const homeTimerRef = useRef(null);


//   /* =========================================================
//      SCROLL LISTENER
//   ========================================================= */

//   useEffect(() => {

//     const handleScroll = () => {
//       setScrolled(window.scrollY > 40);
//     };


//     handleScroll();


//     window.addEventListener(
//       "scroll",
//       handleScroll,
//       {
//         passive: true,
//       }
//     );


//     return () => {
//       window.removeEventListener(
//         "scroll",
//         handleScroll
//       );
//     };

//   }, []);


//   /* =========================================================
//      HOME PAGE 5 SECOND HIDE
     
//      IMPORTANT:
     
//      This works on:
     
//      1. Fresh reload on Home
//      2. About -> Home
//      3. Services -> Home
//      4. Career -> Home
//      5. Jobs -> Home
//      6. Article -> Home
//      7. Contact -> Home
//   ========================================================= */

//   useLayoutEffect(() => {

//     /* -----------------------------------------
//        CLEAR PREVIOUS TIMER
//     ----------------------------------------- */

//     if (homeTimerRef.current) {

//       clearTimeout(homeTimerRef.current);

//       homeTimerRef.current = null;
//     }


//     /* -----------------------------------------
//        HOME PAGE
//     ----------------------------------------- */

//     if (location.pathname === "/") {

//       /*
//         Hide navbar immediately.
//       */

//       setHomeLoading(true);


//       /*
//         Keep it hidden for exactly 5 seconds.
//       */

//       homeTimerRef.current = setTimeout(() => {

//         setHomeLoading(false);

//         homeTimerRef.current = null;

//       }, 2850);

//     } else {

//       /*
//         Other pages:
//         navbar immediately available.
//       */

//       setHomeLoading(false);

//     }


//     /* -----------------------------------------
//        CLEANUP
//     ----------------------------------------- */

//     return () => {

//       if (homeTimerRef.current) {

//         clearTimeout(homeTimerRef.current);

//         homeTimerRef.current = null;
//       }

//     };

//   }, [location.pathname]);


//   /* =========================================================
//      FINAL NAVBAR VISIBILITY
     
//      Hidden when:
     
//      - parent says visible=false
//      OR
//      - Home is still in its 5 second loading period
//   ========================================================= */

//   const shouldHideNavbar =
//     !visible ||
//     homeLoading;


//   /* =========================================================
//      NAVBAR CLASS
//   ========================================================= */

//   const navbarClassName = [
//     "navbar",

//     shouldHideNavbar
//       ? "navbar-hidden"
//       : "navbar-visible",

//     scrolled
//       ? "navbar-scrolled"
//       : "",

//   ]
//     .filter(Boolean)
//     .join(" ");


//   /* =========================================================
//      RENDER
//   ========================================================= */

//   return (

//     <header
//       ref={ref}
//       className={navbarClassName}
//     >

//       <div className="navbar-container">


//         {/* =====================================================
//             LOGO
//         ===================================================== */}

//         <Link
//           to="/"
//           className="navbar-logo"
//           aria-label="Yuktic Home"
//         >

//           <img
//             src={Yuktic}
//             alt="Yuktic"
//           />

//         </Link>


//         {/* =====================================================
//             NAVIGATION
//         ===================================================== */}

      
// <nav
//   className="navbar-links"
//   aria-label="Main navigation"
// >
//   <Link
//     to="/"
//     className={location.pathname === "/" ? "active" : ""}
//   >
//     Home
//   </Link>


//   <Link
//     to="/services"
//     className={location.pathname === "/services" ? "active" : ""}
//   >
//     Services
//   </Link>

  
//   <Link
//     to="/project"
//     className={location.pathname === "/project" ? "active" : ""}
//   >
//     Project
//   </Link>

//   <Link
//     to="/jobs"
//     className={location.pathname === "/jobs" ? "active" : ""}
//   >
//     Jobs
//   </Link>

//   <Link
//     to="/article"
//     className={location.pathname === "/article" ? "active" : ""}
//   >
//     Article
//   </Link>

//   <Link
//     to="/contact"
//     className={location.pathname === "/contact" ? "active" : ""}
//   >
//     Contact
//   </Link>
// </nav>




//         {/* =====================================================
//             MOBILE MENU
//         ===================================================== */}

//         <button
//           className="navbar-menu-button"
//           aria-label="Open navigation menu"
//           type="button"
//         >

//           <span></span>
//           <span></span>
//           <span></span>

//         </button>


//       </div>

//     </header>

//   );

// });


// Navbar.displayName = "Navbar";


// export default Navbar;








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
     MOBILE MENU STATE
  ========================================================= */

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /* =========================================================
     HOME LOADING STATE

     Navbar stays hidden when Home is loaded.
  ========================================================= */

  const [homeLoading, setHomeLoading] = useState(
    location.pathname === "/"
  );

  /* =========================================================
     HOME TIMER
  ========================================================= */

  const homeTimerRef = useRef(null);

  /* =========================================================
     MOBILE MENU ID
  ========================================================= */

  const mobileMenuId = "mobile-navigation-menu";

  /* =========================================================
     NAVIGATION ITEMS
  ========================================================= */

  const navigationItems = [
    {
      label: "Home",
      path: "/",
    },
    {
      label: "Services",
      path: "/services",
    },
    {
      label: "Project",
      path: "/project",
    },
    {
      label: "Jobs",
      path: "/jobs",
    },
    {
      label: "Article",
      path: "/article",
    },
    {
      label: "Contact",
      path: "/contact",
      isContact: true,
    },
  ];

  /* =========================================================
     SCROLL LISTENER
  ========================================================= */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /* =========================================================
     HOME PAGE HIDE TIMER
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
      setHomeLoading(true);

      homeTimerRef.current = setTimeout(() => {
        setHomeLoading(false);
        homeTimerRef.current = null;
      }, 2850);
    } else {
      setHomeLoading(false);
    }

    /* -----------------------------------------
       CLOSE MOBILE MENU ON ROUTE CHANGE
    ----------------------------------------- */

    setMobileMenuOpen(false);

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
     MOBILE BODY SCROLL LOCK
  ========================================================= */

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  /* =========================================================
     ESCAPE KEY
  ========================================================= */

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  /* =========================================================
     TOGGLE MOBILE MENU
  ========================================================= */

  const toggleMobileMenu = () => {
    setMobileMenuOpen((previous) => !previous);
  };

  /* =========================================================
     CLOSE MOBILE MENU
  ========================================================= */

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  /* =========================================================
     CHECK ACTIVE ROUTE
  ========================================================= */

  const isActiveRoute = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname === path;
  };

  /* =========================================================
     FINAL NAVBAR VISIBILITY
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

    mobileMenuOpen
      ? "navbar-menu-open"
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
          onClick={closeMobileMenu}
        >
          <img
            src={Yuktic}
            alt="Yuktic"
          />
        </Link>


        {/* =====================================================
            DESKTOP NAVIGATION
        ===================================================== */}

        <nav
          className="navbar-links"
          aria-label="Main navigation"
        >

          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={[
                isActiveRoute(item.path)
                  ? "active"
                  : "",

                item.isContact
                  ? "contact-link"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {item.label}
            </Link>
          ))}

        </nav>


        {/* =====================================================
            MOBILE MENU BUTTON
        ===================================================== */}

        <button
          className={[
            "navbar-menu-button",
            mobileMenuOpen
              ? "is-open"
              : "",
          ]
            .filter(Boolean)
            .join(" ")}
          aria-label={
            mobileMenuOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={mobileMenuOpen}
          aria-controls={mobileMenuId}
          type="button"
          onClick={toggleMobileMenu}
        >

          <span></span>
          <span></span>
          <span></span>

        </button>

      </div>


      {/* =======================================================
          MOBILE MENU
      ======================================================= */}

      <div
        id={mobileMenuId}
        className={[
          "mobile-navigation",
          mobileMenuOpen
            ? "mobile-navigation-open"
            : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >

        {/* =====================================================
            MOBILE BACKDROP
        ===================================================== */}

        <button
          className="mobile-navigation-backdrop"
          type="button"
          aria-label="Close navigation menu"
          onClick={closeMobileMenu}
        />


        {/* =====================================================
            MOBILE PANEL
        ===================================================== */}

        <div className="mobile-navigation-panel">

          <nav
            className="mobile-navigation-links"
            aria-label="Mobile navigation"
          >

            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={[
                  isActiveRoute(item.path)
                    ? "active"
                    : "",

                  item.isContact
                    ? "contact-link"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={closeMobileMenu}
              >

                <span>
                  {item.label}
                </span>

                {!item.isContact && (
                  <span
                    className="mobile-link-arrow"
                    aria-hidden="true"
                  >
                    →
                  </span>
                )}

              </Link>
            ))}

          </nav>

        </div>

      </div>

    </header>
  );
});

Navbar.displayName = "Navbar";

export default Navbar;