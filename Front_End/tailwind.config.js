import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  // Files scanned by Tailwind to generate utility classes.
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  // daisyUI adds component classes and theme system on top of Tailwind.
  plugins: [daisyui],
  daisyui: {
    themes: [
      "light",
      "dark",
      "cupcake",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
    ],
  },
};
