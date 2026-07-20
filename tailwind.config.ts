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
        terracotta: {
          DEFAULT: "#cf542f",
          dark: "#a84227",
          light: "#f7e4d8",
        },
        gold: {
          DEFAULT: "#d7a148",
          dark: "#2c211b",
        },
        ink: "#050505",
        muted: "#686868",
        line: "#e7e7e7",
        "line-strong": "#dedede",
        whatsapp: "#31a844",
        "card-bg": "#f3f3f3",
        newsletter: "#c24f32",
        "newsletter-text": "#fff7ee",
        cream: "#ffffff",
      },
      fontFamily: {
        sans: ["Helvetica", "Arial", "sans-serif"],
      },
      borderRadius: {
        card: "8px",
        button: "32px",
      },
      boxShadow: {
        theme: "0 14px 34px rgba(82, 50, 29, .1)",
      },
    },
  },
  plugins: [],
};
export default config;
