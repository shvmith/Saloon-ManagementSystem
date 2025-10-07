/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {

        PrimaryColor: "#d8f3dc",
        SecondaryColor: "#95d5b2",
        DarkColor: "#52b788",
        ExtraDarkColor: "#1b4332",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "bounce-slow": "bounce 2s ease-in-out infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        bounce: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulse: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.5 },
        },

      },
    },
  },
  plugins: [],
};
