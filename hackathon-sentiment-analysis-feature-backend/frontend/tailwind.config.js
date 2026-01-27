/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        "primary": "#1313ec",
        "background-dark": "#0a0a0c",
        "accent-purple": "#6d28d9",
        "sentiment-pos": "#10b981",
        "sentiment-neu": "#64748b",
        "sentiment-neg": "#ef4444",
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"]
      },
    },
  },
  plugins: [],
}
