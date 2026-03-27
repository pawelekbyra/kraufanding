import type { Config } from "tailwindcss"

const config = {
  content: [
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        cream: '#FDFBF7', // Legacy, keeping for compatibility if needed elsewhere
        charcoal: '#1a1a1a', // Legacy
        aurora: {
          midnight: '#020617',
          slate: '#0f172a',
          indigo: '#6366f1',
          violet: '#a78bfa',
          rose: '#f43f5e',
        },
      },
      boxShadow: {
        'aurora': '0 0 20px rgba(99, 102, 241, 0.2)',
        'aurora-lg': '0 0 40px rgba(167, 139, 250, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s infinite',
        'aurora-float': 'aurora-float 10s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(99, 102, 241, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.6)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'aurora-float': {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '100%': { transform: 'translate(5%, 5%) scale(1.1)' },
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
          "primary": "#6366f1",
          "secondary": "#a78bfa",
          "accent": "#f43f5e",
          "neutral": "#1e293b",
          "base-100": "#020617",
          "base-200": "#0f172a",
          "base-300": "#1e293b",
          "base-content": "#f8fafc",
          "info": "#0ea5e9",
          "success": "#10b981",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
      },
      "dark",
    ],
  },
} satisfies Config

export default config
