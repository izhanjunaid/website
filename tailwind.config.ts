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
        accent: "#EC2D9E",
        "site-bg": {
          light: "#FDD9E5", // Soft baby pink
          dark: "#1F1B1D"  // Dark mode background
        }
      },
      container: {
        center: true,
        padding: "15px",
      },
    },
  },
  plugins: [],
};
export default config;
