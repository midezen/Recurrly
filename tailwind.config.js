/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: include all app and example app files that contain NativeWind/Tailwind classes.
  // We include the top-level `app/` and the `app-example/` folders plus common JS/TS extensions.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./app-example/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#fff9e3",
        foreground: "#081126",
        card: "#fff8e7",
        muted: "#f6eecf",
        "muted-foreground": "rgba(0, 0, 0, 0.6)",
        primary: "#081126",
        accent: "#ea7a53",
        border: "rgba(0, 0, 0, 0.1)",
        success: "#16a34a",
        destructive: "#dc2626",
        subscription: "#8fd1bd",
      },
      spacing: {
        // map spacing tokens from your global.css
        0: "0px",
        1: "4px",
        2: "8px",
        3: "12px",
        4: "16px",
        5: "20px",
        6: "24px",
        7: "28px",
        8: "32px",
        9: "36px",
        10: "40px",
        11: "44px",
        12: "48px",
        2.5: "10px",
        14: "56px",
        16: "64px",
        18: "72px",
        20: "80px",
        24: "96px",
        30: "120px",
        // alias for min-h-50 used in CSS; map to 200px as an example
        50: "200px",
      },
      minHeight: {
        50: "200px",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      fontFamily: {
        sans: ["sans-regular"],
        "sans-light": ["sans-light"],
        "sans-medium": ["sans-medium"],
        "sans-semibold": ["sans-semibold"],
        "sans-bold": ["sans-bold"],
        "sans-extrabold": ["sans-extrabold"],
      },
    },
  },
  plugins: [
    // small plugin to generate `size-N` utilities (width+height)
    function ({ addUtilities, theme }) {
      const sizes = [8, 6, 12, 14, 16, 50];
      const utilities = {};
      sizes.forEach((n) => {
        const key = `.size-${n}`;
        const val = theme("spacing")[n] || n + "px";
        utilities[key] = { width: val, height: val };
      });
      addUtilities(utilities, { variants: ["responsive"] });
    },
  ],
};
