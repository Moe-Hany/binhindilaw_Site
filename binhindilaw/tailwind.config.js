/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary brown theme based on #4B2615
        primary: {
          50: '#fdf8f6',
          100: '#f2e8e2',
          200: '#eaddd7',
          300: '#e0cfc7',
          400: '#d2bdb2',
          500: '#c69c7b',
          600: '#a16859',
          700: '#8b5a47',
          800: '#744a39',
          900: '#4B2615', // Main brown color
          950: '#2c1409',
        },
        // Keep brown as alias for backward compatibility
        brown: {
          50: '#fdf8f6',
          100: '#f2e8e2',
          200: '#eaddd7',
          300: '#e0cfc7',
          400: '#d2bdb2',
          500: '#c69c7b',
          600: '#a16859',
          700: '#8b5a47',
          800: '#744a39',
          900: '#4B2615', // Main brown color
          950: '#2c1409',
        },
      },
    },
  },
  plugins: [],
} 