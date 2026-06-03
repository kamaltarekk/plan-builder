/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // Sabika brand palette — adjustable. Gold-forward with a deep ink base.
      fontFamily: {
        sans: ['Cairo', 'system-ui', 'sans-serif'],
      },
      colors: {
        sabika: {
          gold: '#C9A227',
          'gold-dark': '#9C7C12',
          'gold-light': '#F4E9C1',
          ink: '#15131F',
          'ink-soft': '#262338',
          cream: '#FBF8F1',
          silver: '#8E97A6',
          'silver-light': '#E4E7EC',
        },
      },
      boxShadow: {
        card: '0 10px 30px -12px rgba(21, 19, 31, 0.18)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
};
