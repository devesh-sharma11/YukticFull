import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import CreateCaseStudy from "./pages/CreateCaseStudy";
import ListEditCaseStudy from "./pages/ListEditCaseStudy";
import ImageLibrary from "./pages/ImageLibrary";
import FeedbackResponse from "./pages/FeedbackResponse";
import AdminLayout from "./components/AdminLayout";
import FeedbackDetail from "./pages/FeedbackDetail";
import Testimonials from "./pages/Testimonials";
import CreateTestimonial from "./pages/CreateTestimonial";
import Contact from "./pages/Contact";

import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import ChangePassword from "./pages/ChangePassword";
import ResetAdminPassword from "./pages/ResetAdminPassword";
import FeedbackRequestTracker from "./pages/FeedbackRequestTracker";

// =========================================================
// JOBS
// =========================================================
import CreateJob from "./pages/CreateJob";
import ListEditJob from "./pages/ListEditJob";


function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >

        <Route
          path="/"
          element={
            <Navigate to="/dashboard" />
          }
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/change-password"
          element={<ChangePassword />}
        />

        <Route
          path="/reset-admin-password"
          element={<ResetAdminPassword />}
        />


        {/* =====================================================
            CASE STUDIES
        ====================================================== */}

        <Route
          path="/create-case-study"
          element={<CreateCaseStudy />}
        />

        <Route
          path="/image-library"
          element={<ImageLibrary />}
        />

        <Route
          path="/edit-case-study/:slug"
          element={<CreateCaseStudy />}
        />

        <Route
          path="/list-edit-case-study"
          element={<ListEditCaseStudy />}
        />


        {/* =====================================================
            JOBS
        ====================================================== */}

        <Route
          path="/create-job"
          element={<CreateJob />}
        />

        <Route
          path="/list-edit-job"
          element={<ListEditJob />}
        />


        {/* =====================================================
            CONTACT
        ====================================================== */}

        <Route
          path="/contact"
          element={<Contact />}
        />


        {/* =====================================================
            FEEDBACK
        ====================================================== */}

        <Route
          path="/feedback-responses"
          element={<FeedbackResponse />}
        />

        <Route
          path="/feedback-responses/:id"
          element={<FeedbackDetail />}
        />

        <Route
          path="/feedback-request-tracker"
          element={<FeedbackRequestTracker />}
        />


        {/* =====================================================
            TESTIMONIALS
        ====================================================== */}

        <Route
          path="/testimonials"
          element={<Testimonials />}
        />

        <Route
          path="/testimonials/create"
          element={<CreateTestimonial />}
        />

        <Route
          path="/testimonials/edit/:id"
          element={<CreateTestimonial />}
        />

      </Route>
    </Routes>
  );
}

export default App;