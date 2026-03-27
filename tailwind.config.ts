import type { Config } from "tailwindcss"

const config = {
  content: [
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Georgia', 'serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        midnight: '#020202',
        onyx: '#111111',
        amber: '#F59E0B',
        indigo: '#6366F1',
      },
      boxShadow: {
        'glow-amber': '0 0 20px rgba(245, 158, 11, 0.3)',
        'glow-indigo': '0 0 20px rgba(99, 102, 241, 0.3)',
        'brutalist-soft': '4px 4px 0px 0px rgba(245, 158, 11, 0.2)',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(245, 158, 11, 0.2)' },
          '100%': { boxShadow: '0 0 25px rgba(245, 158, 11, 0.5)' },
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
          "primary": "#F59E0B",
          "secondary": "#6366F1",
          "accent": "#8B5CF6",
          "neutral": "#111111",
          "base-100": "#020202",
          "base-content": "#E5E7EB",
          "info": "#3abff8",
          "success": "#36d399",
          "warning": "#fbbd23",
          "error": "#f87272",
        },
      },
    ],
  },
} satisfies Config

export default config
