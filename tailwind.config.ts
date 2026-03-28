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
        linen: '#F5F2ED',
        bone: '#EBE7E0',
        ink: '#1A1A1A',
        oxblood: '#6B1D1D',
        charcoal: '#2C3E50',
        cream: '#FDFBF7', // Legacy fallback
        primary: {
          DEFAULT: '#1A1A1A',
          dark: '#000000',
        },
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'ink-glow': 'ink-glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(26, 26, 26, 0.1)' },
          '100%': { boxShadow: '0 0 15px rgba(26, 26, 26, 0.2)' },
        },
        'ink-glow': {
          '0%': { boxShadow: '0 0 2px rgba(26, 26, 26, 0.05)' },
          '100%': { boxShadow: '0 0 10px rgba(26, 26, 26, 0.1)' },
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
          "primary": "#1A1A1A",
          "secondary": "#6B1D1D",
          "accent": "#6B1D1D",
          "neutral": "#1A1A1A",
          "base-100": "#F5F2ED",
          "base-200": "#EBE7E0",
          "base-300": "#DFDAD0",
          "info": "#3abff8",
          "success": "#36d399",
          "warning": "#fbbd23",
          "error": "#f87272",
        },
      },
      "light",
    ],
  },
} satisfies Config

export default config
