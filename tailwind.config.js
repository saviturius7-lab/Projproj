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
          50: '#fdfbf7',
          100: '#fbf5e8',
          200: '#f4ebd0',
          300: '#ecdcb9',
          400: '#e2caa0',
          500: '#d5b682',
          600: '#bf9c65',
        },
        manila: {
          light: '#fbf4e2',
          DEFAULT: '#ebdcb9',
          dark: '#d6c095',
          border: '#aa8c58',
        },
        vintage: {
          dark: '#221910',
          brown: '#382819',
          textMuted: '#684f33',
          accent: '#6f4e24',
          accentHover: '#4e3314',
          border: '#8b6f47',
          borderLight: '#cfba96',
          stampRed: '#9e2a2b',
          stampBlue: '#1d3557',
          stampGreen: '#2d6a4f',
          carbonPink: '#f9dcd8',
          ledgerBlue: '#e8edf5',
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        serif: ['Lora', 'Georgia', 'serif'],
        typewriter: ['"Special Elite"', '"Courier Prime"', 'Courier', 'monospace'],
        mono: ['"Courier Prime"', 'monospace'],
      }
    },
  },
  plugins: [],
}
