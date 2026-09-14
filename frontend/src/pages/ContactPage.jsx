// import React, { useEffect, useState } from "react";
// import "../styles/contactPage.css";
// import Footer from "../components/Footer";

// const API_BASE_URL = import.meta.env.VITE_API_URL || "";

// const ContactPage = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     subject: "Other",
//     message: "",
//   });

//   const [submitted, setSubmitted] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState("");

//   /* =====================================================
//      ALWAYS START CONTACT PAGE FROM TOP
//   ===================================================== */

//   useEffect(() => {
//     window.scrollTo({
//       top: 0,
//       left: 0,
//       behavior: "auto",
//     });

//     document.documentElement.scrollTop = 0;
//     document.body.scrollTop = 0;
//   }, []);

//   /* =====================================================
//      FORM CHANGE
//   ===================================================== */

//   const handleChange = (e) => {
//   setFormData({
//     ...formData,
//     [e.target.name]: e.target.value,
//   });

//   if (error) {
//     setError("");
//   }
// };

//   /* =====================================================
//      FORM SUBMIT
//   ===================================================== */

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setSubmitting(true);
//     setSubmitted(false);
//     setError("");

//     try {
//       const response = await fetch(`${API_BASE_URL}/contact`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           name: formData.name.trim(),
//           email: formData.email.trim(),
//           phone: formData.phone.trim(),
//           subject: formData.subject || "Other",
//           message: formData.message.trim(),
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           data?.detail || data?.message || "Failed to submit enquiry."
//         );
//       }

//       console.log("Contact form submitted successfully:", data);

//       setSubmitted(true);

//       setFormData({
//         name: "",
//         email: "",
//         phone: "",
//         subject: "Other",
//         message: "",
//       });

//       setTimeout(() => {
//         setSubmitted(false);
//       }, 5000);
//     } catch (err) {
//       console.error("Contact form submission error:", err);

//       setError(
//         err instanceof Error
//           ? err.message
//           : "Something went wrong. Please try again."
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="contact-page">
//       {/* =====================================================
//           HERO
//       ===================================================== */}

//       <section className="contact-hero">
//         <div className="contact-hero-orb contact-orb-one"></div>
//         <div className="contact-hero-orb contact-orb-two"></div>

//         <div className="contact-hero-grid"></div>

//         <div className="contact-hero-container">
//           <div className="contact-hero-content">
//             <h1>
//               Let’s talk about
//               <span> what’s next.</span>
//             </h1>

//             <p>
//               Have a question, an idea, or a project in mind?
//               Tell us what you’re working on and our team will
//               get back to you within 24 hours.
//             </p>

//             <div className="contact-hero-bottom">
//               <div className="hero-response">
//                 <div className="response-icon">
//                   <span></span>
//                 </div>

//                 <div>
//                   <small>AVERAGE RESPONSE</small>
//                   <strong>Within 24 hours</strong>
//                 </div>
//               </div>

//               <div className="hero-email">
//                 <small>WRITE TO US</small>

//                 <a href="mailto:info@yuktic.com">
//                   info@yuktic.com
//                   <span>↗</span>
//                 </a>
//               </div>
//             </div>
//           </div>

//           <div className="contact-hero-side">
//             <div className="hero-side-card">
//               <div className="side-card-top">
//                 <span>01</span>
//                 <span>START HERE</span>
//               </div>

//               <div className="side-card-line"></div>

//               <h3>
//                 Tell us a little
//                 <br />
//                 <em>about yourself.</em>
//               </h3>

//               <p>
//                 The more context you share, the better we can
//                 understand how to help.
//               </p>

//               <div className="side-arrow">↓</div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* =====================================================
//           MAIN CONTACT
//       ===================================================== */}

//       <section className="contact-main">
//         <div className="contact-main-container">
//           {/* =================================================
//               CONTACT INFORMATION
//           ================================================= */}

//           <aside className="contact-info">
//             <div className="info-label">GET IN TOUCH</div>

//             <h2>
//               Start a
//               <br />
//               <span>conversation.</span>
//             </h2>

