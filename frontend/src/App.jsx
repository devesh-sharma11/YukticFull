import React, {
  useRef,
  useState,
} from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/hero";
import Footer from "./components/Footer";
import ProjectPage from "./pages/ProjectPage";
// import Feedback from "./pages/Feedback";
import ServicesPage from "./pages/ServicesPage";
import ArticlePage from "./pages/ArticlePage";
import ContactPage from "./pages/ContactPage";
import JobPage from "./pages/JobsPage";
// import AiBot from "./components/AiBot";
import ArticleOpenPage from "./pages/ArticleOpenPage";
import JobDetail from "./pages/JobDetail";

function AppContent() {
  const navbarLogoRef = useRef(null);

  const [
    showRealNavbar,
    setShowRealNavbar,
  ] = useState(false);

  const location = useLocation();

  /*
    Navbar should be visible on inner pages immediately.
    On Home page it appears after Hero animation.
  */
  const navbarVisible =
    showRealNavbar ||
    location.pathname === "/project" ||
    location.pathname === "/services" ||
    location.pathname === "/jobs" ||
    location.pathname.startsWith("/jobs/") ||
    location.pathname === "/contact" ||
    location.pathname === "/article" ||
    location.pathname === "/articles" ||
    location.pathname.startsWith("/articles/");


  return (
    <>
      {/* =================================
          REAL NAVBAR
      ================================= */}

      <Navbar
        ref={navbarLogoRef}
        visible={navbarVisible}
      />

      {/* =================================
          ROUTES
      ================================= */}

      <Routes>

        {/* ===============================
            HOME PAGE
        =============================== */}

        <Route
          path="/"
          element={
            <>
              <Hero
                onLogoAnimationComplete={() => {
                  setShowRealNavbar(true);
                }}
              />

              <Footer />
            </>
          }
        />

        {/* ===============================
            ABOUT PAGE
        =============================== */}

        <Route
          path="/project"
          element={<ProjectPage />}
        />

        {/* ===============================
            SERVICE PAGE
        =============================== */}

        <Route
          path="/services"
          element={<ServicesPage />}
        />

        {/* ===============================
            ARTICLE LIST PAGE
        =============================== */}

        <Route
          path="/article"
          element={<ArticlePage />}
        />

        {/* ===============================
            ARTICLE OPEN / DETAIL PAGE
        =============================== */}

        <Route
          path="/articles/:slug"
          element={<ArticleOpenPage />}
        />

        {/* ===============================
            CONTACT PAGE
        =============================== */}

        <Route
          path="/contact"
          element={<ContactPage />}
        />

        {/* ===============================
            JOB PAGE
        =============================== */}

        <Route
          path="/jobs"
          element={<JobPage />}
        />

        <Route
          path="/jobs/:slug"
          element={<JobDetail />}
        />

        {/* ===============================
            FEEDBACK PAGE
        =============================== */}

        {/* <Route
          path="/feedback"
          element={<Feedback />}
        /> */}

      </Routes>

      {/* =====================================
          GLOBAL AI ASSISTANT
      ====================================== */}

      {/* <AiBot /> */}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;