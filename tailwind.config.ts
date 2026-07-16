import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fdf8f0",
          100: "#f9edda",
          200: "#f2d7b0",
          300: "#e9bc7d",
          400: "#e0a04e",
          500: "#d4862e",
          600: "#c46e23",
          700: "#a3531f",
          800: "#834221",
          900: "#6a381d",
          950: "#3a1b0d",
        },
        cream: "#FFF8F0",
        luxury: {
          gold: "#C4A24E",
          brown: "#5C3A21",
          dark: "#1A0F0A",
          cream: "#F5EDE0",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