//             <p className="info-intro">
//               Whether you’re reaching out with a question,
//               exploring an opportunity, or simply want to
//               know more about Yuktic, we’re here to listen.
//             </p>

//             <div className="info-items">
//               <div className="info-item">
//                 <div className="info-number">01</div>

//                 <div className="info-item-content">
//                   <small>EMAIL</small>

//                   <a href="mailto:info@yuktic.com">
//                     info@yuktic.com
//                   </a>
//                 </div>
//               </div>

//               <div className="info-item">
//                 <div className="info-number">02</div>

//                 <div className="info-item-content">
//                   <small>RESPONSE TIME</small>

//                   <strong>Within 24 hours</strong>
//                 </div>
//               </div>

//               <div className="info-item">
//                 <div className="info-number">03</div>

//                 <div className="info-item-content">
//                   <small>WHAT TO EXPECT</small>

//                   <strong>A thoughtful response</strong>
//                 </div>
//               </div>
//             </div>

//             <div className="info-highlight">
//               <div className="highlight-mark">“</div>

//               <p>
//                 Good conversations often lead to
//                 great things.
//               </p>
//             </div>
//           </aside>

//           {/* =================================================
//               CONTACT FORM
//           ================================================= */}

//           <div className="contact-form-card">
//             <div className="form-card-header">
//               <div>
//                 <span>SEND A MESSAGE</span>

//                 <h3>How can we help?</h3>
//               </div>
//             </div>

//             {/* =================================================
//                 SUCCESS MESSAGE
//             ================================================= */}

//             {submitted && (
//               <div className="contact-success">
//                 <div className="success-icon">✓</div>

//                 <div>
//                   <strong>Thanks for reaching out.</strong>

//                   <p>
//                     Your message has been received.
//                     We’ll get back to you within 24 hours.
//                   </p>
//                 </div>
//               </div>
//             )}

//             {/* =================================================
//                 ERROR MESSAGE
//             ================================================= */}

//             {error && (
//               <div
//                 className="contact-error"
//                 role="alert"
//               >
//                 <strong>Unable to send your message.</strong>

//                 <p>{error}</p>
//               </div>
//             )}

//             <form onSubmit={handleSubmit}>
//               {/* =================================================
//                   NAME + EMAIL
//               ================================================= */}

//               <div className="form-row">
//                 <div className="form-field">
//                   <label htmlFor="name">
//                     <span>01</span>
//                     Full name
//                   </label>

//                   <input
//                     type="text"
//                     id="name"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     placeholder="Enter your full name"
//                     autoComplete="name"
//                     required
//                     disabled={submitting}
//                   />
//                 </div>

//                 <div className="form-field">
//                   <label htmlFor="email">
//                     <span>02</span>
//                     Email address
//                   </label>

//                   <input
//                     type="email"
//                     id="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     placeholder="you@example.com"
//                     autoComplete="email"
//                     required
//                     disabled={submitting}
//                   />
//                 </div>
//               </div>

//               {/* =================================================
//                   PHONE
//               ================================================= */}

//               <div className="form-row">
//                 <div className="form-field">
//                   <label htmlFor="phone">
//                     <span>03</span>
//                     Phone number
//                   </label>

//                   <input
//                     type="tel"
//                     id="phone"
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleChange}
//                     placeholder="+91 00000 00000"
//                     autoComplete="tel"
//                     required
//                     disabled={submitting}
//                   />
//                 </div>
//               </div>

//               {/* =================================================
//                   SUBJECT
//               ================================================= */}

//               <div className="form-field full-field">
//                 <label htmlFor="subject">
//                   <span>04</span>
//                   Subject
//                 </label>

//                 <select
//                   id="subject"
//                   name="subject"
//                   value={formData.subject}
//                   onChange={handleChange}
//                   required
//                   disabled={submitting}
//                 >
//                   <option value="Fixed Cost">
//                     Fixed Cost
//                   </option>

//                   <option value="Time & Material">
//                     Time & Material
//                   </option>

