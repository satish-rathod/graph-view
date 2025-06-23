/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        'cs-blue': '#4A90E2',
        'cs-light-blue': '#E8F4FD',
        'cs-gray': '#F8F9FA',
        'cs-border': '#E5E5E5',
        'cs-text': '#333333',
        'cs-text-light': '#666666',
      }
    },
  },
  plugins: [],
}