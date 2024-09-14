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
        "cyber-lightgreen" : "#D8DF97", // #C8D1A6 cyber-lightgreen old
        "cyber-purple" : "#1A182A",
      },
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
    plugin(function({ addComponents }) {
      addComponents({
        '.inner-cell': {
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '2px',
            right: '2px',
            bottom: '2px',
            left: '2px',
            border: '2px double #D8DF97', // Adjust border width, style, and color
          },
        },
      });
    }),
  ],
}

