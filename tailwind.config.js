/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        "brand-blue": "#007BFF",
        "brand-blue-dark": "#0048A0",
        "brand-gray-900": "#111827",
        "brand-gray-700": "#374151",
        "brand-gray-500": "#6B7280",
        "brand-gray-300": "#D1D5DB",
        "brand-gray-100": "#F3F4F6",
        "brand-white": "#FFFFFF",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        card: "var(--shadow-card)",
        halo: "var(--shadow-halo)",
      },
      maxWidth: {
        "container-md": "var(--container-md)",
        "container-lg": "var(--container-lg)",
        "container-xl": "var(--container-xl)",
      },
      borderRadius: {
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      spacing: {
        15: "3.75rem",
        18: "4.5rem",
        22: "5.5rem",
      },
    },
  },
  plugins: [],
};
