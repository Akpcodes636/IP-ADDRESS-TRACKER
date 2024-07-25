/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "mobile-bg": "url('/images/pattern-bg-mobile.png')",
        "desktop-bg": "url('/images/pattern-bg-desktop.png')",
      },
    },
  },
  plugins: [],
};
