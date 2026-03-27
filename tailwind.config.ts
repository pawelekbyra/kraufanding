import type { Config } from "tailwindcss"

const config = {
  content: [
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-eb-garamond)', 'Georgia', 'serif'],
        sans: ['var(--font-space-grotesk)', 'Inter', 'sans-serif'],
        mono: ['var(--font-ibm-plex-mono)', 'monospace'],
      },
      colors: {
        obsidian: '#050505',
        bone: '#E8E6E3',
        gold: '#C5A059',
        crimson: '#8B0000',
        charcoal: '#141414',
        cream: '#FDFBF7', // Keeping legacy for smooth transition if needed, but will phase out
        primary: {
          DEFAULT: '#C5A059',
          dark: '#A6823E',
        },
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'gold-glow': 'gold-glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(197, 160, 89, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(197, 160, 89, 0.6)' },
        },
        'gold-glow': {
          '0%': { boxShadow: '0 0 2px rgba(197, 160, 89, 0.1)' },
          '100%': { boxShadow: '0 0 15px rgba(197, 160, 89, 0.4)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        }
      }
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    require("daisyui"),
  ],
  daisyui: {
    themes: [
      {
        polutek: {
          "primary": "#C5A059",
          "secondary": "#8B0000",
          "accent": "#C5A059",
          "neutral": "#E8E6E3",
          "base-100": "#050505",
          "base-200": "#141414",
          "base-300": "#1F1F1F",
          "info": "#3abff8",
          "success": "#36d399",
          "warning": "#fbbd23",
          "error": "#f87272",
        },
      },
      "dark",
    ],
  },
} satisfies Config

export default config
