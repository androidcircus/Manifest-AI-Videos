/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        manifest: { primary: '#00f3ff', secondary: '#7000ff', dark: '#0a0a0f', card: '#111118' }
      }
    }
  },
  plugins: []
};
