import type { Config } from "tailwindcss";

// Farben aus dem Stitch-Design: hell = "Omni Admin System", dunkel = "Obsidian Command".
// Die Werte stehen als CSS-Variablen in app/globals.css.
const v = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: v("surface"),
        "s-lowest": v("s-lowest"),
        "s-low": v("s-low"),
        "s-mid": v("s-mid"),
        "s-high": v("s-high"),
        "s-highest": v("s-highest"),
        ink: v("ink"),
        muted: v("muted"),
        outline: v("outline"),
        line: v("line"),
        primary: v("primary"),
        accent: v("accent"),
        "on-accent": v("on-accent"),
        "accent-soft": v("accent-soft"),
        ok: v("ok"),
        "ok-bg": v("ok-bg"),
        warn: v("warn"),
        "warn-bg": v("warn-bg"),
        err: v("err"),
        "err-bg": v("err-bg"),
      },
      fontFamily: { sans: ["Inter", "system-ui", "sans-serif"] },
      boxShadow: { card: "0 1px 3px 0 rgba(15,23,42,0.06)" },
    },
  },
  plugins: [],
} satisfies Config;
