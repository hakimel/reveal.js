/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html',
    './js/**/*.js',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  important: true,
  corePlugins: {
    preflight: false,
  },
}

