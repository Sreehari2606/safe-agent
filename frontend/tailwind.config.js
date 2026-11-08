/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Swiggy-inspired palette
        swiggy: {
          orange: '#FC8019',
          'orange-dark': '#E37209',
          'orange-light': '#FFF3E8',
        },
        navy: {
          950: '#0a0f1e',
          900: '#0d1427',
          850: '#111827',
          800: '#1a2237',
          700: '#1e2d45',
          600: '#243556',
        },
        surface: {
          DEFAULT: '#1a2237',
          light: '#1f2d47',
          card: '#1e2a40',
        },
        safety: {
          green: '#22c55e',
          yellow: '#f59e0b',
          red: '#ef4444',
          orange: '#f97316',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

