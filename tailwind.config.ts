import type { Config } from "tailwindcss"

const config = {
  content: [
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: '#FDFBF7',
        charcoal: '#1a1a1a',
        gold: {
          DEFAULT: '#B89E6C',
          light: '#D4C3A3',
          dark: '#8C764D',
        },
        navy: {
          DEFAULT: '#0f172a',
          light: '#1e293b',
          dark: '#020617',
        },
        primary: {
          DEFAULT: '#0f172a', // Navy as primary
          dark: '#020617',
        },
        secondary: {
          DEFAULT: '#B89E6C', // Gold as secondary
          dark: '#8C764D',
        },
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'elegant': '0 10px 40px -10px rgba(0, 0, 0, 0.08)',
      },
      animation: {
        'glow': 'glow 3s ease-in-out infinite alternate',
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(184, 158, 108, 0.1)' },
          '100%': { boxShadow: '0 0 20px rgba(184, 158, 108, 0.4)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
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
          "primary": "#0f172a", // Navy
          "secondary": "#B89E6C", // Gold
          "accent": "#B89E6C",
          "neutral": "#1a1a1a",
          "base-100": "#FDFBF7",
          "info": "#3abff8",
          "success": "#059669",
          "warning": "#d97706",
          "error": "#dc2626",
          "--rounded-btn": "0.5rem",
          "--rounded-box": "1rem",
        },
      },
      "light",
    ],
  },
} satisfies Config

export default config
