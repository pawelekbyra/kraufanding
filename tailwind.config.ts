import type { Config } from "tailwindcss"

const config = {
  content: [
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        cream: '#F8F6F1',
        charcoal: '#1E1E1E',
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          dark: '#0f0f0f',
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          dark: '#2a2a2a',
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px hsl(var(--accent) / 0.2)' },
          '100%': { boxShadow: '0 0 20px hsl(var(--accent) / 0.4)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
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
          "primary": "#1E1E1E",
          "secondary": "#E8E4DC",
          "accent": "#C4794A",
          "neutral": "#1E1E1E",
          "base-100": "#F8F6F1",
          "base-200": "#F0EDE6",
          "base-300": "#E8E4DC",
          "info": "#5B8A9A",
          "success": "#6B8E6B",
          "warning": "#C4A35A",
          "error": "#A65B5B",
        },
      },
      "light",
    ],
  },
} satisfies Config

export default config
