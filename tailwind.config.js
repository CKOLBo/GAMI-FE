/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard', 'sans-serif'],
      },
      boxShadow: {
        'GMAI': '4px 4px 20px -5px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [],
};
