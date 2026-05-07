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
    extend: {},
  },
  plugins: [],
};
