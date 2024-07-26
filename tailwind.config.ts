import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        plusJakartaSans: ["PlusJakartaSans", "Hauora", "sans-serif"],
        roboto: ["Roboto", "Hauora", "sans-serif"],
        hauora: ["Hauora", "PlusJakartaSans", "sans-serif"],
        montserrat: ["Montserrat", "Hauora", "sans-serif"],
        stalemate: ["Stalemate", "Hauora", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
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
      keyframes: {
        round: {
          "100%": {
            borderRadius: "9999px",
          },
        },
        "round-back": {
          "100%": {
            borderRadius: "28px",
          },
        },
        "full-image": {
          "0%": {
            width: "3.5rem",
            borderRadius: "9999px",
          },
          "100%": {
            width: "100%",
            borderRadius: "28px",
          },
        },
        "full-image-back": {
          "0%": {
            width: "100%",
            borderRadius: "28px",
          },
          "100%": {
            width: "3.5rem",
            borderRadius: "9999px",
          },
        },
      },
      animation: {
        round: "round 0.3s ease-in-out forwards",
        "round-back": "round-back 0.3s ease-in-out forwards",
        "full-image": "full-image 0.3s ease-in-out forwards",
        "full-image-back": "full-image-back 0.5s ease-in-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
