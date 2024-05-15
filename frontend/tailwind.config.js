/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#472183",
        secondary: "#4B56D2",
        tertiary: "#82C3EC",
        quaternary: "#F1F6F5",
      },
    },
  },
  plugins: [],
};
