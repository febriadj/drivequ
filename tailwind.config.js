module.exports = {
  content: ['./client/**/*.{js,jsx,tsx}'],
  theme: {
    extend: {
      gridTemplateColumns: {
        '4/1fr-0.5fr-0.5fr-0.5fr': '1fr 0.5fr 0.5fr 0.5fr',
        '3/auto-1fr-0.5fr': 'auto 1fr 0.5fr',
        '2/1fr-auto': '1fr auto',
        '2/auto-1fr': 'auto 1fr',
      },
      gridTemplateRows: {
        '2/auto-1fr': 'auto 1fr',
      },
    },
  },
  plugins: [],
};
