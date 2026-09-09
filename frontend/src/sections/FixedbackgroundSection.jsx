import React, { useEffect, useRef } from 'react';
import '../styles/fixedbackgroundSection.css';
import fixedImg from '../assets/fixedimage.jpg';

const storyData = [
  {
    eyebrow: 'BUILD WITH PURPOSE',
    title: 'Your Vision.',
    titleHighlight: 'Our Commitment.',
    description:
      'Every great outcome starts with a bold idea. We listen, understand, and bring the right thinking together to turn your vision into something real.',
    meta: ['VISION', 'TRUST', 'PURPOSE'],
  },

  {
    eyebrow: 'CREATE TOGETHER',
    title: 'Think Beyond.',
    titleHighlight: 'Build What Matters.',
    description:
      'The best work happens when ideas are shared, challenges are embraced, and both sides move forward with one clear purpose — creating something that truly matters.',
    meta: ['THINK', 'CREATE', 'COLLABORATE'],
  },

  {
    eyebrow: 'MOVE FORWARD',
    title: 'Big Challenges.',
    titleHighlight: 'Bigger Possibilities.',
    description:
      'Whatever comes next, we are ready to build it with you. Because progress is not just about reaching the destination — it is about creating what comes after it.',
    meta: ['CHALLENGE', 'INNOVATE', 'GROW'],
  },
];

const FixedbackgroundSection = () => {
  const sectionRefs = useRef([]);

  useEffect(() => {
    const observers = [];

    sectionRefs.current.forEach((section) => {
      if (!section) return;

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

      observer.observe(section);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  return (
    <section className="fixed-story-container">

      {storyData.map((story, index) => (
        <div
          key={index}
          ref={(el) => {
            sectionRefs.current[index] = el;
          }}
          className="fixed-story-wrapper2"
          style={{
            backgroundImage: `url(${fixedImg})`,
          }}
        >

          {/* DARK OVERLAY */}
          <div className="story-overlay"></div>

          {/* CONTENT */}
          <div className="story-content2">

            {/* EYEBROW */}
            <div className="story-eyebrow">
              <span className="eyebrow-line"></span>

              <span>{story.eyebrow}</span>

              <span className="eyebrow-line"></span>
            </div>

            {/* CENTER MARKER */}
            <div className="story-marker">
              <span></span>
            </div>

            {/* TITLE */}
            <h2 className="story-title">
              {story.title}
              <br />
              <span>{story.titleHighlight}</span>
            </h2>

            {/* DESCRIPTION */}
            <p className="story-desc">
              {story.description}
            </p>

            {/* META */}
            <div className="story-meta">
              {story.meta.map((item, metaIndex) => (
                <React.Fragment key={item}>

                  <span>{item}</span>

                  {metaIndex < story.meta.length - 1 && (
                    <span className="meta-dot"></span>
                  )}

                </React.Fragment>
              ))}
            </div>

            

          </div>

        </div>
      ))}

    </section>
  );
};

export default FixedbackgroundSection;