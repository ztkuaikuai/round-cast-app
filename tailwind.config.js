/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'bounce-slow': 'bounce 3s ease-in-out infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-rotated-headphone': 'floatRotatedHeadphone 6s ease-in-out infinite',
        'float-rotated-microphone': 'floatRotatedMicrophone 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        floatRotatedHeadphone: {
          '0%, 100%': { transform: 'rotate(-30deg) scaleX(-1) translateY(0px)' },
          '50%': { transform: 'rotate(-30deg) scaleX(-1) translateY(-10px)' },
        },
        floatRotatedMicrophone: {
          '0%, 100%': { transform: 'rotate(15deg) translateY(0px)' },
          '50%': { transform: 'rotate(15deg) translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
};
