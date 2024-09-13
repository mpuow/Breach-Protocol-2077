/** @type {import('tailwindcss').Config} */

const plugin = require('tailwindcss/plugin')

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "cyber-blue" : "#89E5E6",
        "cyber-green" : "#CEEC58",
        "cyber-lightgreen" : "#C8D1A6",
      }
    },
  },
  plugins: [
    require("tailwindcss-inner-border"),
    plugin(function({ addComponents }) {
      addComponents({
        '.double-border': {
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '0px',
            right: '0px',
            bottom: '0px',
            left: '0px',
            border: '4px double #89E5E6', // Adjust border width, style, and color
          },
        },
      });
    }),
  ],
}

