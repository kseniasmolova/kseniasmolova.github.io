const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  target: 'ie11',
  purge: ['**/*.html', 'assets/**/*.js'],
  theme: {
    container: { center: true, padding: '1rem' },
    extend: {
      fontFamily: {
        sans: ['Jura', ...defaultTheme.fontFamily.sans],
      },
      transitionDuration: { '0': '0ms' },
      zIndex: { '-1': '-1' },
    },
    colors: {
      ...defaultTheme.colors,
      'black-translucent': 'rgba(0,0,0,0.5)',
      'premiere-light': '#232323',
      'premiere-dark': '#1b1b1b',
    },
  },
  variants: {
    display: ['responsive', 'group-hover'],
  },
  plugins: [],
};
