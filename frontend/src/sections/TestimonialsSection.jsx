// import React, { useEffect, useState } from "react";
// import "../styles/testimonialsSection.css";

// import {
//   FaQuoteLeft,
//   FaStar,
//   FaChevronLeft,
//   FaChevronRight,
//   FaTimes,
// } from "react-icons/fa";

// const API_BASE_URL = (
//   import.meta.env.VITE_API_URL || "http://localhost:8000"
// ).replace(/\/$/, "");

// const VISIBLE_COUNT = 3;

// const FALLBACK_AVATAR = "CL";

// /* =========================================================
//    NORMALIZE DATABASE DATA
// ========================================================= */

// const normalizeTestimonial = (item, index) => {
//   const name = item?.name || "Client";

//   let avatar = item?.avatar;

//   // If avatar is empty, create initials from name
//   if (!avatar) {
//     avatar = name
//       .split(" ")
//       .filter(Boolean)
//       .map((word) => word.charAt(0))
//       .join("")
//       .slice(0, 2)
//       .toUpperCase();
//   }

//   return {
//     id:
//       item?._id ||
//       item?.id ||
//       `testimonial-${index}`,

//     name,

//     role:
//       item?.designation ||
//       item?.role ||
//       "",

//     organisation:
//       item?.organisation ||
//       item?.organization ||
//       item?.orgName ||
//       "",

//     quote:
//       item?.testimonial ||
//       item?.quote ||
//       "",

//     avatar,

//     rating: Math.min(
//       5,
//       Math.max(
//         0,
//         Number(item?.rating ?? 5)
//       )
//     ),

//     tag:
//       item?.tag ||
//       "Client Testimonial",

//     published: Boolean(item?.published),

//     featured: Boolean(item?.featured),

//     createdAt:
//       item?.createdAt || null,
//   };
// };


// /* =========================================================
//    CHECK WHETHER AVATAR IS AN IMAGE
// ========================================================= */

// const isImageAvatar = (avatar) => {
//   if (!avatar || typeof avatar !== "string") {
//     return false;
//   }

//   return (
//     avatar.startsWith("http://") ||
//     avatar.startsWith("https://") ||
//     avatar.startsWith("data:image/") ||
//     avatar.startsWith("/")
//   );
// };


// /* =========================================================
//    COMPONENT
// ========================================================= */

// export default function TestimonialsSection() {
//   const [testimonials, setTestimonials] = useState([]);

//   const [currentStart, setCurrentStart] = useState(0);

//   const [
//     selectedTestimonial,
//     setSelectedTestimonial,
//   ] = useState(null);

//   const [loading, setLoading] = useState(true);

//   const [error, setError] = useState("");


//   /* =======================================================
//      FETCH FROM DATABASE
//   ======================================================= */

//   useEffect(() => {
//     const fetchTestimonials = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         const response = await fetch(
//           `${API_BASE_URL}/testimonials`,
//           {
//             method: "GET",
//             headers: {
//               Accept: "application/json",
//             },
//           }
//         );

//         if (!response.ok) {
//           throw new Error(
//             `Failed to load testimonials (${response.status})`
//           );
//         }

//         const data = await response.json();

//         const normalized = Array.isArray(data)
//           ? data.map(normalizeTestimonial)
//           : [];

//         setTestimonials(normalized);
//         setCurrentStart(0);
//       } catch (err) {
//         console.error(
//           "Testimonials fetch error:",
//           err
//         );

//         setError(
//           "Unable to load testimonials right now."
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTestimonials();
//   }, []);


//   /* =======================================================
//      ESC CLOSE
//   ======================================================= */

//   useEffect(() => {
//     const handleEscape = (event) => {
//       if (event.key === "Escape") {
//         setSelectedTestimonial(null);
//       }
//     };

//     if (selectedTestimonial) {
//       document.addEventListener(
//         "keydown",
//         handleEscape
//       );

//       document.body.style.overflow = "hidden";
//     }

//     return () => {
//       document.removeEventListener(
//         "keydown",
//         handleEscape
//       );

//       document.body.style.overflow = "";
//     };
//   }, [selectedTestimonial]);


