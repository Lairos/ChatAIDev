/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width: {
        '3/10': '30%',
        '5/10': '50%',
        '2/10': '20%',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
