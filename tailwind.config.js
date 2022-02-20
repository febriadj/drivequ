module.exports = {
  content: ['./client/**/*.{js,jsx,tsx}'],
  theme: {
    extend: {
      gridTemplateColumns: {
        'dashboard-header': '1fr auto',
        'table-docs': '1fr 0.5fr 0.5fr 0.5fr',
        navbar: 'auto 1fr 0.5fr',
      },
    },
  },
  plugins: [],
};
