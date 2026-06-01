import React from 'react';

const stats = [
  { value: 'Zero Compromise', label: 'OBSESSIVE QUALITY FOCUS', className: 'about-stat-left' },
  { value: '100% Focused', label: 'DISCIPLINED EXECUTION', className: 'about-stat-center' },
  { value: 'Unwavering Standards', label: 'CONSISTENT EXCELLENCE', className: 'about-stat-right' },
];

const About = () => {
  return (
    <section className="relative py-section-padding px-margin-mobile md:px-margin-desktop bg-surface" id="about">
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '150px',
          background: 'linear-gradient(to bottom, #fafaf5 0%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
      <div className="max-w-[1280px] mx-auto">
        {/* Section Header */}
        <div className="max-w-[1000px] mx-auto text-center mb-section-padding">
          <div className="gold-line mx-auto mb-8" />
          <h2 className="section-heading font-display-lg text-display-lg mb-4 text-on-surface">Why Choose Me?</h2>
          <p className="font-label-md text-label-md uppercase tracking-[0.2em] text-on-surface-variant mb-4">
            Because I obsess over every detail.
          </p>
          <h3 className="font-display-lg text-display-lg text-outline">
            <span className="inline-flex">
              <span className="about-heading-left inline-block">Discipline</span>
              <span className="mx-2">&amp;</span>
              <span className="about-heading-right inline-block">Obsession</span>
            </span>
          </h3>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter max-w-[1000px] mx-auto">
          {stats.map(({ value, label, className }) => (
            <div key={label} className={`text-center ${className}`}>
              <div className="font-body-md text-body-md text-primary mb-2">{value}</div>
              <div className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
