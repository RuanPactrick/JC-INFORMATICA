/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#05050A',
          navy: '#0A0A14',
          navyLight: '#12121D',
          purple: '#6002EE',
          purpleHover: '#4B01BB',
          magenta: '#E040FB',
          neon: '#00E5FF',
          violet: '#9C27B0',
        },
        surface: {
          50: '#F8F9FA',
          100: '#F1F3F5',
          200: '#E9ECEF',
        }
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 10px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.08)',
        'premium': '0 20px 40px -10px rgba(96, 2, 238, 0.15)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      maxWidth: {
        'container': '1440px',
      }
    },
  },
  plugins: [],
}

