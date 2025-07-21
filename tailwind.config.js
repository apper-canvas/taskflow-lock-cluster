/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f3e8ff',
          100: '#e9d5ff',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95'
        },
        accent: {
          500: '#f59e0b',
          600: '#d97706'
        },
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6'
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif']
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'slide-in': 'slide-in 0.2s ease-out',
        'scale-in': 'scale-in 0.15s ease-out'
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        'slide-in': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
      }
    },
  },
  plugins: [],
}