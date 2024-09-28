/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/*.{html,js,jsx}",
    "./src/components/*.{html,js,jsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
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

