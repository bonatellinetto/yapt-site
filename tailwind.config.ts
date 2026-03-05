import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
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
        sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        poppins: ['"Poppins"', 'sans-serif'],
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
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        brand: {
          DEFAULT: "hsl(var(--brand-primary))",
          primary: "hsl(var(--brand-primary))",
          "primary-hover": "hsl(var(--brand-primary-hover))",
          "primary-soft": "hsl(var(--brand-primary-soft))",
          "primary-muted": "hsl(var(--brand-primary-muted))",
        },
        yapt: {
          teal: "hsl(var(--yapt-teal))",
          "teal-light": "hsl(var(--yapt-teal-light))",
          slate: "hsl(var(--yapt-slate))",
          dark: "hsl(var(--yapt-dark))",
        },
        ya: {
          inbox: "hsl(var(--ya-inbox))",
          people: "hsl(var(--ya-people))",
          deals: "hsl(var(--ya-deals))",
          connect: "hsl(var(--ya-connect))",
          veh: "hsl(var(--ya-veh))",
          team: "hsl(var(--ya-team))",
          memory: "hsl(var(--ya-memory))",
          campaigns: "hsl(var(--ya-campaigns))",
          flows: "hsl(var(--ya-flows))",
          ops: "hsl(var(--ya-ops))",
          analytics: "hsl(var(--ya-analytics))",
        },
        status: {
          overdue: "hsl(var(--status-overdue))",
          warning: "hsl(var(--status-warning))",
          success: "hsl(var(--status-success))",
          info: "hsl(var(--status-info))",
          danger: "hsl(var(--status-danger))",
          discovery: "hsl(var(--status-discovery))",
        },
      },
      borderRadius: {
        xs: "4px",
        sm: "6px",
        md: "8px",
        lg: "var(--radius)",
        xl: "12px",
        "2xl": "16px",
        "3xl": "20px",
      },
      boxShadow: {
        "hairline": "var(--shadow-hairline)",
        "elevation-100": "var(--shadow-hairline), var(--shadow-100)",
        "elevation-200": "var(--shadow-hairline), var(--shadow-200)",
        "elevation-300": "var(--shadow-hairline), var(--shadow-300)",
        "elevation-400": "var(--shadow-hairline), var(--shadow-400)",
      },
      transitionTimingFunction: {
        "cubic-enter": "cubic-bezier(0.19, 1, 0.22, 1)",
        "cubic-exit": "cubic-bezier(0.8, 0, 0.4, 1)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "float1": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-20px) rotate(5deg)" },
        },
        "float2": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-15px) rotate(-5deg)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s cubic-bezier(0.19, 1, 0.22, 1)",
        "float1": "float1 8s ease-in-out infinite",
        "float2": "float2 6s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
