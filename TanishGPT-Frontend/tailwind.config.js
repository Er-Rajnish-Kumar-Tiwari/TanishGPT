/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {

      fontSize: {
        "home-heading-larger": ["48px", "56px"],
        "home-heading-small": ["28px", "34px"],
        "course-details-heading-larger": ["36px", "44px"],
        "course-details-heading-small": ["26px", "36px"],
        "default": ["12px", "21px"],
      },

      gridTemplateColumns: {
        auto: "repeat(auto-fit,minmax(200px,1fr))",
      },

      height: {
        "section-height": "500px",
      },

      colors: {
        primary: "#E6CCFF",
      },

    },
  },

  plugins: [],
};