//   /* =======================================================
//      NEXT
//   ======================================================= */

//   const handleNext = () => {
//     if (
//       testimonials.length <=
//       VISIBLE_COUNT
//     ) {
//       return;
//     }

//     setCurrentStart((prev) => {
//       if (
//         prev >=
//         testimonials.length -
//           VISIBLE_COUNT
//       ) {
//         return 0;
//       }

//       return prev + 1;
//     });
//   };


//   /* =======================================================
//      PREVIOUS
//   ======================================================= */

//   const handlePrev = () => {
//     if (
//       testimonials.length <=
//       VISIBLE_COUNT
//     ) {
//       return;
//     }

//     setCurrentStart((prev) => {
//       if (prev === 0) {
//         return (
//           testimonials.length -
//           VISIBLE_COUNT
//         );
//       }

//       return prev - 1;
//     });
//   };


//   /* =======================================================
//      VISIBLE TESTIMONIALS
//   ======================================================= */

//   const visibleTestimonials =
//     testimonials.length <= VISIBLE_COUNT
//       ? testimonials
//       : testimonials.slice(
//           currentStart,
//           currentStart + VISIBLE_COUNT
//         );


//   /* =======================================================
//      STARS
//   ======================================================= */

//   const renderStars = (rating) => {
//     return (
//       <div className="testimonial-stars">
//         {[...Array(5)].map(
//           (_, index) => (
//             <FaStar
//               key={index}
//               className={
//                 index < rating
//                   ? "testimonial-star active"
//                   : "testimonial-star"
//               }
//             />
//           )
//         )}
//       </div>
//     );
//   };


//   /* =======================================================
//      AVATAR
     
//      If DB avatar = image URL:
//        show image

//      If DB avatar = "DS":
//        show DS initials
//   ======================================================= */

//   const renderAvatar = (
//     avatar,
//     name,
//     className
//   ) => {
//     const avatarValue =
//       avatar || FALLBACK_AVATAR;

//     if (isImageAvatar(avatarValue)) {
//       return (
//         <div className={className}>
//           <img
//             src={avatarValue}
//             alt={name}
//             className="db-avatar-image"
//             onError={(event) => {
//               event.currentTarget.style.display =
//                 "none";

//               const fallback =
//                 event.currentTarget
//                   .parentElement
//                   ?.querySelector(
//                     ".db-avatar-initials"
//                   );

//               if (fallback) {
//                 fallback.style.display =
//                   "flex";
//               }
//             }}
//           />

//           <span
//             className="db-avatar-initials"
//             style={{
//               display: "none",
//             }}
//           >
//             {name
//               ?.split(" ")
//               .filter(Boolean)
//               .map((word) =>
//                 word.charAt(0)
//               )
//               .join("")
//               .slice(0, 2)
//               .toUpperCase()}
//           </span>
//         </div>
//       );
//     }

//     return (
//       <div className={className}>
//         <span className="db-avatar-initials">
//           {avatarValue}
//         </span>
//       </div>
//     );
//   };


//   /* =======================================================
//      RENDER
//   ======================================================= */

//   return (
//     <>
//       <section
//         className="testimonials-section"
//         id="testimonials"
//       >

//         {/* =================================================
//             HEADING
//         ================================================= */}

//         <div className="testimonials-heading">

//           <span className="testimonials-eyebrow">
//            Client Feedback
//           </span>

//           <h2 className="testimonials-main-heading">
//             Trusted by Healthcare Leaders
//           </h2>

//           <p className="testimonials-subheading">
//             Discover how our specialized EHR
//             advisory and engineering teams
//             empower hospitals and healthcare
//             providers.
//           </p>

//           <div className="testimonials-heading-line" />

//         </div>


//         {/* =================================================
//             CONTENT
//         ================================================= */}

//         <div className="testimonials-container">

//           {loading && (
//             <div className="testimonials-status">
//               Loading testimonials...
//             </div>
//           )}


//           {!loading && error && (
//             <div className="testimonials-status error">
//               {error}
//             </div>
//           )}


//           {!loading &&
//             !error &&
//             testimonials.length === 0 && (
//               <div className="testimonials-status">
//                 No testimonials available yet.
//               </div>
//             )}


