/** @type {import('tailwindcss').Config} */ 
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      navbar : ['Lobster'],
    },
    extend: {
      colors: {
        'regal-green': '#157c79',
      },
      spacing: {
        '128': '32rem',
      }
    },
  },
  plugins: [],
}