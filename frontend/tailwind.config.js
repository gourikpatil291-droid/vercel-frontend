/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#f4f1ea',
        surface: '#ffffff',
        surfaceHover: '#eae4d9',
        primary: {
          500: '#a67c52',
          600: '#8c6641',
        },
        text: {
          main: '#3d2e20',
          muted: '#806e5d'
        },
        input: {
          bg: '#ffffff',
          border: '#d6cdbd'
        }
      }
    },
  },
  plugins: [],
}
