import React from 'react';

const columns = [
  {
    icon: 'layers',
    title: 'Frontend',
    items: ['React / Next.js', 'TypeScript / JavaScript', 'Tailwind CSS', 'Flutter / Dart'],
  },
  {
    icon: 'database',
    title: 'Backend',
    items: ['Node.js / Express', 'PostgreSQL / Supabase', 'Firebase', 'Docker'],
  },
  {
    icon: 'terminal',
    title: 'Tools',
    items: ['Google AI Studio / Gemini API', 'Vercel / Google Cloud', 'Tauri', 'Figma / Stitch (Google)'],
  },
];

const Skills = () => {
  return (
    <section className="py-section-padding px-margin-mobile md:px-margin-desktop bg-surface" id="skills">
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center mb-section-padding">
          <div className="gold-line mx-auto mb-8 reveal" />
          <h2 className="font-headline-lg text-headline-lg reveal">Technical Proficiencies</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {columns.map(({ icon, title, items }, colIdx) => (
            <div
              key={title}
              className="flex flex-col gap-6 reveal"
              style={{ transitionDelay: `${colIdx * 120}ms` }}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-[28px]">{icon}</span>
                <h4 className="font-headline-md text-[24px]">{title}</h4>
              </div>
              <ul className="space-y-3 font-body-md text-body-md text-on-surface-variant">
                {items.map((item, i) => (
                  <li key={item} className="flex justify-between items-center border-b border-surface-variant pb-3 group">
                    <span className="group-hover:text-primary transition-colors duration-300">{item}</span>
                    <span className="font-label-md text-[10px] text-on-surface-variant opacity-20 tabular-nums">
                      {String(colIdx * 4 + i + 1).padStart(2, '0')}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
