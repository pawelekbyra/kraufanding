import type { Config } from "tailwindcss"

const config = {
  content: [
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Georgia', 'serif'],
      },
      colors: {
        cyber: '#050505',
        surface: '#121212',
        accent: '#3b82f6',
        text: '#e2e2e2',
        primary: {
          DEFAULT: '#3b82f6',
          dark: '#1d4ed8',
        },
        secondary: {
          DEFAULT: '#8b5cf6',
          dark: '#6d28d9',
        },
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.6)' },
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
          "primary": "#3b82f6",
          "secondary": "#8b5cf6",
          "accent": "#3b82f6",
          "neutral": "#e2e2e2",
          "base-100": "#050505",
          "base-200": "#121212",
          "base-300": "#1a1a1a",
          "base-content": "#e2e2e2",
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