//           {!loading &&
//             !error &&
//             testimonials.length > 0 && (
//               <>

//                 {/* =================================================
//                     THREE CARD ROW
//                 ================================================= */}

//                 <div className="testimonials-carousel-wrapper">

//                   <div className="testimonials-grid">

//                     {visibleTestimonials.map(
//                       (item) => (
//                         <article
//                           key={item.id}
//                           className="testimonial-card"

//                           onClick={() =>
//                             setSelectedTestimonial(
//                               item
//                             )
//                           }

//                           role="button"

//                           tabIndex={0}

//                           onKeyDown={(event) => {
//                             if (
//                               event.key ===
//                                 "Enter" ||
//                               event.key === " "
//                             ) {
//                               event.preventDefault();

//                               setSelectedTestimonial(
//                                 item
//                               );
//                             }
//                           }}
//                         >

//                           {/* TOP */}

//                           <div className="card-top-row">

//                             <span className="testimonial-tag">
//                               {item.tag}
//                             </span>

//                             {renderStars(
//                               item.rating
//                             )}

//                           </div>


//                           {/* QUOTE */}

//                           <div className="quote-icon-box">
//                             <FaQuoteLeft />
//                           </div>


//                           {/* LIMITED TEXT */}

//                           <p className="testimonial-quote">
//                             "{item.quote}"
//                           </p>


                          


//                           {/* PROFILE */}

//                           <div className="testimonial-profile">

//                             {renderAvatar(
//                               item.avatar,
//                               item.name,
//                               "profile-avatar"
//                             )}

//                             <div className="profile-info">

//                               <h4 className="profile-name">
//                                 {item.name}
//                               </h4>

//                               {item.role && (
//                                 <p className="profile-role">
//                                   {item.role}
//                                 </p>
//                               )}

//                               {item.organisation && (
//                                 <span className="profile-org">
//                                   {
//                                     item.organisation
//                                   }
//                                 </span>
//                               )}

//                             </div>

//                           </div>

//                         </article>
//                       )
//                     )}

//                   </div>

//                 </div>


//                 {/* =================================================
//                     CONTROLS
//                 ================================================= */}

//                 {testimonials.length >
//                   VISIBLE_COUNT && (
//                   <div className="testimonials-controls">

//                     <button
//                       type="button"
//                       className="control-btn"
//                       onClick={handlePrev}
//                       aria-label="Previous testimonials"
//                     >
//                       <FaChevronLeft />
//                     </button>


//                     <div className="carousel-counter">

//                       <span>
//                         {currentStart + 1}
//                       </span>

//                       <span className="counter-divider">
//                         /
//                       </span>

//                       <span>
//                         {testimonials.length}
//                       </span>

//                     </div>


//                     <button
//                       type="button"
//                       className="control-btn"
//                       onClick={handleNext}
//                       aria-label="Next testimonials"
//                     >
//                       <FaChevronRight />
//                     </button>

//                   </div>
//                 )}

//               </>
//             )}

//         </div>


//         <br />
//         <br />
//         <br />
//         <br />

//       </section>


//       {/* =====================================================
//           FULL TESTIMONIAL MODAL
//       ====================================================== */}

//       {selectedTestimonial && (
//         <div
//           className="testimonial-modal-overlay"

//           onClick={() =>
//             setSelectedTestimonial(null)
//           }
//         >

//           <div
//             className="testimonial-modal"

//             onClick={(event) =>
//               event.stopPropagation()
//             }
//           >

//             {/* CLOSE */}

//             <button
//               type="button"
//               className="testimonial-modal-close"

//               onClick={() =>
//                 setSelectedTestimonial(null)
//               }

//               aria-label="Close testimonial"
//             >
//               <FaTimes />
//             </button>


//             {/* QUOTE ICON */}

//             <div className="modal-quote-icon">
//               <FaQuoteLeft />
//             </div>


//             {/* PROFILE */}

//             <div className="modal-top-content">

//               <div className="modal-profile">

//                 {renderAvatar(
//                   selectedTestimonial.avatar,
//                   selectedTestimonial.name,
//                   "modal-avatar"
//                 )}

