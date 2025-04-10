const lynxPreset = require('@lynx-js/tailwind-preset');

/** @type {import('tailwindcss').Config} */
export default {
  presets: [lynxPreset], // Use the preset
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary': {
          '400': '#5fc9f3',
          '600': '#2e79ba',
          '800': '#1e549f'
        },
        'dark': {
          '400': '#081f37'
        }
      }
    },
  },
  plugins: [],
}

