import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
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
      colors: {
        // Modern Soft Color Palette
        "soft-primary": "#6366F1", // Soft indigo
        "soft-secondary": "#8B5CF6", // Soft purple
        "soft-accent": "#06B6D4", // Soft cyan
        "soft-success": "#10B981", // Soft emerald
        "soft-warning": "#F59E0B", // Soft amber
        "soft-error": "#EF4444", // Soft red

        // Neutral Grays
        "neutral-50": "#FAFAFA",
        "neutral-100": "#F5F5F5",
        "neutral-200": "#E5E5E5",
        "neutral-300": "#D4D4D4",
        "neutral-400": "#A3A3A3",
        "neutral-500": "#737373",
        "neutral-600": "#525252",
        "neutral-700": "#404040",
        "neutral-800": "#262626",
        "neutral-900": "#171717",
        "neutral-950": "#0A0A0A",

        // Background Colors
        "bg-primary": "#FFFFFF",
        "bg-secondary": "#F8FAFC",
        "bg-tertiary": "#F1F5F9",
        "bg-dark": "#0F172A",
        "bg-dark-secondary": "#1E293B",
        "bg-dark-tertiary": "#334155",

        // Text Colors
        "text-primary": "#1E293B",
        "text-secondary": "#64748B",
        "text-tertiary": "#94A3B8",
        "text-dark-primary": "#F8FAFC",
        "text-dark-secondary": "#CBD5E1",
        "text-dark-tertiary": "#94A3B8",

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#6366F1",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#F1F5F9",
          foreground: "#1E293B",
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F1F5F9",
          foreground: "#64748B",
        },
        accent: {
          DEFAULT: "#06B6D4",
          foreground: "#FFFFFF",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#1E293B",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#1E293B",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        "slide-down": {
          from: { transform: "translateY(-100%)" },
          to: { transform: "translateY(0)" },
        },
        "scale-in": {
          from: { transform: "scale(0.95)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
        "gentle-bounce": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-2px)" },
        },
        "soft-glow": {
          "0%, 100%": {
            boxShadow: "0 0 20px rgba(99, 102, 241, 0.1)",
          },
          "50%": {
            boxShadow: "0 0 30px rgba(99, 102, 241, 0.2)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "slide-down": "slide-down 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "gentle-bounce": "gentle-bounce 2s ease-in-out infinite",
        "soft-glow": "soft-glow 3s ease-in-out infinite",
      },
      backgroundImage: {
        "gradient-soft": "linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #06B6D4 100%)",
        "gradient-subtle": "linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)",
      },
      boxShadow: {
        soft: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        "soft-md": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        "soft-lg": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        "soft-xl": "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
