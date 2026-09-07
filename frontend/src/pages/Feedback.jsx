


import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../services/api";
import Logo from "../assets/Yuktic.png";

// --- DATA CONSTANTS ---
const STEP_LABELS = [
  "Review type", "Engagement", "Ratings", "Impact", "Recommendation", "Privacy", "Submit"
];
const QUALITY = [
  "Professionalism", "Communication", "Technical expertise", "Leadership", "Problem solving", 
  "Delivery quality", "Stakeholder management", "Value delivered", "Responsiveness", "Knowledge transfer"
];
const OUTCOMES = [
  "Improved clinical workflows", "Better stakeholder engagement", "Reduced programme risk", 
  "Improved data quality", "Faster delivery", "Better user adoption", "Improved reporting", 
  "Enhanced governance", "Improved operational efficiency", "Stronger technical design", 
  "Improved integration capability", "Improved team capability"
];
const EXCELLENCE = [
  "Communication", "Technical expertise", "Leadership", "Mentoring", "Reporting", 
  "Delivery", "Stakeholder engagement", "Problem solving", "Innovation", "Team development"
];
const PUBLISH = [
  "Anonymous", "Name only", "Organisation only", "Name & organisation", "Contact me about a case study"
];

const LOCAL_STORAGE_KEY = "silkeit_feedback_draft";

const defaultState = {
  types: [], services: [], ratings: {}, outcomes: [],
  willing: null, excellence: [], publish: [], orgName: "", country: "", orgType: "",
  projectName: "", duration: "", impact: "", workedWell: "", improve: "",
  consultant: "", consultantNotes: "", recommendation: "", name: "", title: "",
  org2: "", linkedin: "", consentProcess: false, consentRemoval: false,
  consentContact: false, consentPublish: false
};

