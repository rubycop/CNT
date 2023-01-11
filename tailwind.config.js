const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gray: {
          900: "#1e163d",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
