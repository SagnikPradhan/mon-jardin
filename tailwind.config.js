const colors = require("tailwindcss/colors");

module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      montserrat: ["Montserrat", "sans-serif"],
      sans: ["Nunito", "sans-serif"],
    },

    colors: {
      black: "#1A181B",
      gray: "#BCB9CA",
      snow: "#FFF2F1",
      accent: "#C2E812",
    },

    extend: {
      backgroundImage: () => ({
        "purple-beauty": "url(/gaetano-cessati-CCy2UFLO1Mg-unsplash.jpg)",
      }),
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
