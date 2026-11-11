/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#050506',
          elevated: '#090A0D',
          surface: '#0E0F14',
          border: 'rgba(255, 255, 255, 0.08)',
        },
        champagne: {
          DEFAULT: '#E5A958',
          glow: 'rgba(229, 169, 88, 0.25)',
          muted: '#C88C42',
        },
        glacial: {
          DEFAULT: '#9CE0FF',
          glow: 'rgba(156, 224, 255, 0.25)',
        }
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        serif: ['Instrument Serif', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight: '-0.025em',
        normal: '0',
        wide: '0.12em',
        widest: '0.24em',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
