/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          50: '#faf6ec',
          100: '#f7f0de',
          200: '#f4ecd8',
          300: '#efe4c8',
          400: '#ebe0c2',
          500: '#e7ddc4',
          600: '#d5c49b',
        },
        vintage: {
          dark: '#2a1f12',
          brown: '#3b2f1e',
          textMuted: '#6b5330',
          accent: '#7a5a2e',
          accentHover: '#5a3e1b',
          border: '#8b6f47',
          borderLight: '#d9c7a6',
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        serif: ['Lora', 'Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}
