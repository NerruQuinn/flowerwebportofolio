/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "outline": "#7f7663",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#154f29",
        "surface": "#fafaf5",
        "secondary-fixed-dim": "#9fcee0",
        "on-primary-fixed": "#241a00",
        "surface-container-lowest": "#ffffff",
        "primary-container": "#d4af37",
        "surface-container": "#eeeee9",
        "tertiary-container": "#86c190",
        "on-primary-fixed-variant": "#574500",
        "tertiary-fixed-dim": "#98d5a2",
        "surface-container-low": "#f4f4ef",
        "surface-variant": "#e3e3de",
        "surface-container-high": "#e8e8e3",
        "secondary": "#366574",
        "tertiary": "#316a40",
        "on-tertiary-fixed": "#00210b",
        "primary-fixed": "#ffe088",
        "on-error-container": "#93000a",
        "background": "#fafaf5",
        "on-tertiary-fixed-variant": "#17512a",
        "inverse-on-surface": "#f1f1ec",
        "on-surface-variant": "#4d4635",
        "on-primary": "#ffffff",
        "error": "#ba1a1a",
        "on-secondary": "#ffffff",
        "on-secondary-fixed": "#001f28",
        "on-surface": "#1a1c19",
        "on-primary-container": "#554300",
        "on-error": "#ffffff",
        "tertiary-fixed": "#b4f1bc",
        "primary": "#735c00",
        "surface-container-highest": "#e3e3de",
        "surface-dim": "#dadad5",
        "primary-fixed-dim": "#e9c349",
        "on-secondary-container": "#3c6b7a",
        "outline-variant": "#d0c5af",
        "on-background": "#1a1c19",
        "inverse-surface": "#2f312e",
        "error-container": "#ffdad6",
        "surface-tint": "#735c00",
        "secondary-fixed": "#baeafc",
        "on-secondary-fixed-variant": "#1a4d5c",
        "inverse-primary": "#e9c349",
        "surface-bright": "#fafaf5",
        "secondary-container": "#baeafc"
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
      },
      spacing: {
        "gutter": "32px",
        "unit": "8px",
        "unit-1": "8px",
        "unit-2": "16px",
        "unit-3": "24px",
        "unit-4": "32px",
        "unit-5": "40px",
        "unit-6": "48px",
        "unit-7": "56px",
        "unit-8": "64px",
        "section-padding": "160px",
        "margin-mobile": "24px",
        "margin-desktop": "80px"
      },
      fontFamily: {
        "body-md": ["Inter"],
        "label-md": ["Inter"],
        "headline-lg": ["Playfair Display"],
        "headline-md": ["Playfair Display"],
        "display-lg": ["Playfair Display"],
        "display-lg-mobile": ["Playfair Display"],
        "body-lg": ["Inter"]
      },
      fontSize: {
        "body-md": ["16px", {"lineHeight": "1.6", "fontWeight": "400"}],
        "label-md": ["12px", {"lineHeight": "1.0", "letterSpacing": "0.1em", "fontWeight": "600"}],
        "headline-lg": ["48px", {"lineHeight": "1.2", "fontWeight": "600"}],
        "headline-md": ["32px", {"lineHeight": "1.3", "fontWeight": "500"}],
        "display-lg": ["64px", {"lineHeight": "1.1", "letterSpacing": "-0.02em", "fontWeight": "700"}],
        "display-lg-mobile": ["40px", {"lineHeight": "1.2", "fontWeight": "700"}],
        "body-lg": ["18px", {"lineHeight": "1.7", "fontWeight": "400"}]
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries')
  ],
}
