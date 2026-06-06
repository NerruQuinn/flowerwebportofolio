const fs = require('fs');
let content = fs.readFileSync('src/components/Hero.jsx', 'utf8');

// 1. Remove the entire Tablet Canvas useEffect
content = content.replace(
  /\/\/ Tablet Canvas \+ requestVideoFrameCallback[\s\S]*?\}, \[isTablet\]\);/,
  ""
);

// 2. Remove isTablet check from Mobile Canvas useEffect so it runs for both phones and tablets
content = content.replace(
  /if \(isTablet \|\| !isMobile \|\| !canvasRef\.current \|\| !mobileSpacerRef\.current\) return;/,
  "if (!isMobile || !canvasRef.current || !mobileSpacerRef.current) return; // isMobile includes tablets (< 1024)"
);

// 3. Fix the manual frame interpolation math in the ScrollTrigger onUpdate
content = content.replace(
  /onUpdate: \(self\) => \{\s*obj\.frame \+= \(self\.progress \* \(frameCount - 1\) - obj\.frame\) \* 0\.15;\s*const currentFrame = frames\[Math\.round\(obj\.frame\)\];\s*if \(currentFrame\) drawFrame\(currentFrame\);\s*\}/,
  "onUpdate: () => {\n            const currentFrame = frames[Math.round(obj.frame)];\n            if (currentFrame) drawFrame(currentFrame);\n          }"
);

// 4. Change scrub: 0.5 to scrub: true on the mobile/tablet frame sequence
content = content.replace(
  /scrub: 0\.5,\s*smoothChildTiming: true,/,
  "scrub: true,"
);

// 5. Change desktop scrub: 0.3 to true as well
content = content.replace(
  /trigger: containerRef\.current,\s*start: 'top top',\s*end: 'bottom bottom',\s*scrub: 0\.3,/,
  "trigger: containerRef.current,\n        start: 'top top',\n        end: 'bottom bottom',\n        scrub: true,"
);

// 6. Remove the hidden tablet video from JSX
content = content.replace(
  /\{\/\* Hidden tablet video for requestVideoFrameCallback \*\/\}[\s\S]*?<\/video>\s*\)\}/,
  ""
);

// 7. Remove lagSmoothing(0) so GSAP can protect against dropped frames
content = content.replace(
  /\/\/ Optimize GSAP ticker\s*gsap\.ticker\.lagSmoothing\(0\);/,
  "// Optimize GSAP ticker\n        // gsap.ticker.lagSmoothing(0); // Disabled to prevent stuttering"
);

fs.writeFileSync('src/components/Hero.jsx', content);
