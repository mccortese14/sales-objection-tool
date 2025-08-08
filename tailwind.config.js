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
        'cocktail-primary': '#8B5A2B',
        'cocktail-secondary': '#D2691E',
        'cocktail-accent': '#FFD700',
        'cocktail-dark': '#4A4A4A',
        'cocktail-light': '#F5F5DC',
      },
      fontFamily: {
        'cocktail': ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}