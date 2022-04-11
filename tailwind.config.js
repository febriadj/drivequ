const tailwindScrollbar = require('tailwind-scrollbar');

module.exports = {
  content: ['./client/**/*.{js,jsx,tsx}'],
  theme: {
    extend: {
      gridTemplateColumns: {
        '2/1fr-auto': '1fr auto',
        '2/auto-1fr': 'auto 1fr',
        '2/1fr-0.3fr': '1fr 0.3fr',
        '4/1fr-0.5fr-0.5fr-0.5fr': '1fr 0.5fr 0.5fr 0.5fr',
        '3/auto-1fr-auto': 'auto 1fr auto',
        '3/auto-1fr-0.5fr': 'auto 1fr 0.5fr',
      },
      gridTemplateRows: {
        '2/auto-1fr': 'auto 1fr',
        '2/1fr-auto': '1fr auto',
      },
    },
  },
  plugins: [
    tailwindScrollbar,
  ],
};