//                 <div className="modal-profile-info">

//                   <h3 className="modal-name">
//                     {
//                       selectedTestimonial.name
//                     }
//                   </h3>

//                   {selectedTestimonial.role && (
//                     <p className="modal-role">
//                       {
//                         selectedTestimonial.role
//                       }
//                     </p>
//                   )}

//                   {selectedTestimonial.organisation && (
//                     <span className="modal-organisation">
//                       {
//                         selectedTestimonial.organisation
//                       }
//                     </span>
//                   )}

//                 </div>

//               </div>


//               <div className="modal-rating">
//                 {renderStars(
//                   selectedTestimonial.rating
//                 )}
//               </div>

//             </div>


//             <div className="modal-divider" />


//             {/* TAG */}

//             {selectedTestimonial.tag && (
//               <div className="modal-tag">
//                 {
//                   selectedTestimonial.tag
//                 }
//               </div>
//             )}


//             {/* FULL TEXT */}

//             <p className="modal-full-quote">
//               "
//               {
//                 selectedTestimonial.quote
//               }
//               "
//             </p>


           

//           </div>

//         </div>
//       )}
//     </>
//   );
// }



import React, { useEffect, useState } from "react";
import "../styles/testimonialsSection.css";

import {
  FaQuoteLeft,
  FaStar,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
} from "react-icons/fa";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:8000"
).replace(/\/$/, "");

const VISIBLE_COUNT = 3;

const FALLBACK_AVATAR = "CL";

/* =========================================================
   NORMALIZE DATABASE DATA
========================================================= */

