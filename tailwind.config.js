/** @type {import('tailwindcss').Config} */
export default {
  eslint: {
    ignoreDuringBuilds: true,
  },
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}