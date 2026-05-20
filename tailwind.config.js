export default {
  content: ["./index.html", "./src/client/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Sora", "Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        astro: "0 28px 120px rgba(0, 0, 0, 0.48)",
        halo: "0 0 52px rgba(47, 214, 255, 0.24)",
      },
    },
  },
};
