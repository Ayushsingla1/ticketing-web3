/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage:{
        "Siuu" : "url(https://res.cloudinary.com/dmnjig3al/image/upload/v1726829001/Ticketing%20Project/fshpdifvcgz6kftv1mla.jpg)",
      },
      aspectRatio: {
        '5/3': '5 / 3',
        '4/3': '4 / 3',
        '3/3': '3 / 3',
        '2/3' : '2 / 3',
      },
    },
  },
  plugins: [],
}
