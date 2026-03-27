import type { Config } from "tailwindcss"

const config = {
  content: [
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Georgia', 'serif'],
        mono: ['JetBrains Mono', 'IBM Plex Mono', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        linen: '#FAF9F6',
        obsidian: '#171717',
        ikb: '#2563EB',
        cream: '#FDFBF7', // Maintaining for compatibility during migration
        charcoal: '#1a1a1a', // Maintaining for compatibility
        primary: {
          DEFAULT: '#2563EB',
          dark: '#1d4ed8',
        },
        secondary: {
          DEFAULT: '#8b5cf6',
          dark: '#6d28d9',
        },
      },
      boxShadow: {
        'brutalist': '4px 4px 0px 0px #171717',
        'brutalist-sm': '2px 2px 0px 0px #171717',
        'brutalist-accent': '4px 4px 0px 0px #2563EB',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(37, 99, 235, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(37, 99, 235, 0.6)' },
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
          "primary": "#2563EB",
          "secondary": "#8b5cf6",
          "accent": "#171717",
          "neutral": "#171717",
          "base-100": "#FAF9F6",
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