//                   <option value="Staff Augmentation">
//                     Staff Augmentation
//                   </option>

//                   <option value="Recruitment">
//                     Recruitment
//                   </option>

//                   <option value="Other">
//                     Other
//                   </option>
//                 </select>
//               </div>

//               {/* =================================================
//                   MESSAGE
//               ================================================= */}

//               <div className="form-field full-field message-field">
//                 <label htmlFor="message">
//                   <span>05</span>
//                   Message
//                 </label>

//                 <textarea
//                   id="message"
//                   name="message"
//                   value={formData.message}
//                   onChange={handleChange}
//                   placeholder="Tell us what’s on your mind..."
//                   rows={7}
//                   required
//                   disabled={submitting}
//                 ></textarea>
//               </div>

//               {/* =================================================
//                   SUBMIT
//               ================================================= */}

//               <div className="form-submit-area">
//                 <div className="form-privacy">
//                   <div className="privacy-symbol">✓</div>

//                   <p>
//                     Your information is used only to
//                     respond to your enquiry.
//                   </p>
//                 </div>

//                 <button
//                   type="submit"
//                   className="contact-submit"
//                   disabled={submitting}
//                 >
//                   <span>
//                     {submitting
//                       ? "Sending..."
//                       : "Send message"}
//                   </span>

//                   <div className="submit-arrow">
//                     {submitting ? "..." : "↗"}
//                   </div>
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </section>

//       {/* =====================================================
//           WHY REACH OUT
//       ===================================================== */}

//       <section className="contact-values">
//         <div className="values-container">
//           <div className="values-intro">
//             <h2>
//               One message can
//               <br />
//               <em>start something.</em>
//             </h2>
//           </div>

//           <div className="values-grid">
//             {/* CARD 01 */}

//             <div className="value-card">
//               <div className="value-card-top">
//                 <span className="value-number">01</span>

//                 <div className="value-icon">→</div>
//               </div>

//               <div className="value-card-content">
//                 <h3>Clear answers</h3>

//                 <p>
//                   Ask us anything. We’ll give you a
//                   straightforward answer without
//                   unnecessary complexity.
//                 </p>
//               </div>
//             </div>

//             {/* CARD 02 */}

//             <div className="value-card">
//               <div className="value-card-top">
//                 <span className="value-number">02</span>

//                 <div className="value-icon">↗</div>
//               </div>

//               <div className="value-card-content">
//                 <h3>Real conversations</h3>

//                 <p>
//                   Every enquiry is reviewed by a real
//                   member of our team who understands
//                   the context behind your message.
//                 </p>
//               </div>
//             </div>

//             {/* CARD 03 */}

//             <div className="value-card">
//               <div className="value-card-top">
//                 <span className="value-number">03</span>

//                 <div className="value-icon">✦</div>
//               </div>

//               <div className="value-card-content">
//                 <h3>Fast response</h3>

//                 <p>
//                   We aim to respond to every genuine
//                   enquiry within 24 hours.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* =====================================================
//           FINAL CTA
//       ===================================================== */}

//       <section className="contact-final">
//         <div className="final-decoration"></div>

//         <div className="contact-final-container">
//           <div className="final-copy">
//             <h2>
//               Just say
//               <br />
//               <em>hello.</em>
//             </h2>
//           </div>

//           <div className="final-right">
//             <p>
//               No complicated process.
//               No unnecessary steps.
//               Just send us a message.
//             </p>

//             <a
//               href="mailto:info@yuktic.com"
//               className="final-email"
//             >
//               <span>info@yuktic.com</span>

//               <strong>↗</strong>
//             </a>
//           </div>
//         </div>

//         <br />
//         <br />
//         <br />
//       </section>

//       {/* =====================================================
//           FOOTER
//       ===================================================== */}

//       <Footer />
//     </div>
//   );
// };

// export default ContactPage;


