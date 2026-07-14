/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F4EBDD',
        'paper-warm': '#EDDFCB',
        wrapper: '#E8D8C4',
        'wrapper-mark': '#B8977B',
        ink: '#2B1B17',
        accent: '#E14B4E',
        'accent-soft': '#FFE0DC',
        highlight: '#F5B94F',
      },
      fontFamily: {
        display: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
