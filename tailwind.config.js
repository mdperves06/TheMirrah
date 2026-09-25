/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        parchment: {
          50: '#fbf8f1',
          100: '#f6f0e2',
          200: '#f1e7d0', // base sand
          300: '#e5d7b7',
          400: '#d5be93',
          500: '#c2a472',
          800: '#3d3023',
          900: '#221a13',
          950: '#140f0a',
        },
        ink: {
          light: '#4d3d2c',
          DEFAULT: '#2a2118',
          dark: '#1a140f',
          muted: '#695744',
        },
        kharaan: {
          light: '#e5c368',
          DEFAULT: '#c9a13b', // Kharaan gold
          dark: '#9e7b24',
          glow: 'rgba(201, 161, 59, 0.4)',
        },
        zahari: {
          light: '#5ca372',
          DEFAULT: '#3f7d52', // Zahari green
          dark: '#2c5939',
          glow: 'rgba(63, 125, 82, 0.4)',
        },
        seam: {
          light: '#d95a48',
          DEFAULT: '#b5402f', // Seam red
          dark: '#8b2e20',
          glow: 'rgba(181, 64, 47, 0.4)',
        },
        ashen: {
          light: '#525252',
          DEFAULT: '#3a3a3a', // Charcoal
          dark: '#212121',
          fire: '#d97706',
        },
        concord: {
          light: '#50759e',
          DEFAULT: '#3b5775', // Slate-blue
          dark: '#273c52',
          glow: 'rgba(59, 87, 117, 0.4)',
        },
      },
      fontFamily: {
        serif: ['"Cinzel"', '"Spectral"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      boxShadow: {
        'document': '0 4px 20px -2px rgba(42, 33, 24, 0.15), 0 0 0 1px rgba(42, 33, 24, 0.08)',
        'document-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.6), inset 0 0 0 1px rgba(241, 231, 208, 0.12)',
        'gold-glow': '0 0 15px rgba(201, 161, 59, 0.35)',
        'green-glow': '0 0 15px rgba(63, 125, 82, 0.35)',
        'red-glow': '0 0 15px rgba(181, 64, 47, 0.45)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'seam-pulse': 'seamPulse 2.5s ease-in-out infinite',
      },
      keyframes: {
        seamPulse: {
          '0%, 100%': { opacity: '0.45', filter: 'drop-shadow(0 0 8px rgba(181, 64, 47, 0.6))' },
          '50%': { opacity: '0.85', filter: 'drop-shadow(0 0 18px rgba(217, 90, 72, 0.9))' },
        },
      },
    },
  },
  plugins: [],
}
