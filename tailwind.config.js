import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#39F",
        lightaccent: "#66b3ff",
        darkaccent: '#2491ff',

         darkbg: '#E5E5E5',

        fontblack: "#191919",
        fontmedium: "#808080",
        fontlight: "#ababab"
      },
      screens: {
        'glxfd': '300px'
        // 'phonesm': '240px',
        // => @media (min-width: 640px) { ... }
      }
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
