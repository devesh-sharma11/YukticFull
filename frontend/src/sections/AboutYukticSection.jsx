// import React, { useEffect, useRef, useState } from 'react';
// import yukticImg from '../assets/Yuktic.png';
// import rightearth from '../assets/rightearth3.png';
// import '../styles/aboutYukticSection.css';

// const stats = [
//   { target: 22, suffix: '+', label: 'YEAR EXPERIENCE' },
//   { target: 16, suffix: '+', label: 'EHR PROGRAMMES' },
//   { target: 12, suffix: '+', label: 'HEALTH SYSTEMS' },
//   { target: 5, suffix: '', label: 'COUNTRIES' },
//   { target: 15, suffix: '+', label: 'EPIC CERTIFICATIONS' },
// ];

// const AboutYukticSection = () => {
//   const sectionRef = useRef(null);
//   const [isInView, setIsInView] = useState(false);
//   const [counts, setCounts] = useState(stats.map(() => 0));

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setIsInView(true);
//           observer.disconnect();
//         }
//       },
//       { threshold: 0.1 }
//     );

//     if (sectionRef.current) {
//       observer.observe(sectionRef.current);
//     }

//     return () => observer.disconnect();
//   }, []);

//   // Smooth Count-Up Animation
//   useEffect(() => {
//     if (!isInView) return;

//     const duration = 2000;
//     let frameId;
//     let startTime = null;

//     const animateCount = (timestamp) => {
//       if (!startTime) startTime = timestamp;
//       const progress = Math.min((timestamp - startTime) / duration, 1);
//       const easeOut = 1 - Math.pow(1 - progress, 3);

//       setCounts(stats.map((stat) => Math.floor(easeOut * stat.target)));

//       if (progress < 1) {
//         frameId = requestAnimationFrame(animateCount);
//       } else {
//         setCounts(stats.map((stat) => stat.target));
//       }
//     };

//     frameId = requestAnimationFrame(animateCount);
//     return () => cancelAnimationFrame(frameId);
//   }, [isInView]);

//   return (
//     <section 
//       ref={sectionRef} 
//       className={`about-yuktic-section ${isInView ? 'in-view' : ''}`} 
//       id="about"
//     >
//       {/* Ambient Earth Background */}
//       <div className="contact-earth-decor" aria-hidden="true">
//         <img 
//           src={rightearth} 
//           alt="" 
//           className="leaf-earth-image"
//           loading="lazy"
//           decoding="async"
//           fetchPriority="low"
//         />
//       </div>
//       <br/>  <br/>  <br/>  <br/>
     

//       {/* Floating Stats Bar */}
//       {/* <div className="about-stats-wrapper2">
//         <div className="about-stats-container2">
//           {stats.map((stat, idx) => (
//             <div key={idx} className="stat-box">
//               <div className="stat-number-wrap2">
//                 <span className="stat-number2">{counts[idx]}</span>
//                 {stat.suffix && <span className="stat-suffix">{stat.suffix}</span>}
//               </div>
//               <span className="stat-label">{stat.label}</span>
//             </div>
//           ))}
//         </div>
//       </div> */}

//       {/* Centered Top Heading Block */}
//       <div className="capabilities-header-center">
       
         
//         <h2 className="capabilities-title">About US.</h2>
//          <br/> 
//         <p className="capabilities-subtitle">
// Specialist expertise to transform complex problems into confident, sustainable delivery. We work alongside multiple organisations, partners to bring clarity, structure and momentum to challenging problems.
//      </p>
//          <br/> 
//         <div className="capabilities-divider"></div>
         
//       </div>

      

//       {/* Main 2-Column Content */}
//       <div className="about-yuktic-container">
//         {/* Left Side: Visual Showcase */}
       

//         {/* Right Side: Narrative */}
//         <div className="about-yuktic-content">
          
          
//           <h2 className="about-heading">
//             Technology Expertise. <span className="highlight-text">Flexible Teams. Reliable Delivery.</span>
//           </h2>
          
//           <div className="heading-line about-line"></div>

//           <p className="about-lead">
// At Yuktic, we help organizations turn technology challenges into practical, sustainable solutions. We work alongside our clients as an extension of their teams, bringing the right expertise, people, and delivery approach to move projects forward with confidence.<br/><br/>
           
// Whether it is building a technology team, augmenting an existing team, or taking ownership of a software development project, we adapt to the needs of the organization and the challenges at hand.<br/><br/>
 
