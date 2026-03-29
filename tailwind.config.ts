import type { Config } from "tailwindcss"

const config = {
  content: [
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        linen: '#F5F2ED',
        bone: '#EBE7E0',
        ink: '#1A1A1A',
        oxblood: '#6B1D1D',
        cream: '#FDFBF7',
        charcoal: '#1a1a1a',
      },
      boxShadow: {
        'brutalist': '4px 4px 0px 0px #1A1A1A',
        'brutalist-sm': '2px 2px 0px 0px #1A1A1A',
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
          "primary": "#1A1A1A",
          "secondary": "#6B1D1D",
          "accent": "#6B1D1D",
          "neutral": "#1A1A1A",
          "base-100": "#F5F2ED",
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
