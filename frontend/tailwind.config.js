import typography from '@tailwindcss/typography';
import forms from '@tailwindcss/forms';
import { SPACING, TRANSITIONS, BREAKPOINTS } from "./src/theme/designTokens.ts";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      spacing: {
        xs: SPACING.xs,
        sm: SPACING.sm,
        md: SPACING.md,
        lg: SPACING.lg,
        xl: SPACING.xl,
        "2xl": SPACING["2xl"],
        "3xl": SPACING["3xl"],
        "4xl": SPACING["4xl"],
      },
      transitionDuration: {
        fast: TRANSITIONS.duration.fast,
        base: TRANSITIONS.duration.base,
        slow: TRANSITIONS.duration.slow,
        slower: TRANSITIONS.duration.slower,
        slowest: TRANSITIONS.duration.slowest,
      },
      transitionTimingFunction: {
        "ease-in": TRANSITIONS.easing.easeIn,
        "ease-out": TRANSITIONS.easing.easeOut,
        "ease-in-out": TRANSITIONS.easing.easeInOut,
      },
    },
    screens: {
      xs: BREAKPOINTS.xs,
      sm: BREAKPOINTS.sm,
      md: BREAKPOINTS.md,
      lg: BREAKPOINTS.lg,
      xl: BREAKPOINTS.xl,
      "2xl": BREAKPOINTS["2xl"],
    },
  },
  plugins: [
    typography,
    forms,
  ],
}