export default function Feedback() {
  const [currentStep, setCurrentStep] = useState(0);
  const [furthestStep, setFurthestStep] = useState(0);
  const [state, setState] = useState(defaultState);
  const [errors, setErrors] = useState({});
  const [showWarning, setShowWarning] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get("requestId");

  // Load from LocalStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) {
        setState((prev) => ({ ...prev, ...JSON.parse(raw) }));
      }
    } catch (e) {
      console.error(e);
    }
    setMounted(true);
  }, []);

  useEffect(() => {

    if (!requestId) return;

    const markOpened = async () => {

        try {

            await API.put(
                `/feedback-request/open/${requestId}`
            );

            console.log("Feedback request marked as opened.");

        } catch (err) {

            console.error(err);

        }

    };

    markOpened();

}, [requestId]);

  // Save to LocalStorage
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        console.error(e);
      }
    }
  }, [state, mounted]);

  // Derived Conditionals
  const hasConsultant = state.types.includes("consultant");
  const hasService = state.types.includes("service") || state.types.includes("project") || state.services.length > 0;

  // Validation Logic per step
  const validateStep = (step) => {
    let isValid = true;
    const newErrors = {};

    if (step === 0) {
      if (state.types.length === 0) {
        newErrors.types = "Please select at least one review type.";
        isValid = false;
      }
    } else if (step === 1) {
      if (!state.orgName?.trim()) { newErrors.orgName = "Organisation name is required"; isValid = false; }
      if (!state.country?.trim()) { newErrors.country = "Country is required"; isValid = false; }
      if (!state.orgType) { newErrors.orgType = "Organisation type is required"; isValid = false; }
    } else if (step === 2) {
      if (!state.ratings.overall) { newErrors.overall = "Overall rating is required"; isValid = false; }
    } else if (step === 4) {
      if (state.willing === "Yes" && !state.recommendation?.trim()) {
        newErrors.recommendation = "Recommendation details are required since you chose 'Yes'."; 
        isValid = false;
      }
    } else if (step === 5) {
      if (!state.consentProcess) {
        newErrors.consentProcess = "Please check this box to continue.";
        isValid = false;
      }
// ...
      if (!state.consentProcess) {
        newErrors.consentProcess = "Please check this box to continue.";
        isValid = false;
      }
      if (!state.consentRemoval) {
        newErrors.consentRemoval = "Please check this box to continue.";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;
    const next = currentStep + 1;
    setCurrentStep(next);
    if (next > furthestStep) setFurthestStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrev = () => {
    setCurrentStep((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setState((prev) => ({ ...prev, [name]: checked }));
      if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
      if (name === "consentProcess" || name === "consentRemoval") setShowWarning(false);
    } else {
      setState((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const toggleArrayItem = (key, val) => {
    setState((prev) => {
      const arr = prev[key] || [];
      return { ...prev, [key]: arr.includes(val) ? arr.filter((i) => i !== val) : [...arr, val] };
    });
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }));
  };

  const handleSubmit = async () => {
    if (!state.consentProcess || !state.consentRemoval) {
      setErrors((prev) => ({
        ...prev,
        consentProcess: !state.consentProcess ? "Required" : null,
        consentRemoval: !state.consentRemoval ? "Required" : null,
      }));
      setShowWarning(true);
      return;
    }

    // 1. Show the thank you message immediately
    setIsSubmitted(true);

    try {

    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/feedback`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...state,
                requestId
            }),
        }
    );

    if (!response.ok) {
        throw new Error("Feedback submission failed");
    }

    // ✅ Mark tracker as submitted
    // if (requestId) {

    //     await API.put(
    //         `/feedback-request/submit/${requestId}`
    //     );

    //     console.log("Tracker marked as submitted.");

    // }

    // Clear saved draft
    localStorage.removeItem(LOCAL_STORAGE_KEY);

    // Redirect to website home after 2 seconds
    setTimeout(() => {
        window.location.replace("/");
    }, 1000);

} catch (error) {

    console.error(error);

}
  };

  const getTypesLabel = () => {
    const map = { company: "Company experience", service: "Specific service", project: "Specific project", consultant: "Consultant feedback", recommendation: "Recommendation" };
    return state.types.map((t) => map[t] || t).join(", ") || "—";
  };

  // Internal Component for Star Ratings
  const StarRow = ({ ratingKey, max = 5, size = 24 }) => {
    const currentRating = state.ratings[ratingKey] || 0;
    const [hoverRating, setHoverRating] = useState(null);

    const setRating = (val) => {
      setState((prev) => ({
        ...prev,
        ratings: { ...prev.ratings, [ratingKey]: prev.ratings[ratingKey] === val ? 0 : val }
      }));
      if (errors[ratingKey]) setErrors((prev) => ({ ...prev, [ratingKey]: null }));
    };

    return (
      <div className="star-row" role="radiogroup" aria-label={ratingKey}>
        {Array.from({ length: max }, (_, i) => i + 1).map((val) => {
          const isLit = hoverRating !== null ? val <= hoverRating : val <= currentRating;
          return (
            <button
              key={val}
              type="button"
              className={`star ${isLit ? "lit" : ""}`}
              onClick={() => setRating(val)}
              onMouseEnter={() => setHoverRating(val)}
              onMouseLeave={() => setHoverRating(null)}
              aria-checked={val === currentRating}
            >
              <svg style={{ width: size, height: size }} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l2.9 6.3 6.9.7-5.1 4.7 1.4 6.8L12 17.8 5 21.2l1.4-6.8L1.3 9.7l6.9-.7L12 2z" />
              </svg>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <style>{`
        :root {
          --red: #E64013; --red-dark: #C9350E; --forest: #2A6049; --sage: #3D8A68;
          --mint: #F5FAF7; --tint: #E8F4EF; --night: #0F2318; --line: #D7E7DF;
          --ink: #0F2318; --muted: #56685E; --white: #ffffff;
          --shadow-sm: 0 1px 2px rgba(15,35,24,.06), 0 2px 8px rgba(15,35,24,.05);
          --shadow-md: 0 6px 24px rgba(15,35,24,.09);
          --shadow-lg: 0 18px 50px rgba(15,35,24,.14);
          --r: 14px; --maxw: 1180px;
        }
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body {
          margin: 0; font-family: 'Montserrat', system-ui, sans-serif;
          color: var(--ink); background: var(--mint); line-height: 1.6;
          -webkit-font-smoothing: antialiased;
        }
        h1, h2, h3, h4 { font-family: 'Montserrat', sans-serif; line-height: 1.15; margin: 0; font-weight: 700; letter-spacing: -.01em; }
        p { margin: 0 0 1rem; }
        .wrap { max-width: var(--maxw); margin: 0 auto; padding: 0 28px; display: flex; flex-direction: column; align-items: center; }
        .btn {
          font-family: 'Montserrat', sans-serif; font-weight: 600; font-size: .95rem;
          border: none; border-radius: 999px; padding: .85rem 1.6rem; cursor: pointer;
          transition: transform .18s ease, background .2s ease, box-shadow .2s ease;
          display: inline-flex; align-items: center; gap: .5rem; text-decoration: none;
        }
        .btn-primary { background: var(--red); color: #fff; box-shadow: 0 6px 18px rgba(230,64,19,.28); }
        .btn-primary:hover { background: var(--sage); transform: translateY(-2px); box-shadow: 0 10px 24px rgba(61,138,104,.3); }
        .btn-ghost { background: var(--white); color: var(--forest); border: 1.5px solid var(--line); }
        .btn-ghost:hover { border-color: var(--sage); color: var(--sage); transform: translateY(-2px); }
        .btn:focus-visible { outline: 3px solid rgba(42,96,73,.45); outline-offset: 3px; }

        /* ---------- ERRORS & VALIDATION ---------- */
        .req { color: var(--red); font-weight: bold; margin-left: 3px; }
        .error-text { color: var(--red); font-size: 0.8rem; font-weight: 600; margin-top: 6px; }
        .input-error { border-color: var(--red) !important; background-color: #FDECE6 !important; }

        /* ---------- PROGRESS ---------- */
        .progress-bar {
          position: sticky; top: 0; z-index: 50; background: rgba(255,255,255,.92);
          backdrop-filter: blur(8px); border-bottom: 1px solid var(--line); box-shadow: var(--shadow-sm); width: 100%;
        }
        .steps { display: flex; align-items: center; justify-content: center; gap: 0; overflow-x: auto; padding: 12px 0; scrollbar-width: none; width: 100%; }
        .steps::-webkit-scrollbar { display: none; }
        .step {
          display: flex; align-items: center; gap: .55rem; flex: 0 0 auto;
          font-size: .8rem; font-weight: 600; color: var(--muted);
          padding: .2rem .65rem; border-radius: 999px; white-space: nowrap;
          background: none; border: none; cursor: pointer; font-family: inherit; transition: color .2s;
        }
        .step .dot {
          width: 24px; height: 24px; border-radius: 50%; border: 2px solid var(--line); background: var(--white);
          display: grid; place-items: center; font-size: .72rem; font-weight: 700; color: var(--muted); transition: all .25s ease;
        }
        .step.active { color: var(--forest); }
        .step.active .dot { background: var(--forest); border-color: var(--forest); color: #fff; }
        .step.done .dot { background: var(--sage); border-color: var(--sage); color: #fff; }
        .step.done { color: var(--sage); }
        .step-sep { width: 18px; height: 2px; background: var(--line); flex: 0 0 auto; border-radius: 2px; }

        /* ---------- FORM SHELL ---------- */
        .form-section { padding: 46px 0 64px; width: 100%; }
        .panel { animation: fade .45s ease; display: flex; flex-direction: column; align-items: center; width: 100%; }
        @keyframes fade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        .panel-head { margin: 0 auto 1.6rem; max-width: 46rem; text-align: center; }
        .panel-head h2 { font-size: clamp(1.5rem,2.6vw,2rem); margin-bottom: .5rem; }
        .panel-head p { color: var(--muted); margin: 0; font-size: .98rem; }
        .field-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.1rem 1.4rem; width: 100%; }
        .field { display: flex; flex-direction: column; align-items: center; gap: .4rem; margin-bottom: .2rem; width: 100%; text-align: center; }
        .field.full { grid-column: 1/-1; }
        label.lbl { font-size: .82rem; font-weight: 700; color: var(--forest); text-align: center; }
        label.lbl .opt { font-weight: 500; color: var(--muted); font-size: .78rem; }
        input[type=text], input[type=url], select, textarea {
          font-family: inherit; font-size: .95rem; color: var(--ink); text-align: center;
          background: var(--white); border: 1.5px solid var(--line); border-radius: 10px;
          padding: .7rem .85rem; transition: border-color .2s, box-shadow .2s; width: 100%; max-width: 600px;
        }
        textarea { resize: vertical; min-height: 120px; line-height: 1.55; text-align: left; }
        input:focus, select:focus, textarea:focus { outline: none; border-color: var(--sage); box-shadow: 0 0 0 3px rgba(61,138,104,.15); }
        .card-block {
          background: var(--white); border: 1px solid var(--line); border-radius: var(--r);
          padding: 26px 28px; box-shadow: var(--shadow-sm); margin: 0 auto 1.4rem;
          width: 100%; max-width: 760px; display: flex; flex-direction: column; align-items: center; text-align: center;
        }
        .card-block h3 { font-size: 1.05rem; color: var(--forest); margin-bottom: 1rem; display: flex; justify-content: center; align-items: center; gap: .55rem; width: 100%; }
        .card-block h3 .num {
          font-family: 'Comfortaa', cursive; font-size: .7rem; color: var(--sage);
          border: 1px solid var(--line); border-radius: 6px; padding: .1rem .4rem; font-weight: 600;
        }

        /* ---------- TYPE CARDS ---------- */
        .type-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(220px,1fr)); gap: 1rem; width: 100%; max-width: 800px; justify-content: center; }
        .type-card {
          text-align: center; background: var(--white); border: 1.5px solid var(--line); border-radius: var(--r);
          padding: 1.2rem 1.25rem; cursor: pointer; transition: all .2s ease; position: relative; font-family: inherit;
          display: flex; flex-direction: column; align-items: center; gap: .55rem;
        }
        .type-card:hover { border-color: var(--sage); transform: translateY(-3px); box-shadow: var(--shadow-md); }
        .type-card .ico { width: 42px; height: 42px; border-radius: 10px; background: var(--tint); display: grid; place-items: center; color: var(--forest); transition: all .2s; }
        .type-card h4 { font-size: 1rem; }
        .type-card p { font-size: .84rem; color: var(--muted); margin: 0; }
        .type-card .tick {
          position: absolute; top: 14px; right: 14px; width: 22px; height: 22px; border-radius: 50%;
          border: 2px solid var(--line); display: grid; place-items: center; color: #fff; transition: all .2s;
        }
        .type-card[aria-pressed="true"] { border-color: var(--forest); background: linear-gradient(180deg,#fff,var(--mint)); box-shadow: var(--shadow-md); }
        .type-card[aria-pressed="true"] .tick { background: var(--red); border-color: var(--red); }
        .type-card[aria-pressed="true"] .ico { background: var(--forest); color: #fff; }

        /* ---------- CHIPS & TILES ---------- */
        .chips { display: flex; flex-wrap: wrap; justify-content: center; gap: .55rem; }
        .chip {
          font-family: inherit; font-size: .84rem; font-weight: 600; color: var(--forest);
          background: var(--white); border: 1.5px solid var(--line); border-radius: 999px;
          padding: .5rem .95rem; cursor: pointer; transition: all .18s ease; display: inline-flex; align-items: center; gap: .4rem;
        }
        .chip:hover { border-color: var(--sage); }
        .chip[aria-pressed="true"] { background: var(--forest); color: #fff; border-color: var(--forest); }
        .chip[aria-pressed="true"]::before { content: "✓"; font-size: .78rem; }
        .tiles { display: grid; grid-template-columns: repeat(auto-fit,minmax(210px,1fr)); gap: .7rem; width: 100%; }
        .tile {
          font-family: inherit; text-align: left; font-size: .86rem; font-weight: 600; color: var(--forest);
          background: var(--white); border: 1.5px solid var(--line); border-radius: 10px;
          padding: .75rem .9rem; cursor: pointer; transition: all .18s ease; display: flex; align-items: center; justify-content: center; gap: .6rem;
        }
        .tile:hover { border-color: var(--sage); transform: translateY(-2px); }
        .tile .tbox { width: 18px; height: 18px; border-radius: 5px; border: 2px solid var(--line); flex: 0 0 auto; display: grid; place-items: center; color: #fff; transition: all .18s; }
        .tile[aria-pressed="true"] { border-color: var(--forest); background: var(--mint); }
        .tile[aria-pressed="true"] .tbox { background: var(--red); border-color: var(--red); }

        /* ---------- STAR RATINGS & NPS ---------- */
        .star-hero { text-align: center; padding: .5rem 0 1.4rem; }
        .star-row { display: inline-flex; gap: .35rem; justify-content: center; }
        .star { background: none; border: none; cursor: pointer; padding: 0; line-height: 0; color: var(--line); transition: transform .12s; }
        .star:hover { transform: scale(1.12); }
        .star.lit { color: var(--red); }
        .rating-grid { display: grid; grid-template-columns: 1fr; gap: .8rem; width: 100%; max-width: 500px; margin: 0 auto; }
        .rating-line { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: .55rem 0; border-bottom: 1px dashed var(--line); }
        .rating-line .rl-name { font-size: .9rem; font-weight: 600; color: var(--forest); }
        .rating-line .star-row { gap: .2rem; }
        .radio-row { display: flex; flex-wrap: wrap; justify-content: center; gap: .6rem; margin-top: .3rem; }
        .radio-pill {
          font-family: inherit; font-size: .85rem; font-weight: 600; color: var(--forest);
          background: var(--white); border: 1.5px solid var(--line); border-radius: 999px; padding: .5rem 1.1rem; cursor: pointer; transition: all .18s;
        }
        .radio-pill[aria-pressed="true"] { background: var(--sage); color: #fff; border-color: var(--sage); }

        /* ---------- GDPR & SUMMARY ---------- */
        .gdpr-card { background: #FBFCFB; border: 1px solid var(--line); }
        .gdpr-card h3 { color: var(--forest); }
        .gdpr-content { max-width: 550px; width: 100%; margin: 0 auto; display: flex; flex-direction: column; align-items: center; }
        .consent { display: flex; gap: .65rem; align-items: flex-start; padding: .5rem 0; font-size: .88rem; color: var(--ink); cursor: pointer; text-align: left; width: 100%; }
        .consent input { margin-top: .2rem; width: 18px; height: 18px; accent-color: var(--forest); flex: 0 0 auto; }
        .consent .req { color: var(--red); font-weight: 700; margin-left: 0; }
        ul.clean { list-style: none; padding: 0; margin: .4rem auto 1rem; display: inline-block; text-align: left; }
        ul.clean li { font-size: .88rem; color: var(--muted); padding: .25rem 0 .25rem 1.4rem; position: relative; }
        ul.clean li::before { content: ""; position: absolute; left: 0; top: .7rem; width: 7px; height: 7px; border-radius: 50%; background: var(--sage); }
        
        .summary-card { background: linear-gradient(165deg,#fff,var(--tint)); border: 1px solid var(--line); border-radius: var(--r); padding: 30px 32px; box-shadow: var(--shadow-md); width: 100%; max-width: 760px; margin: 0 auto; }
        
        /* Updated Summary Layout */
        .sum-section {
          font-family: 'Montserrat', sans-serif; font-size: 1.1rem; color: var(--forest);
          margin: 2rem 0 0.8rem; padding-bottom: 0.4rem; border-bottom: 2px solid var(--line);
          text-align: left;
        }
        .sum-section:first-child { margin-top: 0; }
        .sum-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; padding: .6rem 0; border-bottom: 1px dashed var(--line); font-size: .92rem; text-align: left; }
        .sum-row:last-child { border-bottom: none; }
        .sum-row .k { color: var(--muted); font-weight: 600; flex: 0 0 auto; max-width: 40%; }
        .sum-row .v { color: var(--forest); font-weight: 700; text-align: right; word-break: break-word; }
        
        .wiz-nav { display: flex; justify-content: center; gap: 1rem; margin-top: 2rem; width: 100%; max-width: 800px; }
        .hint { font-size: .8rem; color: var(--muted); background: var(--tint); border-radius: 8px; padding: .55rem .8rem; display: inline-flex; align-items: center; justify-content: center; gap: .45rem; margin: 1.2rem auto 0; text-align: center; max-width: 760px; }

        @media(max-width:880px) {
          .field-grid, .rating-grid { grid-template-columns: 1fr; }
          .rating-grid { gap: 0; }
        }
        @media(max-width:520px) {
          .wrap { padding: 0 18px; }
          .card-block { padding: 20px; }
          .wiz-nav { flex-direction: column-reverse; }
          .wiz-nav .btn { justify-content: center; width: 100%; }
          .steps { justify-content: flex-start; padding-left: 10px; }
        }


        /* ---------- SUCCESS ANIMATION ---------- */
        @keyframes successPop {
          0% { opacity: 0; transform: scale(0.95) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes drawCheck {
          to { stroke-dashoffset: 0; }
        }
        
        .success-card {
          /* This triggers the 0.5s smooth reveal animation */
          animation: successPop 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          background: linear-gradient(165deg, #ffffff, var(--tint));
          border: 1px solid var(--line);
          border-radius: var(--r);
          padding: 70px 40px;
          box-shadow: var(--shadow-lg);
          text-align: center;
          max-width: 600px;
          margin: 40px auto;
          width: 100%;
        }
        .success-icon-wrap {
          width: 86px;
          height: 86px;
          border-radius: 50%;
          background: var(--white);
          border: 4px solid var(--mint);
          box-shadow: 0 12px 30px rgba(42,96,73,.15);
          display: grid;
          place-items: center;
          margin: 0 auto 28px;
          color: var(--sage);
        }
        .success-icon-wrap svg {
          width: 42px;
          height: 42px;
          /* This creates a drawing effect for the checkmark */
          stroke-dasharray: 50;
          stroke-dashoffset: 50;
          animation: drawCheck 0.6s 0.3s ease-out forwards;
        }

        
      `}</style>

      {/* PROGRESS BAR - Updated to include both Logo and Step Tracker */}
{/* PROGRESS BAR - Centered steps with logo on the left */}
      <div className="progress-bar">
        <div style={{ display: "grid", gridTemplateColumns: "120px 1fr 120px", alignItems: "center", padding: "0 20px", borderBottom: "1px solid var(--line)" }}>
          
          {/* Logo on the left */}
          <a href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <img src={Logo} alt="Silke IT" style={{ height: "29px", cursor: "pointer" }} />
          </a>

          {/* Steps strictly centered in the middle */}
          <div className="steps" style={{ display: "flex", justifyContent: "center", padding: "12px 0", overflowX: "auto", width: "100%" }}>            {STEP_LABELS.map((label, i) => {
              const isDone = i < currentStep;
              const isActive = i === currentStep;
              return (
                <React.Fragment key={label}>
                  <button type="button" className={`step ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`} onClick={() => i <= furthestStep && setCurrentStep(i)} disabled={i > furthestStep}>
                    <span className="dot">{isDone ? '✓' : i + 1}</span>
                    {label}
                  </button>
                  {i < STEP_LABELS.length - 1 && <div className="step-sep"></div>}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      <section className="form-section">
        <div className="wrap">

          {/* STEP 0: REVIEW TYPE */}
          {currentStep === 0 && (
            <div className="panel">
              <div className="panel-head">
                <h2>What would you like to review?</h2>
                <p>Select one or more. We’ll only show the sections that match your choice.</p>
              </div>
              <div className="type-grid">
                {[
                  { id: "company", title: "Company experience", desc: "Your overall experience working with Silke IT.", icon: <><path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 9h.01M9 13h.01M9 17h.01M15 9h.01M15 13h.01M15 17h.01"/></> },
                  { id: "service", title: "Specific service", desc: "Review a service we delivered.", icon: <><circle cx="12" cy="12" r="9"/><polygon points="16 8 14 14 8 16 10 10 16 8"/></> },
                  { id: "project", title: "Specific project", desc: "Review a particular engagement.", icon: <><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="14" y2="12"/><line x1="4" y1="18" x2="18" y2="18"/><circle cx="20" cy="12" r="1.5" fill="currentColor"/><circle cx="20" cy="18" r="1.5" fill="currentColor"/></> },
                  { id: "consultant", title: "Consultant / team member", desc: "Feedback on a specific individual.", icon: <><circle cx="12" cy="8" r="4"/><path d="M5 21a7 7 0 0 1 14 0"/></> },
                  { id: "recommendation", title: "Recommendation / testimonial", desc: "Share a recommendation we can publish.", icon: <><circle cx="12" cy="8" r="6"/><path d="M8.5 13.5 7 22l5-3 5 3-1.5-8.5"/></> }
                ].map(type => (
                  <button key={type.id} type="button" className="type-card" aria-pressed={state.types.includes(type.id)} onClick={() => toggleArrayItem("types", type.id)}>
                    <span className="ico">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">{type.icon}</svg>
                    </span>
                    <h4>{type.title}</h4>
                    <p>{type.desc}</p>
                    <span className="tick"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>
                  </button>
                ))}
              </div>
              {errors.types && <div className="error-text" style={{ marginTop: '15px', fontSize: '1rem' }}>{errors.types}</div>}
              
              <div className="wiz-nav">
                <button className="btn btn-primary" onClick={handleNext}>Continue <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></button>
              </div>
            </div>
          )}

          {/* STEP 1: ENGAGEMENT INFO */}
          {currentStep === 1 && (
            <div className="panel">
              <div className="panel-head">
                <h2>Engagement information</h2>
                <p>A little context helps us route and act on your feedback. Nothing here is published without your permission.</p>
              </div>
              <div className="card-block">
                <h3><span className="num">A</span> Organisation</h3>
                <div className="field-grid">
                  <div className="field">
                    <label className="lbl">Organisation name <span className="req">*</span></label>
                    <input type="text" name="orgName" value={state.orgName} onChange={handleChange} placeholder="e.g. Guy’s and St Thomas’" className={errors.orgName ? "input-error" : ""} />
                    {errors.orgName && <span className="error-text">{errors.orgName}</span>}
                  </div>
                  <div className="field">
                    <label className="lbl">Country <span className="req">*</span></label>
                    <input type="text" name="country" value={state.country} onChange={handleChange} placeholder="e.g. United Kingdom" className={errors.country ? "input-error" : ""} />
                    {errors.country && <span className="error-text">{errors.country}</span>}
                  </div>
                  <div className="field full">
                    <label className="lbl">Organisation type <span className="req">*</span></label>
                    <select name="orgType" value={state.orgType} onChange={handleChange} className={errors.orgType ? "input-error" : ""}>
                      <option value="">Select…</option>
                      <option>NHS Trust</option><option>Public hospital</option><option>Private hospital</option>
                      <option>Academic medical centre</option><option>Research hospital</option>
                      <option>Consultancy</option><option>Vendor</option><option>Other</option>
                    </select>
                    {errors.orgType && <span className="error-text">{errors.orgType}</span>}
                  </div>
                </div>
              </div>
              
              <div className="card-block">
                <h3><span className="num">B</span> Engagement details <span className="opt" style={{ fontWeight: 500, color: 'var(--muted)', fontSize: '.78rem', marginLeft: '.4rem' }}>— optional</span></h3>
                <div className="field-grid">
                  <div className="field">
                    <label className="lbl">Project name</label>
                    <input type="text" name="projectName" value={state.projectName} onChange={handleChange} placeholder="e.g. Paediatric Oncology build" />
                  </div>
                  <div className="field">
                    <label className="lbl">Duration</label>
                    <select name="duration" value={state.duration} onChange={handleChange}>
                      <option value="">Select…</option>
                      <option>Less than 3 months</option><option>3–6 months</option><option>6–12 months</option><option>12+ months</option>
                    </select>
                  </div>
                  <div className="field full">
                    <label className="lbl">Services delivered</label>
                    <div className="chips">
                      {["Advisory", "Implementation", "Design & Configuration", "Optimisation", "Programme Recovery"].map(svc => (
                        <button key={svc} type="button" className="chip" aria-pressed={state.services.includes(svc)} onClick={() => toggleArrayItem("services", svc)}>{svc}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="wiz-nav">
                <button className="btn btn-ghost" onClick={handlePrev}>Back</button>
                <button className="btn btn-primary" onClick={handleNext}>Continue <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></button>
              </div>
            </div>
          )}

          {/* STEP 2: RATINGS */}
          {currentStep === 2 && (
            <div className="panel">
              <div className="panel-head">
                <h2>How would you rate the experience?</h2>
                <p>Tap the stars. Leave any line blank if it doesn’t apply to your engagement.</p>
              </div>
              <div className="card-block">
                <h3><span className="num">A</span> Overall experience <span className="req">*</span></h3>
                <div className="star-hero">
                  <StarRow ratingKey="overall" size={46} />
                  {errors.overall && <div className="error-text" style={{ marginTop: '10px' }}>{errors.overall}</div>}
                </div>
              </div>
              <div className="card-block">
                <h3><span className="num">B</span> Service quality assessment <span className="opt" style={{ fontWeight: 500, color: 'var(--muted)', fontSize: '.78rem', marginLeft: '.4rem' }}>— optional</span></h3>
                <div className="rating-grid">
                  {QUALITY.map((name) => (
                    <div className="rating-line" key={name}>
                      <span className="rl-name">{name}</span>
                      <StarRow ratingKey={name} />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="wiz-nav">
                <button className="btn btn-ghost" onClick={handlePrev}>Back</button>
                <button className="btn btn-primary" onClick={handleNext}>Continue <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></button>
              </div>
            </div>
          )}

          {/* STEP 3: IMPACT */}
          {currentStep === 3 && (
            <div className="panel">
              <div className="panel-head">
                <h2>Outcomes &amp; impact</h2>
                <p>This is the part most reviews miss — what actually changed as a result of the work.</p>
              </div>
              <div className="card-block">
                <h3><span className="num">A</span> What positive outcomes were achieved? <span className="opt" style={{ fontWeight: 500, color: 'var(--muted)', fontSize: '.78rem', marginLeft: '.4rem' }}>— optional</span></h3>
                <div className="tiles">
                  {OUTCOMES.map((o) => (
                    <button key={o} type="button" className="tile" aria-pressed={state.outcomes.includes(o)} onClick={() => toggleArrayItem("outcomes", o)}>
                      <span className="tbox"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>
                      <span>{o}</span>
                    </button>
                  ))}
                </div>
                <div className="field full" style={{ marginTop: '1.3rem' }}>
                  <label className="lbl">Describe the impact</label>
                  <textarea name="impact" value={state.impact} onChange={handleChange} placeholder="Please describe any measurable outcomes, benefits or improvements achieved — figures are welcome."></textarea>
                </div>
              </div>
              {hasService && (
                <div className="card-block">
                  <h3><span className="num">B</span> Service-specific feedback <span className="opt" style={{ fontWeight: 500, color: 'var(--muted)', fontSize: '.78rem', marginLeft: '.4rem' }}>— optional</span></h3>
                  <div className="field full" style={{ marginBottom: '1.1rem' }}>
                    <label className="lbl">What worked well?</label>
                    <textarea name="workedWell" value={state.workedWell} onChange={handleChange} placeholder="Describe the areas that delivered the most value."></textarea>
                  </div>
                  <div className="field full">
                    <label className="lbl">Opportunities for improvement</label>
                    <textarea name="improve" value={state.improve} onChange={handleChange} placeholder="If anything could have been better, please let us know."></textarea>
                  </div>
                </div>
              )}
              <div className="wiz-nav">
                <button className="btn btn-ghost" onClick={handlePrev}>Back</button>
                <button className="btn btn-primary" onClick={handleNext}>Continue <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></button>
              </div>
            </div>
          )}

          {/* STEP 4: RECOMMENDATION */}
          {currentStep === 4 && (
            <div className="panel">
              <div className="panel-head">
                <h2>Recommendation</h2>
                <p>Optional, and entirely on your terms — you choose whether and how anything is published.</p>
              </div>

              {hasConsultant && (
                <div className="card-block">
                  <h3><span className="num">A</span> Consultant feedback</h3>
                  <div className="field-grid" style={{
    marginBottom: "1.1rem",
    display: "flex",
    justifyContent: "center",
  }}>
                    <div className="field"><label className="lbl">Consultant name</label>
                      <select name="consultant" value={state.consultant} onChange={handleChange}>
                        <option value="">Select…</option>
                        <option>Kenny Silke</option>
                        <option>Other / not listed</option>
                      </select>
                    </div>
                  </div>
                  <label className="lbl" style={{ display: 'block', marginBottom: '.6rem' }}>Areas of excellence</label>
                  <div className="chips" style={{ marginBottom: '1.1rem' }}>
                    {EXCELLENCE.map((e) => (
                      <button key={e} type="button" className="chip" aria-pressed={state.excellence.includes(e)} onClick={() => toggleArrayItem("excellence", e)}>{e}</button>
                    ))}
                  </div>
                  <div className="field full">
                    <label className="lbl">Additional feedback</label>
                    <textarea name="consultantNotes" value={state.consultantNotes} onChange={handleChange} placeholder="Anything you'd like to add about working with this individual."></textarea>
                  </div>
                </div>
              )}

              <div className="card-block" style={{ background: 'var(--tint)', borderColor: '#cfe6dc' }}>
                <h3><span className="num">{hasConsultant ? 'B' : 'A'}</span> Share a recommendation</h3>
                <label className="lbl" style={{ display: 'block', marginBottom: '.5rem' }}>Would you be willing to provide a testimonial or recommendation?</label>
                <div className="radio-row">
                  {["Yes", "No"].map((val) => (
                    <button key={val} type="button" className="radio-pill" aria-pressed={state.willing === val} onClick={() => setState((prev) => ({ ...prev, willing: prev.willing === val ? null : val }))}>
                      {val}
                    </button>
                  ))}
                </div>
                {state.willing === "Yes" && (
                  <div style={{ marginTop: '1.2rem', width: '100%' }}>
                    <div className="field full" style={{ marginBottom: '1.2rem' }}>
                      <label className="lbl">Your recommendation <span className="req">*</span></label>
                      <textarea name="recommendation" value={state.recommendation} onChange={handleChange} placeholder="Describe your experience working with Silke IT and the impact delivered for your organisation." className={errors.recommendation ? "input-error" : ""}></textarea>
                      {errors.recommendation && <span className="error-text">{errors.recommendation}</span>}
                    </div>
                    <label className="lbl" style={{ display: 'block', marginBottom: '.6rem' }}>May we publish your recommendation?</label>
                    <div className="chips">
                      {PUBLISH.map((p) => (
                        <button key={p} type="button" className="chip" aria-pressed={state.publish.includes(p)} onClick={() => toggleArrayItem("publish", p)}>{p}</button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="wiz-nav">
                <button className="btn btn-ghost" onClick={handlePrev}>Back</button>
                <button className="btn btn-primary" onClick={handleNext}>Continue <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></button>
              </div>
            </div>
          )}

          {/* STEP 5: PRIVACY */}
          {currentStep === 5 && (
            <div className="panel">
              <div className="panel-head">
                <h2>Recognition &amp; privacy</h2>
                <p>Your details are only ever used in line with the permissions you set.</p>
              </div>
              <div className="card-block">
                <h3><span className="num">A</span> Your details <span className="opt" style={{ fontWeight: 500, color: 'var(--muted)', fontSize: '.78rem', marginLeft: '.4rem' }}>— some optional</span></h3>
                <div className="field-grid">
                  <div className="field">
                    <label className="lbl">Your name <span className="opt">(optional)</span></label>
                    <input type="text" name="name" value={state.name} onChange={handleChange} />
                  </div>
                  <div className="field"><label className="lbl">Job title <span className="opt">(optional)</span></label><input type="text" name="title" value={state.title} onChange={handleChange} /></div>
                  <div className="field"><label className="lbl">Organisation <span className="opt">(optional)</span></label><input type="text" name="org2" value={state.org2} onChange={handleChange} /></div>
                  <div className="field"><label className="lbl">LinkedIn profile <span className="opt">(optional)</span></label><input type="url" name="linkedin" value={state.linkedin} onChange={handleChange} placeholder="https://" /></div>
                </div>
                <p style={{ fontSize: '.78rem', color: 'var(--muted)', margin: '.9rem 0 0' }}>Used only if you grant publication permission.</p>
              </div>
              <div className="card-block gdpr-card">
                <h3>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2A6049" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3z"/></svg> Privacy &amp; consent
                </h3>
                <div className="gdpr-content">
                  <p style={{ fontSize: '.88rem', color: 'var(--muted)', margin: '0 0 .3rem' }}>Your feedback will only be used for:</p>
                  <ul className="clean">
                    <li>Service improvement</li>
                    <li>Quality assurance</li>
                    <li>Client experience reporting</li>
                    <li>Approved testimonials and case studies</li>
                  </ul>
                  <p style={{ fontSize: '.85rem', color: 'var(--forest)', fontWeight: 600 }}>Your personal information is never sold or shared with third parties.</p>
                  <div style={{ marginTop: '1rem', width: '100%' }}>
                    <label className="consent">
                      <input type="checkbox" name="consentProcess" checked={state.consentProcess} onChange={handleChange} />
                      <span style={{ color: errors.consentProcess ? "var(--red)" : "inherit" }}><span className="req">Required.</span> I consent to Silke IT processing my feedback.</span>
                    </label>
                    {errors.consentProcess && <div className="error-text" style={{textAlign: "left", paddingLeft: "28px", marginTop: "-4px", marginBottom: "8px"}}>{errors.consentProcess}</div>}

                    <label className="consent">
                      <input type="checkbox" name="consentRemoval" checked={state.consentRemoval} onChange={handleChange} />
                      <span style={{ color: errors.consentRemoval ? "var(--red)" : "inherit" }}><span className="req">Required.</span> I understand I may request removal of my personal information at any time.</span>
                    </label>
                    {errors.consentRemoval && <div className="error-text" style={{textAlign: "left", paddingLeft: "28px", marginTop: "-4px", marginBottom: "8px"}}>{errors.consentRemoval}</div>}

                    <label className="consent"><input type="checkbox" name="consentContact" checked={state.consentContact} onChange={handleChange} /><span>I consent to being contacted about my feedback. <span className="opt" style={{ color: 'var(--muted)' }}>(optional)</span></span></label>
                    <label className="consent"><input type="checkbox" name="consentPublish" checked={state.consentPublish} onChange={handleChange} /><span>I consent to publication of approved testimonial content. <span className="opt" style={{ color: 'var(--muted)' }}>(optional)</span></span></label>
                  </div>
                </div>
              </div>
              <div className="wiz-nav">
                <button className="btn btn-ghost" onClick={handlePrev}>Back</button>
                <button className="btn btn-primary" onClick={handleNext}>Review &amp; submit <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></button>
              </div>
            </div>
          )}

          {/* STEP 6: SUMMARY */}
          {/* STEP 6: SUMMARY */}
          {currentStep === 6 && (
            <div className="panel">
              {isSubmitted ? (
                <div className="success-card">
                  <div className="success-icon-wrap">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <h2 style={{ fontSize: '2.2rem', marginBottom: '16px', color: 'var(--forest)' }}>
                    Thank You!
                  </h2>
                  <p style={{ color: 'var(--muted)', fontSize: '1.05rem', lineHeight: '1.6', maxWidth: '400px', margin: '0 auto' }}>
                    Your feedback has been successfully submitted and is highly appreciated.
                    <br /><br />
                    <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>Redirecting you automatically...</span>
                  </p>
                </div>
              ) : (
                <>
                  <div className="panel-head">
                    <h2>Review your feedback</h2>
                    <p>A quick check before you send. You can go back and change anything.</p>
                  </div>
                  
                  <div className="summary-card">
                    {/* ... KEEP YOUR EXISTING SUMMARY ROW CODE HERE ... */}
                    
                    <h4 className="sum-section">Review Overview</h4>
                    <div className="sum-row"><span className="k">Review type</span><span className="v">{getTypesLabel()}</span></div>

                    <h4 className="sum-section">Engagement Information</h4>
                    {state.orgName && <div className="sum-row"><span className="k">Organisation name</span><span className="v">{state.orgName}</span></div>}
                    {state.country && <div className="sum-row"><span className="k">Country</span><span className="v">{state.country}</span></div>}
                    {state.orgType && <div className="sum-row"><span className="k">Organisation type</span><span className="v">{state.orgType}</span></div>}
                    {state.projectName && <div className="sum-row"><span className="k">Project name</span><span className="v">{state.projectName}</span></div>}
                    {state.duration && <div className="sum-row"><span className="k">Duration</span><span className="v">{state.duration}</span></div>}
                    {state.services.length > 0 && <div className="sum-row"><span className="k">Services reviewed</span><span className="v">{state.services.join(", ")}</span></div>}

                    <h4 className="sum-section">Ratings & Experience</h4>
                    <div className="sum-row"><span className="k">Overall rating</span><span className="v">{state.ratings.overall ? `${state.ratings.overall} / 5 ★` : "Not rated"}</span></div>
                    {Object.entries(state.ratings).map(([key, val]) => {
                      if (key === 'overall' || !val) return null;
                      return <div className="sum-row" key={key}><span className="k">{key}</span><span className="v">{val} / 5 ★</span></div>
                    })}

                    <h4 className="sum-section">Outcomes & Impact</h4>
                    {state.outcomes.length > 0 && <div className="sum-row"><span className="k">Positive outcomes</span><span className="v">{state.outcomes.join(", ")}</span></div>}
                    {state.impact && <div className="sum-row"><span className="k">Impact description</span><span className="v">{state.impact}</span></div>}
                    {state.workedWell && <div className="sum-row"><span className="k">What worked well</span><span className="v">{state.workedWell}</span></div>}
                    {state.improve && <div className="sum-row"><span className="k">Opportunities for improvement</span><span className="v">{state.improve}</span></div>}

                    {hasConsultant && (
                      <>
                        <h4 className="sum-section">Consultant Feedback</h4>
                        {state.consultant && <div className="sum-row"><span className="k">Consultant name</span><span className="v">{state.consultant}</span></div>}
                        {state.excellence.length > 0 && <div className="sum-row"><span className="k">Areas of excellence</span><span className="v">{state.excellence.join(", ")}</span></div>}
                        {state.consultantNotes && <div className="sum-row"><span className="k">Additional feedback</span><span className="v">{state.consultantNotes}</span></div>}
                      </>
                    )}

                    <h4 className="sum-section">Recommendation Status</h4>
                    {state.willing && <div className="sum-row"><span className="k">Willing to recommend?</span><span className="v">{state.willing}</span></div>}
                    {state.recommendation && <div className="sum-row"><span className="k">Recommendation</span><span className="v">{state.recommendation}</span></div>}
                    {state.publish.length > 0 && <div className="sum-row"><span className="k">Publication permission</span><span className="v">{state.publish.join(", ")}</span></div>}

                    <h4 className="sum-section">Your Details & Consent</h4>
                    {state.name && <div className="sum-row"><span className="k">Name</span><span className="v">{state.name}</span></div>}
                    {state.title && <div className="sum-row"><span className="k">Job title</span><span className="v">{state.title}</span></div>}
                    {state.org2 && <div className="sum-row"><span className="k">Organisation (Details)</span><span className="v">{state.org2}</span></div>}
                    {state.linkedin && <div className="sum-row"><span className="k">LinkedIn profile</span><span className="v">{state.linkedin}</span></div>}
                    
                    <div className="sum-row"><span className="k">Consent to process data</span><span className="v">{state.consentProcess ? "Yes" : "No"}</span></div>
                    <div className="sum-row"><span className="k">Acknowledge removal rights</span><span className="v">{state.consentRemoval ? "Yes" : "No"}</span></div>
                    <div className="sum-row"><span className="k">Consent to contact</span><span className="v">{state.consentContact ? "Yes" : "No"}</span></div>
                    <div className="sum-row"><span className="k">Consent to publish</span><span className="v">{state.consentPublish ? "Yes" : "No"}</span></div>
                  </div>
                  
                  <div className="wiz-nav">
                    <button className="btn btn-ghost" onClick={handlePrev}>Back</button>
                    <button className="btn btn-primary" onClick={handleSubmit}>Submit feedback <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4 20-7z"/></svg></button>
                  </div>
                </>
              )}
            </div>
          )}

        </div>
      </section>
    </>
  );
}