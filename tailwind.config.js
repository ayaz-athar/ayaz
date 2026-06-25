/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#050505',
        surface: '#121212',
        'surface-2': '#1e1e1e',
        accent: '#D4A373', // Brown accent
        'accent-2': '#FAEDCD', // Beige accent
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'shape-enter': 'shape-enter 1s ease-out forwards',
        'shape-float': 'shape-float 6s ease-in-out infinite',
      },
      keyframes: {
        'shape-enter': {
          '0%': { opacity: 0, transform: 'scale(0.8) rotate(var(--shape-rotate-start))' },
          '100%': { opacity: 1, transform: 'scale(1) rotate(var(--shape-rotate))' },
        },
        'shape-float': {
          '0%, 100%': { transform: 'translateY(0) rotate(var(--shape-rotate))' },
          '50%': { transform: 'translateY(-20px) rotate(calc(var(--shape-rotate) + 5deg))' },
        }
      }
    },
  },
  plugins: [],
}
