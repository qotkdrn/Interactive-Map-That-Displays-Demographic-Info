# Interactive-Map-That-Displays-Demographic-Info
Setup:
1) Have Node.js installed

2) Create folder using vite
   npm create vite@latest <name-of-repository>

3) Select React + JavaScript to create boilerplate

4) Open folder in IDE

5) Assign server port in vite.config.js

6) Install Dependencies
    npm install

7) Run dev server
npm run dev

8) Setup Tailwind CSS

In new terminal...
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

Modify tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

concepts (frontend)
1) integrate third party apis
    google maps api
    census api



things to add:
1) set up mongodb (atlas - online database)
   start with database schema (use mongodb for database, mongoose js wrapper for mongodb)
   define database schema in mongoose js
   define table called history
   table has user id, county id, date
2) hook up express.js to mongoose/mongodb 
   write two apis
     a. records user visit to one county (store user id, county id, timestamp into database)
     b. fetch all county visits for that user id (token as user id)
3) call api from browser
   verify that all api calls work via browser, not frontend
   (steps 2a and 2b)
4) call your api from frontend
   (steps 2a and 2b)
5) don't worry about aws / amplify webapp deployment for now
https://docs.amplify.aws/gen1/javascript/deploy-and-host/frameworks/deploy-vite-site/

Stuff to Do:
Good First Issues
google ads
oppia
- build end to end feature (for behavioral interview, real world experience)
- purpose: learn to collaborate with ppl
- test cases
- Start with Good First Issue OR 'LOW IMPACT'