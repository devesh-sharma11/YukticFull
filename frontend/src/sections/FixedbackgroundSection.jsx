import React, { useEffect, useRef } from 'react';
import '../styles/fixedbackgroundSection.css';
import fixedImg from '../assets/fixedimage.jpg';

const storyData = [
  {
    eyebrow: 'WHAT WE BELIEVE',
    title: 'WE LEAD WITH',
    titleHighlight: 'INTEGRITY',
    description:
      'We believe trust is built through honesty, transparency, and accountability. We do what we say, take responsibility for our decisions, and stay true to our commitments — even when the easier choice is not the right one.',
    meta: ['HONESTY', 'ACCOUNTABILITY', 'TRUST'],
  },

  {
    eyebrow: 'WHAT WE BELIEVE',
    title: 'WE WORK WITH',
    titleHighlight: 'RESPECT',
    description:
      'We believe great work begins with respect for people, ideas, and different perspectives. We listen before we act, value every contribution, and build relationships where people feel heard, trusted, and valued.',
    meta: ['LISTEN', 'VALUE', 'COLLABORATE'],
  },

  {
    eyebrow: 'WHAT WE BELIEVE',
    title: 'WE MOVE WITH',
    titleHighlight: 'COURAGE',
    description:
      'We believe meaningful progress requires the courage to challenge what exists, make difficult decisions, and step into the unknown. We are willing to question, adapt, and take bold action when it creates a better path forward.',
    meta: ['CHALLENGE', 'DECIDE', 'MOVE FORWARD'],
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