// Our experience spans software development, test automation, and technology team building, with expertise across C++, Java, Python, Flutter, Playwright modern web technologies, and automation frameworks.<br/><br/>
 
// We believe good technology delivery is not just about having the right skills. It is about understanding the problem, building the right team, taking ownership, and delivering consistently.

//           </p>

//           <p className="about-desc">

//           </p>

//         </div>
//       </div>
//     </section>
//   );
// };

// export default AboutYukticSection;


import React, { useEffect, useRef, useState } from 'react';
import yukticImg from '../assets/Yuktic.png';
import rightearth from '../assets/rightearth3.png';
import '../styles/aboutYukticSection.css';

const stats = [
  { target: 22, suffix: '+', label: 'YEAR EXPERIENCE' },
  { target: 16, suffix: '+', label: 'EHR PROGRAMMES' },
  { target: 12, suffix: '+', label: 'HEALTH SYSTEMS' },
  { target: 5, suffix: '', label: 'COUNTRIES' },
  { target: 15, suffix: '+', label: 'EPIC CERTIFICATIONS' },
];

const AboutYukticSection = () => {
  const sectionRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const [counts, setCounts] = useState(stats.map(() => 0));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    let frameId;
    let startTime = null;

    const animateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;

      const progress = Math.min(
        (timestamp - startTime) / duration,
        1
      );

      const easeOut = 1 - Math.pow(1 - progress, 3);

      setCounts(
        stats.map((stat) =>
          Math.floor(easeOut * stat.target)
        )
      );

      if (progress < 1) {
        frameId = requestAnimationFrame(animateCount);
      } else {
        setCounts(stats.map((stat) => stat.target));
      }
    };

    frameId = requestAnimationFrame(animateCount);

    return () => cancelAnimationFrame(frameId);
  }, [isInView]);

  return (
    <section
      ref={sectionRef}
      className={`about-yuktic-section ${
        isInView ? 'in-view' : ''
      }`}
      id="about"
    >
      {/* Ambient Earth Background */}
      <div
        className="contact-earth-decor"
        aria-hidden="true"
      >
        <img
          src={rightearth}
          alt=""
          className="leaf-earth-image"
          loading="lazy"
          decoding="async"
          fetchPriority="low"
        />
      </div>

      {/* Floating Stats Bar */}
      {/* 
      <div className="about-stats-wrapper2">
        <div className="about-stats-container2">
          {stats.map((stat, idx) => (
            <div key={idx} className="stat-box">
              <div className="stat-number-wrap2">
                <span className="stat-number2">
                  {counts[idx]}
                </span>

                {stat.suffix && (
                  <span className="stat-suffix">
                    {stat.suffix}
                  </span>
                )}
              </div>

              <span className="stat-label">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      */}

      {/* Top Heading Block */}
      <div className="capabilities-header-center">
        <h2 className="capabilities-title">
          About US.
        </h2>

        <p className="capabilities-subtitle">
          Specialist expertise to transform complex problems into confident, sustainable delivery. We work alongside multiple organisations, partners to bring clarity, structure and momentum to challenging problems.
        </p>

        <div className="capabilities-divider"></div>
      </div>

      {/* Main Content */}
      <div className="about-yuktic-container">
        <br/>
        <div className="about-yuktic-content">

          <h2 className="about-heading">
            Technology Expertise.{' '}
            <span className="highlight-text">
              <br/>Flexible Teams. <br/>Reliable Delivery.
            </span>
          </h2>

          <div className="heading-line about-line"></div>

          <p className="about-lead">
            At Yuktic, we help organizations turn technology challenges into practical, sustainable solutions. We work alongside our clients as an extension of their teams, bringing the right expertise, people, and delivery approach to move projects forward with confidence.

            <br />
            <br />

            Whether it is building a technology team, augmenting an existing team, or taking ownership of a software development project, we adapt to the needs of the organization and the challenges at hand.

            <br />
            <br />

            Our experience spans software development, test automation, and technology team building, with expertise across C++, Java, Python, Flutter, Playwright modern web technologies, and automation frameworks.

            <br />
            <br />

            We believe good technology delivery is not just about having the right skills. It is about understanding the problem, building the right team, taking ownership, and delivering consistently.
          </p>

          <p className="about-desc"></p>

        </div>
      </div>
    </section>
  );
};

export default AboutYukticSection;