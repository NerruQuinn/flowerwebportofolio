import React from 'react';

const stats = [
  { value: 'Zero Compromise', label: 'OBSESSIVE QUALITY FOCUS', className: 'about-stat-left' },
  { value: '100% Focused', label: 'DISCIPLINED EXECUTION', className: 'about-stat-center' },
  { value: 'Unwavering Standards', label: 'CONSISTENT EXCELLENCE', className: 'about-stat-right' },
];

const About = () => {
  return (
    <section className="relative py-section-padding px-6 md:px-12 lg:px-24 bg-surface" id="about">
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
          <h2 className="section-heading font-display-lg text-4xl md:text-6xl lg:text-7xl mb-4 text-on-surface">Why Choose Me?</h2>
          <p className="font-label-md text-xs md:text-sm uppercase tracking-widest text-on-surface-variant mb-4">
            Because I obsess over every detail.
          </p>
          <h3 className="font-display-lg text-4xl md:text-6xl lg:text-8xl text-outline">
            <span className="inline-flex">
              <span className="about-heading-left inline-block">Discipline</span>
              <span className="mx-2">&amp;</span>
              <span className="about-heading-right inline-block">Obsession</span>
            </span>
          </h3>
        </div>

        {/* Stats Row */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-0 max-w-[1000px] mx-auto">
          {stats.map(({ value, label, className }) => (
            <div key={label} className={`w-full md:w-1/3 text-center ${className}`}>
              <div className="font-body-md text-sm md:text-base text-primary mb-2">{value}</div>
              <div className="font-label-md text-xs md:text-sm uppercase tracking-widest text-on-surface-variant">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
