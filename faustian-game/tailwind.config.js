/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        infernal: {
          100: '#ffb3b3',
          200: '#ff8080',
          300: '#ff4d4d',
          400: '#ff1a1a',
          500: '#e60000',
          600: '#b30000',
          700: '#800000',
          800: '#4d0000',
          900: '#1a0000',
        },
        brimstone: {
          100: '#fff7b3',
          200: '#fff080',
          300: '#ffe84d',
          400: '#ffe01a',
          500: '#e6c800',
          600: '#b39a00',
          700: '#806d00',
          800: '#4d4100',
          900: '#1a1600',
        }
      },
      animation: {
        'move-to-center': 'moveToCenter 1s forwards',
        'pulse': 'pulse 1.5s infinite',
        'exit-right': 'exitRight 0.5s forwards',
      },
      keyframes: {
        moveToCenter: {
          '0%': { transform: 'translateY(100px) scale(0.8)', opacity: 0.5 },
          '100%': { transform: 'translateY(0) scale(1)', opacity: 1 },
        },
        exitRight: {
          '0%': { transform: 'translateX(0) scale(1)', opacity: 1 },
          '100%': { transform: 'translateX(200px) scale(0.8)', opacity: 0 },
        },
      },
    },
  },
  plugins: [],
}

