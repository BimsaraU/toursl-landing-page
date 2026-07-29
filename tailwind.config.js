/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        // max-md targets max-width: 760px
        md: '761px',
      },
      fontFamily: {
        sans: ['Geist', 'sans-serif'],
        display: ['Special Elite', 'serif'],
      },
      colors: {
        toursl: {
          dark: '#0a0a0a',
          text: '#1a1a1a',
          muted: '#767676',
          accent: '#905831',
          sand: '#f7f4f0',
          line: '#e6e1db',
        },
      },
    },
  },
  plugins: [],
};