const normalizeTestimonial = (item, index) => {
  const name = item?.name || "Client";

  let avatar = item?.avatar;

  // If avatar is empty, create initials from name
  if (!avatar) {
    avatar = name
      .split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  return {
    id:
      item?._id ||
      item?.id ||
      `testimonial-${index}`,

    name,

    role:
      item?.designation ||
      item?.role ||
      "",

    organisation:
      item?.organisation ||
      item?.organization ||
      item?.orgName ||
      "",

    quote:
      item?.testimonial ||
      item?.quote ||
      "",

    avatar,

    rating: Math.min(
      5,
      Math.max(
        0,
        Number(item?.rating ?? 5)
      )
    ),

    tag:
      item?.tag ||
      "Client Testimonial",

    published: Boolean(item?.published),

    featured: Boolean(item?.featured),

    createdAt:
      item?.createdAt || null,
  };
};


/* =========================================================
   CHECK WHETHER AVATAR IS AN IMAGE
========================================================= */

const isImageAvatar = (avatar) => {
  if (!avatar || typeof avatar !== "string") {
    return false;
  }

  return (
    avatar.startsWith("http://") ||
    avatar.startsWith("https://") ||
    avatar.startsWith("data:image/") ||
    avatar.startsWith("/")
  );
};


/* =========================================================
   COMPONENT
========================================================= */

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);

  const [currentStart, setCurrentStart] = useState(0);

  const [
    selectedTestimonial,
    setSelectedTestimonial,
  ] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  /* =======================================================
     FETCH FROM DATABASE
  ======================================================= */

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/testimonials`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to load testimonials (${response.status})`
          );
        }

        const data = await response.json();

        const normalized = Array.isArray(data)
          ? data
              .map(normalizeTestimonial)
              // Only keep testimonials that actually have text
              .filter(
                (item) =>
                  item.quote &&
                  item.quote.trim().length > 0
              )
          : [];

        setTestimonials(normalized);
        setCurrentStart(0);

      } catch (err) {
        console.error(
          "Testimonials fetch error:",
          err
        );

        setTestimonials([]);

        setError(
          "Unable to load testimonials right now."
        );

      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);


  /* =======================================================
     ESC CLOSE MODAL
  ======================================================= */

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setSelectedTestimonial(null);
      }
    };

    if (selectedTestimonial) {
      document.addEventListener(
        "keydown",
        handleEscape
      );

      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );

      document.body.style.overflow = "";
    };
  }, [selectedTestimonial]);


  /* =======================================================
     NEXT
  ======================================================= */

  const handleNext = () => {
    if (
      testimonials.length <=
      VISIBLE_COUNT
    ) {
      return;
    }

    setCurrentStart((prev) => {
      if (
        prev >=
        testimonials.length -
          VISIBLE_COUNT
      ) {
        return 0;
      }

      return prev + 1;
    });
  };


  /* =======================================================
     PREVIOUS
  ======================================================= */

  const handlePrev = () => {
    if (
      testimonials.length <=
      VISIBLE_COUNT
    ) {
      return;
    }

    setCurrentStart((prev) => {
      if (prev === 0) {
        return (
          testimonials.length -
          VISIBLE_COUNT
        );
      }

      return prev - 1;
    });
  };


  /* =======================================================
     VISIBLE TESTIMONIALS
  ======================================================= */

  const visibleTestimonials =
    testimonials.length <= VISIBLE_COUNT
      ? testimonials
      : testimonials.slice(
          currentStart,
          currentStart + VISIBLE_COUNT
        );


  /* =======================================================
     STARS
  ======================================================= */

  const renderStars = (rating) => {
    return (
      <div className="testimonial-stars">
        {[...Array(5)].map(
          (_, index) => (
            <FaStar
              key={index}
              className={
                index < rating
                  ? "testimonial-star active"
                  : "testimonial-star"
              }
            />
          )
        )}
      </div>
    );
  };


  /* =======================================================
     AVATAR
     
     If DB avatar = image URL:
       show image

     If DB avatar = "DS":
       show DS initials
  ======================================================= */

  const renderAvatar = (
    avatar,
    name,
    className
  ) => {
    const avatarValue =
      avatar || FALLBACK_AVATAR;

    if (isImageAvatar(avatarValue)) {
      return (
        <div className={className}>
          <img
            src={avatarValue}
            alt={name}
            className="db-avatar-image"
            onError={(event) => {
              event.currentTarget.style.display =
                "none";

              const fallback =
                event.currentTarget
                  .parentElement
                  ?.querySelector(
                    ".db-avatar-initials"
                  );

              if (fallback) {
                fallback.style.display =
                  "flex";
              }
            }}
          />

          <span
            className="db-avatar-initials"
            style={{
              display: "none",
            }}
          >
            {name
              ?.split(" ")
              .filter(Boolean)
              .map((word) =>
                word.charAt(0)
              )
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </span>
        </div>
      );
    }

    return (
      <div className={className}>
        <span className="db-avatar-initials">
          {avatarValue}
        </span>
      </div>
    );
  };


  /* =======================================================
     IMPORTANT:
     HIDE THE ENTIRE SECTION IF:
     
     - Still loading
     - API failed
     - No testimonials
  ======================================================= */

  if (
    loading ||
    error ||
    testimonials.length === 0
  ) {
    return null;
  }


  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>
      {/* =================================================
          TESTIMONIALS SECTION
      ================================================= */}

      <section
        className="testimonials-section"
        id="testimonials"
      >

        {/* =================================================
            HEADING
        ================================================= */}

        <div className="testimonials-heading">

          <span className="testimonials-eyebrow">
            Client Feedback
          </span>

          <h2 className="testimonials-main-heading">
            Trusted by Healthcare Leaders
          </h2>

          <p className="testimonials-subheading">
            Discover how our specialized EHR
            advisory and engineering teams
            empower hospitals and healthcare
            providers.
          </p>

          <div className="testimonials-heading-line" />

        </div>


        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="testimonials-container">

          {/* =================================================
              CARDS
          ================================================= */}

          <div className="testimonials-carousel-wrapper">

            <div className="testimonials-grid">

              {visibleTestimonials.map(
                (item) => (
                  <article
                    key={item.id}
                    className="testimonial-card"

                    onClick={() =>
                      setSelectedTestimonial(
                        item
                      )
                    }

                    role="button"

                    tabIndex={0}

                    onKeyDown={(event) => {
                      if (
                        event.key ===
                          "Enter" ||
                        event.key === " "
                      ) {
                        event.preventDefault();

                        setSelectedTestimonial(
                          item
                        );
                      }
                    }}
                  >

                    {/* =================================================
                        TOP ROW
                    ================================================= */}

                    <div className="card-top-row">

                      <span className="testimonial-tag">
                        {item.tag}
                      </span>

                      {renderStars(
                        item.rating
                      )}

                    </div>


                    {/* =================================================
                        QUOTE ICON
                    ================================================= */}

                    <div className="quote-icon-box">
                      <FaQuoteLeft />
                    </div>


                    {/* =================================================
                        QUOTE
                    ================================================= */}

                    <p className="testimonial-quote">
                      "{item.quote}"
                    </p>


                    {/* =================================================
                        PROFILE
                    ================================================= */}

                    <div className="testimonial-profile">

                      {renderAvatar(
                        item.avatar,
                        item.name,
                        "profile-avatar"
                      )}

                      <div className="profile-info">

                        <h4 className="profile-name">
                          {item.name}
                        </h4>

                        {item.role && (
                          <p className="profile-role">
                            {item.role}
                          </p>
                        )}

                        {item.organisation && (
                          <span className="profile-org">
                            {item.organisation}
                          </span>
                        )}

                      </div>

                    </div>

                  </article>
                )
              )}

            </div>

          </div>


          {/* =================================================
              CAROUSEL CONTROLS
          ================================================= */}

          {testimonials.length >
            VISIBLE_COUNT && (
            <div className="testimonials-controls">

              <button
                type="button"
                className="control-btn"
                onClick={handlePrev}
                aria-label="Previous testimonials"
              >
                <FaChevronLeft />
              </button>


              <div className="carousel-counter">

                <span>
                  {currentStart + 1}
                </span>

                <span className="counter-divider">
                  /
                </span>

                <span>
                  {testimonials.length}
                </span>

              </div>


              <button
                type="button"
                className="control-btn"
                onClick={handleNext}
                aria-label="Next testimonials"
              >
                <FaChevronRight />
              </button>

            </div>
          )}

        </div>


        {/* =================================================
            BOTTOM SPACING
        ================================================= */}

        <br />
        <br />
        <br />
        <br />

      </section>


      {/* =====================================================
          FULL TESTIMONIAL MODAL
      ====================================================== */}

      {selectedTestimonial && (
        <div
          className="testimonial-modal-overlay"

          onClick={() =>
            setSelectedTestimonial(null)
          }
        >

          <div
            className="testimonial-modal"

            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* =================================================
                CLOSE
            ================================================= */}

            <button
              type="button"
              className="testimonial-modal-close"

              onClick={() =>
                setSelectedTestimonial(null)
              }

              aria-label="Close testimonial"
            >
              <FaTimes />
            </button>


            {/* =================================================
                QUOTE ICON
            ================================================= */}

            <div className="modal-quote-icon">
              <FaQuoteLeft />
            </div>


            {/* =================================================
                PROFILE
            ================================================= */}

            <div className="modal-top-content">

              <div className="modal-profile">

                {renderAvatar(
                  selectedTestimonial.avatar,
                  selectedTestimonial.name,
                  "modal-avatar"
                )}

                <div className="modal-profile-info">

                  <h3 className="modal-name">
                    {
                      selectedTestimonial.name
                    }
                  </h3>

                  {selectedTestimonial.role && (
                    <p className="modal-role">
                      {
                        selectedTestimonial.role
                      }
                    </p>
                  )}

                  {selectedTestimonial.organisation && (
                    <span className="modal-organisation">
                      {
                        selectedTestimonial.organisation
                      }
                    </span>
                  )}

                </div>

              </div>


              {/* =================================================
                  RATING
              ================================================= */}

              <div className="modal-rating">
                {renderStars(
                  selectedTestimonial.rating
                )}
              </div>

            </div>


            {/* =================================================
                DIVIDER
            ================================================= */}

            <div className="modal-divider" />


            {/* =================================================
                TAG
            ================================================= */}

            {selectedTestimonial.tag && (
              <div className="modal-tag">
                {
                  selectedTestimonial.tag
                }
              </div>
            )}


            {/* =================================================
                FULL TEXT
            ================================================= */}

            <p className="modal-full-quote">
              "
              {
                selectedTestimonial.quote
              }
              "
            </p>

          </div>

        </div>
      )}

    </>
  );
}