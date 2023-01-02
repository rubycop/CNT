const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gray: {
          900: "#210048",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
