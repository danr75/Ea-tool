import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,js,jsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f6f7fb",
          100: "#eceef5",
          200: "#d6dae7",
          300: "#b1b8cc",
          400: "#7d859e",
          500: "#525a72",
          600: "#373d51",
          700: "#252a3a",
          800: "#171b27",
          900: "#0c0f17",
          950: "#06080f",
        },
        accent: {
          DEFAULT: "#5b8def",
          soft: "#dbe6ff",
          deep: "#2d59c2",
        },
        signal: {
          new: "#22c55e",
          enhance: "#3b82f6",
          replace: "#f59e0b",
          consolidate: "#a855f7",
        },
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Inter",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15,23,42,0.04), 0 4px 12px rgba(15,23,42,0.06)",
        pop: "0 8px 32px rgba(15,23,42,0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
