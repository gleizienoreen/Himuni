/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#F5F1EA',
          soft: '#FAF7F2',
          deep: '#EBE4D8',
          warm: '#E4DCCE',
        },
        ink: {
          DEFAULT: '#24232B',
          soft: '#353340',
          muted: '#5A5766',
          subtle: '#787486',
        },
        violet: {
          DEFAULT: '#8067E8',
          soft: '#EAE5FB',
          deep: '#4D38B0',
        },
        tangerine: {
          DEFAULT: '#F18B63',
          soft: '#FCE6DC',
          deep: '#B64C23',
        },
        butter: {
          DEFAULT: '#E8D98E',
          soft: '#FAF5DC',
          deep: '#8F7B20',
        },
        sky: {
          DEFAULT: '#BBD5DF',
          soft: '#E6F0F4',
          deep: '#477282',
        },
        blush: {
          DEFAULT: '#E8B8C8',
          soft: '#F9ECF1',
          deep: '#9E4D69',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', '-apple-system', 'sans-serif'],
        sans: ['"DM Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        baybayin: ['"Noto Sans Tagalog"', 'sans-serif'],
      },
      letterSpacing: {
        editorial: '-0.035em',
        wideLabel: '0.16em',
      },
      maxWidth: {
        editorial: '82rem',
      },
    },
  },
  plugins: [],
};