import React, { useEffect, useState } from "react";
import "../styles/contactPage.css";
import Footer from "../components/Footer";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Other",
    message: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [sharingType, setSharingType] = useState("");

  /* =====================================================
     ALWAYS START CONTACT PAGE FROM TOP
  ===================================================== */

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });

    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  /* =====================================================
     VALIDATION
  ===================================================== */

  const validateForm = () => {
    const errors = {};

    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const message = formData.message.trim();

    /* NAME */
    if (!name) {
      errors.name = "Please enter your full name.";
    } else if (name.length < 2) {
      errors.name = "Name must contain at least 2 characters.";
    } else if (!/^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s.'-]*$/.test(name)) {
      errors.name = "Please enter a valid name.";
    }

    /* EMAIL */
    if (!email) {
      errors.email = "Please enter your email address.";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
    ) {
      errors.email = "Please enter a valid email address.";
    }

    /* PHONE */
    if (!phone) {
      errors.phone = "Please enter your phone number.";
    } else {
      const phoneDigits = phone.replace(/\D/g, "");

      if (phoneDigits.length < 10 || phoneDigits.length > 15) {
        errors.phone =
          "Please enter a valid phone number";
      } else if (!/^[+()\d\s.-]+$/.test(phone)) {
        errors.phone = "Please enter a valid phone number.";
      }
    }

    /* SUBJECT */
    if (!formData.subject) {
      errors.subject = "Please select a subject.";
    }

    /* MESSAGE */
    if (!message) {
      errors.message = "Please enter your message.";
    } else if (message.length < 10) {
      errors.message =
        "Please provide a little more detail (at least 10 characters).";
    } else if (message.length > 5000) {
      errors.message =
        "Message is too long. Please keep it under 5000 characters.";
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  };

  /* =====================================================
     FORM CHANGE
  ===================================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSubmitted(false);

    /* Remove only the error for the field being edited */
    setFieldErrors((previous) => {
      if (!previous[name]) {
        return previous;
      }

      const updated = { ...previous };
      delete updated[name];

      return updated;
    });
  };

  /* =====================================================
     BLUR VALIDATION
  ===================================================== */

  const handleBlur = (e) => {
    const { name } = e.target;
    const value = formData[name].trim();

    let message = "";

    if (name === "name") {
      if (!value) {
        message = "Please enter your full name.";
      } else if (value.length < 2) {
        message = "Name must contain at least 2 characters.";
      } else if (!/^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s.'-]*$/.test(value)) {
        message = "Please enter a valid name.";
      }
    }

    if (name === "email") {
      if (!value) {
        message = "Please enter your email address.";
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
      ) {
        message = "Please enter a valid email address.";
      }
    }

    if (name === "phone") {
      const phoneDigits = value.replace(/\D/g, "");

      if (!value) {
        message = "Please enter your phone number.";
      } else if (phoneDigits.length < 10 || phoneDigits.length > 15) {
        message = "Please enter a valid phone number";
      } else if (!/^[+()\d\s.-]+$/.test(value)) {
        message = "Please enter a valid phone number.";
      }
    }

    if (name === "message") {
      if (!value) {
        message = "Please enter your message.";
      } else if (value.length < 10) {
        message =
          "Please provide a little more detail (at least 10 characters).";
      } else if (value.length > 5000) {
        message =
          "Message is too long. Please keep it under 5000 characters.";
      }
    }

    if (message) {
      setFieldErrors((previous) => ({
        ...previous,
        [name]: message,
      }));
    }
  };

  /* =====================================================
     FORM SUBMIT
  ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) {
      return;
    }

    setError("");
    setSubmitted(false);

    /* Validate before contacting backend */
    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          subject: formData.subject || "Other",
          message: formData.message.trim(),
        }),
      });

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            data?.message ||
            "Failed to submit enquiry. Please try again."
        );
      }

      console.log("Contact form submitted successfully:", data);

      /*
       * Backend may return:
       * {
       *   sharing_type: "INTERNAL"
       * }
       *
       * or:
       * {
       *   sharingType: "INTERNAL"
       * }
       *
       * Support both.
       */
      const returnedSharingType =
        data?.sharing_type ||
        data?.sharingType ||
        data?.share_type ||
        data?.shareType ||
        data?.type ||
        "";

      setSharingType(
        returnedSharingType
          ? String(returnedSharingType).toUpperCase()
          : ""
      );

      setSubmitted(true);

      setFieldErrors({});

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "Other",
        message: "",
      });

      /*
       * Keep success popup visible long enough
       * for the user to clearly understand what happened.
       */
      setTimeout(() => {
        setSubmitted(false);
        setSharingType("");
      }, 6000);
    } catch (err) {
      console.error("Contact form submission error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* =====================================================
     SHARING MESSAGE
  ===================================================== */

  const getSharingMessage = () => {
    if (sharingType === "INTERNAL") {
      return "Your contact details have been successfully shared with our internal team.";
    }

    if (sharingType === "EXTERNAL") {
      return "Your contact details have been successfully shared with the appropriate external team.";
    }

    if (sharingType) {
      return `Your contact details have been successfully shared as ${sharingType}.`;
    }

    return "Your contact details and message have been successfully shared with our team.";
  };

  return (
    <div className="contact-page">

      {/* =====================================================
          PROCESSING POPUP
      ===================================================== */}

      {submitting && (
        <div
          className="contact-submit-overlay"
          role="status"
          aria-live="polite"
        >
          <div className="contact-submit-popup">

            <div className="submit-loading-icon">
              <span></span>
            </div>

            <div className="submit-popup-content">
              <span className="submit-popup-label">
                CONTACT REQUEST
              </span>

              <h3>Sharing your contact...</h3>

              <p>
                Please wait while we securely process and
                share your enquiry with the appropriate team.
              </p>
            </div>

            <div className="submit-progress">
              <span></span>
            </div>

          </div>
        </div>
      )}

      {/* =====================================================
          SUCCESS POPUP
      ===================================================== */}

      {submitted && !submitting && (
        <div
          className="contact-submit-overlay contact-success-overlay"
          role="alert"
        >
          <div className="contact-submit-popup contact-success-popup">

            <div className="submit-success-icon">
              ✓
            </div>

            <div className="submit-popup-content">
              <span className="submit-popup-label success-label">
                CONTACT SHARED
              </span>

              <h3>Contact shared successfully.</h3>

              <p>
                {getSharingMessage()}
              </p>

              <small>
                We’ll get back to you within 24 hours.
              </small>
            </div>

            <button
              type="button"
              className="success-close-button"
              onClick={() => {
                setSubmitted(false);
                setSharingType("");
              }}
              aria-label="Close success message"
            >
              ×
            </button>

          </div>
        </div>
      )}

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="contact-hero">
        <div className="contact-hero-orb contact-orb-one"></div>
        <div className="contact-hero-orb contact-orb-two"></div>

        <div className="contact-hero-grid"></div>

        <div className="contact-hero-container">
          <div className="contact-hero-content">
            <h1>
              Let’s talk about
              <span> what’s next.</span>
            </h1>

            <p>
              Have a question, an idea, or a project in mind?
              Tell us what you’re working on and our team will
              get back to you within 24 hours.
            </p>

            <div className="contact-hero-bottom">
              <div className="hero-response">
                <div className="response-icon">
                  <span></span>
                </div>

                <div>
                  <small>AVERAGE RESPONSE</small>
                  <strong>Within 24 hours</strong>
                </div>
              </div>

              <div className="hero-email">
                <small>WRITE TO US</small>

                <a href="mailto:info@yuktic.com">
                  info@yuktic.com
                  <span>↗</span>
                </a>
              </div>
            </div>
          </div>

          <div className="contact-hero-side">
            <div className="hero-side-card">
              <div className="side-card-top">
                <span>01</span>
                <span>START HERE</span>
              </div>

              <div className="side-card-line"></div>

              <h3>
                Tell us a little
                <br />
                <em>about yourself.</em>
              </h3>

              <p>
                The more context you share, the better we can
                understand how to help.
              </p>

              <div className="side-arrow">↓</div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN CONTACT
      ===================================================== */}

      <section className="contact-main">
        <div className="contact-main-container">

          {/* CONTACT INFORMATION */}

          <aside className="contact-info">
            <div className="info-label">GET IN TOUCH</div>

            <h2>
              Start a
              <br />
              <span>conversation.</span>
            </h2>

            <p className="info-intro">
              Whether you’re reaching out with a question,
              exploring an opportunity, or simply want to
              know more about Yuktic, we’re here to listen.
            </p>

            <div className="info-items">
              <div className="info-item">
                <div className="info-number">01</div>

                <div className="info-item-content">
                  <small>EMAIL</small>

                  <a href="mailto:info@yuktic.com">
                    info@yuktic.com
                  </a>
                </div>
              </div>

              <div className="info-item">
                <div className="info-number">02</div>

                <div className="info-item-content">
                  <small>RESPONSE TIME</small>

                  <strong>Within 24 hours</strong>
                </div>
              </div>

              <div className="info-item">
                <div className="info-number">03</div>

                <div className="info-item-content">
                  <small>WHAT TO EXPECT</small>

                  <strong>A thoughtful response</strong>
                </div>
              </div>
            </div>

            <div className="info-highlight">
              <div className="highlight-mark">“</div>

              <p>
                Good conversations often lead to
                great things.
              </p>
            </div>
          </aside>

          {/* CONTACT FORM */}

          <div className="contact-form-card">

            <div className="form-card-header">
              <div>
                <span>SEND A MESSAGE</span>
                <h3>How can we help?</h3>
              </div>
            </div>

            {/* ERROR MESSAGE */}

            {error && (
              <div
                className="contact-error"
                role="alert"
              >
                <strong>Unable to send your message.</strong>

                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>

              {/* NAME + EMAIL */}

              <div className="form-row">

                <div
                  className={`form-field ${
                    fieldErrors.name ? "has-error" : ""
                  }`}
                >
                  <label htmlFor="name">
                    <span>01</span>
                    Full name
                  </label>

                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    required
                    disabled={submitting}
                    aria-invalid={Boolean(fieldErrors.name)}
                    aria-describedby={
                      fieldErrors.name ? "name-error" : undefined
                    }
                  />

                  {fieldErrors.name && (
                    <div
                      id="name-error"
                      className="field-error"
                    >
                      <span>!</span>
                      {fieldErrors.name}
                    </div>
                  )}
                </div>

                <div
                  className={`form-field ${
                    fieldErrors.email ? "has-error" : ""
                  }`}
                >
                  <label htmlFor="email">
                    <span>02</span>
                    Email address
                  </label>

                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    disabled={submitting}
                    aria-invalid={Boolean(fieldErrors.email)}
                    aria-describedby={
                      fieldErrors.email ? "email-error" : undefined
                    }
                  />

                  {fieldErrors.email && (
                    <div
                      id="email-error"
                      className="field-error"
                    >
                      <span>!</span>
                      {fieldErrors.email}
                    </div>
                  )}
                </div>

              </div>

              {/* PHONE */}

              <div className="form-row">

                <div
                  className={`form-field ${
                    fieldErrors.phone ? "has-error" : ""
                  }`}
                >
                  <label htmlFor="phone">
                    <span>03</span>
                    Phone number
                  </label>

                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="+91 00000 00000"
                    autoComplete="tel"
                    required
                    disabled={submitting}
                    inputMode="tel"
                    aria-invalid={Boolean(fieldErrors.phone)}
                    aria-describedby={
                      fieldErrors.phone ? "phone-error" : undefined
                    }
                  />

                  {fieldErrors.phone && (
                    <div
                      id="phone-error"
                      className="field-error"
                    >
                      <span>!</span>
                      {fieldErrors.phone}
                    </div>
                  )}
                </div>

              </div>

              {/* SUBJECT */}

              <div
                className={`form-field full-field ${
                  fieldErrors.subject ? "has-error" : ""
                }`}
              >
                <label htmlFor="subject">
                  <span>04</span>
                  Subject
                </label>

                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                  aria-invalid={Boolean(fieldErrors.subject)}
                >
                  <option value="Fixed Cost">
                    Fixed Cost
                  </option>

                  <option value="Time & Material">
                    Time & Material
                  </option>

                  <option value="Staff Augmentation">
                    Staff Augmentation
                  </option>

                  <option value="Recruitment">
                    Recruitment
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>

                {fieldErrors.subject && (
                  <div className="field-error">
                    <span>!</span>
                    {fieldErrors.subject}
                  </div>
                )}
              </div>

              {/* MESSAGE */}

              <div
                className={`form-field full-field message-field ${
                  fieldErrors.message ? "has-error" : ""
                }`}
              >
                <label htmlFor="message">
                  <span>05</span>
                  Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Tell us what’s on your mind..."
                  rows={7}
                  required
                  disabled={submitting}
                  maxLength={5000}
                  aria-invalid={Boolean(fieldErrors.message)}
                  aria-describedby={
                    fieldErrors.message ? "message-error" : undefined
                  }
                ></textarea>

                <div className="message-footer">
                  {fieldErrors.message ? (
                    <div
                      id="message-error"
                      className="field-error"
                    >
                      <span>!</span>
                      {fieldErrors.message}
                    </div>
                  ) : (
                    <span></span>
                  )}

                  <small>
                    {formData.message.length}/5000
                  </small>
                </div>
              </div>

              {/* SUBMIT */}

              <div className="form-submit-area">

                <div className="form-privacy">
                  <div className="privacy-symbol">✓</div>

                  <p>
                    Your information is used only to
                    respond to your enquiry.
                  </p>
                </div>

                <button
                  type="submit"
                  className="contact-submit"
                  disabled={submitting}
                >
                  <span>
                    {submitting
                      ? "Sharing..."
                      : "Send message"}
                  </span>

                  <div className="submit-arrow">
                    {submitting ? "..." : "↗"}
                  </div>
                </button>

              </div>

            </form>
          </div>
        </div>
      </section>

      {/* =====================================================
          WHY REACH OUT
      ===================================================== */}

      <section className="contact-values">
        <div className="values-container">

          <div className="values-intro">
            <h2>
              One message can
              <br />
              <em>start something.</em>
            </h2>
          </div>

          <div className="values-grid">

            <div className="value-card">
              <div className="value-card-top">
                <span className="value-number">01</span>
                <div className="value-icon">→</div>
              </div>

              <div className="value-card-content">
                <h3>Clear answers</h3>

                <p>
                  Ask us anything. We’ll give you a
                  straightforward answer without
                  unnecessary complexity.
                </p>
              </div>
            </div>

            <div className="value-card">
              <div className="value-card-top">
                <span className="value-number">02</span>
                <div className="value-icon">↗</div>
              </div>

              <div className="value-card-content">
                <h3>Real conversations</h3>

                <p>
                  Every enquiry is reviewed by a real
                  member of our team who understands
                  the context behind your message.
                </p>
              </div>
            </div>

            <div className="value-card">
              <div className="value-card-top">
                <span className="value-number">03</span>
                <div className="value-icon">✦</div>
              </div>

              <div className="value-card-content">
                <h3>Fast response</h3>

                <p>
                  We aim to respond to every genuine
                  enquiry within 24 hours.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="contact-final">

        <div className="final-decoration"></div>

        <div className="contact-final-container">

          <div className="final-copy">
            <h2>
              Just say
              <br />
              <em>hello.</em>
            </h2>
          </div>

          <div className="final-right">

            <p>
              No complicated process.
              No unnecessary steps.
              Just send us a message.
            </p>

            <a
              href="mailto:info@yuktic.com"
              className="final-email"
            >
              <span>info@yuktic.com</span>
              <strong>↗</strong>
            </a>

          </div>

        </div>

        <br />
        <br />
        <br />

      </section>

      <Footer />

    </div>
  );
};

export default ContactPage;

