import React, { useEffect, useRef } from 'react';
import '../styles/fixedbackgroundSection.css';
import fixedImg from '../assets/fixedimage.jpg';

const FixedbackgroundSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        } else {
          entry.target.classList.remove('is-visible');
        }
      },
      {
        root: null,
        threshold: 0.3,
      }
    );

    const section = sectionRef.current;

    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  return (
    
    <section
      ref={sectionRef}
      className="fixed-story-wrapper2"
      style={{
        backgroundImage: `url(${fixedImg})`,
      }}
    >
      
      <div className="story-overlay"></div>
      

      <div className="story-content2">

        {/* Small top label */}
        <div className="story-eyebrow">
          <span className="eyebrow-line"></span>

          <span>BUILD WITH PURPOSE</span>

          <span className="eyebrow-line"></span>
        </div>

        {/* Small center indicator */}
        <div className="story-marker">
          <span></span>
        </div>

        {/* Main heading */}
        <h2 className="story-title">
  Your Challenge.
  <br />
  <span>Our Commitment.</span>
</h2>

<p className="story-desc">
  Every challenge is an opportunity to create something better, stronger,
  and more impactful, let’s work together to turn your vision into
  solutions that move your organization forward.
</p>

        {/* Bottom meta */}
        <div className="story-meta">
          <span>CREATE</span>

          <span className="meta-dot"></span>

          <span>GROW</span>

          <span className="meta-dot"></span>

          <span>LEAD</span>
        </div>

         <br/>  <br/>  <br/>   <br/>  <br/>  <br/>   <br/>  <br/>  <br/>
         <br/>  <br/>  <br/>   <br/>  <br/>  <br/>   <br/>  <br/>  <br/>

      </div>
     
    </section>
  );
};

export default FixedbackgroundSection;