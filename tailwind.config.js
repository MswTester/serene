/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // 스크롤바의 색상을 정의
      colors: {
        'scrollbar-bg': '#F5F5F5',
        'scrollbar-thumb': '#888',
      },
      // 스크롤바의 너비를 정의
      spacing: {
        '1/2': '0.125rem',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        // 스크롤바 스타일링을 위한 클래스를 추가
        '.scrollbar-hide': {
          'scrollbar-width': 'none', /* Firefox */
          '-ms-overflow-style': 'none',  /* IE and Edge */
        },
        '.scrollbar-thin': {
          'scrollbar-width': 'thin', /* Firefox */
        },
        '.scrollbar-thumb-gray': {
          'scrollbar-color': '#888 #F5F5F5', /* Firefox */
        },
        '::-webkit-scrollbar': {
          width: '0.125rem',
        },
        '::-webkit-scrollbar-track': {
          background: '#F5F5F5',
        },
        '::-webkit-scrollbar-thumb': {
          backgroundColor: '#888',
          borderRadius: '1rem',
          borderWidth: '1px',
          borderColor: '#F5F5F5',
        }
      }
      addUtilities(newUtilities, ['responsive', 'hover'])
    },
  ],
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

