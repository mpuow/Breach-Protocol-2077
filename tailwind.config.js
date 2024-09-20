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
        "cyber-lightgreen" : "#D8DF97",
        "cyber-purple" : "#1A182A",
        "cyber-red" : "#F1524C",
        "cyber-yellow" : "#FCEE0A",
        "cyber-success" : "#1BD576",
        "matrix-select" : "#292C39",
        "matrix-preview" : "#1F2019",
        "fail-red" : "#2B0605",
        "success-green" : "#14251A",
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
            border: '4px double #89E5E6',
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
            border: '2px double #D8DF97',
          },
        },
      });
    }),
    plugin(function({ addComponents }) {
      addComponents({
        '.inner-sequence': {
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '8px',
            right: '8px',
            bottom: '8px',
            left: '8px',
            border: '2px double #89E5E6',
          },
        },
      });
    }),
    plugin(function({ addComponents }) {
      addComponents({
        '.inner-sequence-selected': {
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '8px',
            right: '8px',
            bottom: '8px',
            left: '8px',
            border: '2px double #D8DF97',
          },
          '&:hover:before': {
            border: '2px double #D8DF97'
          }
        },
      });
    }),
  ],
}

