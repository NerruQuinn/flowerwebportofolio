import React from 'react';

const stats = [
  { value: 'Zero Compromise', label: 'OBSESSIVE QUALITY FOCUS' },
  { value: '100% Focused', label: 'DISCIPLINED EXECUTION' },
  { value: 'Unwavering Standards', label: 'CONSISTENT EXCELLENCE' },
];

const About = () => {
  return (
    <section className="py-section-padding px-margin-mobile md:px-margin-desktop bg-surface" id="about">
      <div className="max-w-[1280px] mx-auto">
        {/* Section Header */}
        <div className="max-w-[1000px] mx-auto text-center mb-section-padding">
          <div className="gold-line mx-auto mb-8 reveal" />
          <h2 className="font-display-lg text-display-lg mb-4 text-on-surface reveal">Why Choose Me?</h2>
          <p className="font-label-md text-label-md uppercase tracking-[0.2em] text-on-surface-variant mb-4 reveal" style={{ transitionDelay: '100ms' }}>
            Because I obsess over every detail.
          </p>
          <h3 className="font-display-lg text-display-lg text-outline reveal" style={{ transitionDelay: '200ms' }}>
            Discipline & Obsession
          </h3>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter max-w-[1000px] mx-auto">
          {stats.map(({ value, label }, i) => (
            <div
              key={label}
              className="text-center reveal"
              style={{ transitionDelay: `${(i + 1) * 120}ms` }}
            >
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
