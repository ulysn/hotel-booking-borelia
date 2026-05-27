/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1B2765',
          dark: '#111B4E',
          light: '#2a4f80',
        },
        leaf: {
          DEFAULT: '#2d9b5e',
          light: '#52c78a',
          dark: '#1a5c38',
        },
        lotus: '#1B6B5C',
      },
      fontFamily: {
        playfair: ['PlayfairDisplay_700Bold'],
        inter: ['Inter_400Regular'],
      },
    },
  },
  plugins: [],
};
