/** @type {import('tailwindcss').Config} */
module.exports = {
  // darkMode: 'class',
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      textColor: {
        main: '#D1302A',
        sub: '#9F9F9F',
        dark: '#EDEBEB',
      },
      backgroundColor: {
        main: '#D1302A',
        sub: '#F2F0EF',
        card: '#EDEBEB',
        dark: '#141414',
        'dark-card': '#404040',
        'dark-btn': '#404040',
      },
      borderColor: {
        main: '#D1302A',
        dark: '#141414',
      },
      fontFamily: {
        oswald: ['Oswald_700Bold'],
        nunito: ['NunitoSans_400Regular'],
        'nunito-semi': ['NunitoSans_600SemiBold'],
      },
    },
  },
  plugins: [],
};
