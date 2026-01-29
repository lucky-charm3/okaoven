/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'navy-dark': '#020617',    
        'navy-muted': '#0f172a',   
        'lemon': '#fef08a',        
        'lemon-dim': '#facc15',    
        'off-white': '#f8fafc'     
      }
    },
  },
  plugins: [],
}