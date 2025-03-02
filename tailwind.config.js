/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",  // Для Next.js (App Router)
    "./pages/**/*.{js,ts,jsx,tsx}", // Для Next.js (Pages Router)
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

