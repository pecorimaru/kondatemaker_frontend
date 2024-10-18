/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/*.{html,js,jsx}",
    "./src/components/*.{html,js,jsx}",
    "./src/components/*/*.{html,js,jsx}"
  ],
  theme: {
    extend: {
      width: {
        '53': '13.25rem', // カスタムの幅を追加（56: 14rem, 60: 15remの中間）
      },
      userSelect: {
        none: 'none',
      },
    }
  },
  variants: {
    userSelect: ['responsive', 'hover', 'focus'],
  },
  purge: {
    options: {
      safelist: [
        'bg-red-200', 
        'bg-yellow-100', 
        'bg-fuchsia-100', 
        'bg-green-100', 
        'bg-amber-100', 
        'bg-cyan-100', 
        'bg-indigo-200', 
        // 使用するすべてのクラスをリスト化
      ],
    },
  },
}

