module.exports = {
  content: ['./client/**/*.{js,jsx,tsx}'],
  theme: {
    extend: {
      gridTemplateColumns: {
        navbar: 'auto 1fr 0.5fr',
        tableDocs: '1fr 0.5fr 0.5fr 0.5fr',
      },
    },
  },
  plugins: [],
};
