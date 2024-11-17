/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    "./src/*.{html,js,jsx}",
    "./src/components/*.{html,js,jsx}",
    "./src/components/*/*.{html,js,jsx}"
  ],
  theme: {
    extend: {
      width: {            // カスタムの幅を追加（w-1 あたり 0.25rem）
        '46': '11.5rem',
        '53': '13.25rem',
        '54': '13.50rem',
        '61': '15.25rem',
      },
      margin: {
        '8.5': '2.125rem',
      },
      userSelect: {
        none: 'none',
      },
      animation: {
        slideIn: 'slideIn 0.3s ease-out forwards',
        slideOut: 'slideOut 0.3s ease-out forwards',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateY(-120%)' },
          '100%': { transform: 'translateY(0)' },
        },
        slideOut: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-120%)' },
        },
      },
    }
  },
  variants: {
    userSelect: ['responsive', 'hover', 'focus'],
  },
  safelist: [
    'bg-red-100', 
    'bg-yellow-100', 
    'bg-fuchsia-100', 
    'bg-green-100', 
    'bg-amber-100', 
    'bg-cyan-100', 
    'bg-indigo-100', 
    'border-b-slate-500',
    'p-3',
    'w-6',
    'text-gray-400',
    // 使用するすべてのクラスをリスト化
  ],
}

