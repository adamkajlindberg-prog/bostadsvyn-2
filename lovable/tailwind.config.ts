import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
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
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
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
          light: "hsl(var(--primary-light))",
          deep: "hsl(var(--primary-deep))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
          light: "hsl(var(--success-light))",
        },
        rental: {
          DEFAULT: "hsl(var(--rental))",
          foreground: "hsl(var(--rental-foreground))",
          light: "hsl(var(--rental-light))",
        },
        premium: {
          DEFAULT: "hsl(var(--premium))",
          foreground: "hsl(var(--premium-foreground))",
          dark: "hsl(var(--premium-dark))",
        },
        critical: {
          DEFAULT: "hsl(var(--critical))",
          foreground: "hsl(var(--critical-foreground))",
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
          warm: "hsl(var(--accent-warm))",
          "warm-foreground": "hsl(var(--accent-warm-foreground))",
          sage: "hsl(var(--accent-sage))",
          "sage-foreground": "hsl(var(--accent-sage-foreground))",
          gold: "hsl(var(--accent-gold))",
          "gold-foreground": "hsl(var(--accent-gold-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        
        /* Enhanced Nordic Design Tokens */
        nordic: {
          ice: "hsl(var(--nordic-ice))",
          glacier: "hsl(var(--nordic-glacier))",
          fjord: "hsl(var(--nordic-fjord))",
          "fjord-deep": "hsl(var(--nordic-fjord-deep))",
          forest: "hsl(var(--nordic-forest))",
          "forest-dark": "hsl(var(--nordic-forest-dark))",
          aurora: "hsl(var(--nordic-aurora))",
          "aurora-light": "hsl(var(--nordic-aurora-light))",
          midnight: "hsl(var(--nordic-midnight))",
          snow: "hsl(var(--nordic-snow))",
          mist: "hsl(var(--nordic-mist))",
          sage: "hsl(var(--nordic-sage))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      backgroundImage: {
        'gradient-nordic': 'var(--gradient-nordic)',
        'gradient-hero': 'var(--gradient-hero)',
        'gradient-card': 'var(--gradient-card)',
        'gradient-premium': 'var(--gradient-premium)',
        'gradient-success': 'var(--gradient-success)',
        'gradient-gold': 'var(--gradient-gold)',
        'gradient-warm': 'var(--gradient-warm)',
        'gradient-ocean': 'var(--gradient-ocean)',
      },
      boxShadow: {
        'nordic': 'var(--shadow-nordic)',
        'card': 'var(--shadow-card)',
        'elevated': 'var(--shadow-elevated)',
        'premium': 'var(--shadow-premium)',
        'success': 'var(--shadow-success)',
        'gold': 'var(--shadow-gold)',
        'glow': 'var(--shadow-glow)',
        'glow-premium': 'var(--shadow-glow-premium)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
