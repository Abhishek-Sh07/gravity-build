/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  // No preflight — the project has its own CSS reset
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        mint: '#bbf6e2',
      },
      fontFamily: {
        sans: ['var(--font-manrope)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
