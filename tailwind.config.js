/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Note the addition of the `app` directory.
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'primary_dark':'#1f1f1f',
        'primary_dark_btns':'#f1f5f9',
        'primary':'#e8e8e8',
        'primary_btns':'#3b82f6'
      },
      keyframes:{
        scaleUp:{
          '0%':{scale:'0'},
          '75%':{scale:'1.1'},
          '100%':{scale:'1'}
        },
        pageIn:{
          '0%':{transform:'translate(0,100%)',opacity:'0'},
          '100%':{transform:'translate(0,0)',opacity:'1'}
        },
        pageOut:{
          '0%':{transform:'translate(0,0%)',opacity:'1'},
          '100%':{transform:'translate(0,100%)',opacity:'0'}
        },
        pageInParagraph:{
          '0%':{transform:'translate(0,100%)'},
          '100%':{transform:'translate(0,0%)'}
        },
        pageOutParagraph:{
          '0%':{transform:'translate(0,0%)'},
          '100%':{transform:'translate(0,100%)'}
        },
        alertPopOut:{
          '0%':{transform:'translate(0,0%)',opacity:'0.7'},
          '100%':{transform:'translate(0,-100%)',opacity:'0'}
        },
      },
      animation:{
        scaleUp:'scaleUp 0.5s ease-in-out 1 forwards',
        pageIn:'pageIn 0.5s ease-in-out 1 forwards',
        pageInParagraph:'pageInParagraph 0.5s ease-out 1 forwards',
        pageOutParagraph:'pageOutParagraph 0.5s ease-out 1 forwards',
        alertPopOut:'alertPopOut 4s ease-out 1 forwards',
      }
    },
  },
  plugins: [],
  darkMode:'class'
}
