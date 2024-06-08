/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    
    extend: {
      colors: {
        primary: "#1476ff",
        // secondary: "#f3f5ff",
        secondary: '#e6e9f5',
        light: "#eff2ff",

        primaryBg: '#15202B',
        secondaryBg: '#22303C',
        grayCustom: '#8899A6'
      },

      backgroundImage: {
        'hero-pattern': "url('./src/assets/bg.jpg')",
        'footer-texture': "url('/img/footer-texture.png')",
      }
    },
  },
  plugins: [],
};
