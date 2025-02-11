FROM node:18-alpine

WORKDIR /app

# העתקת package.json להתקנה מהירה של התלויות
COPY package.json ./

RUN npm install

# העתקת שאר הקבצים
COPY . .

# בניית האפליקציה למצב פרודקשן (אם צריך)
RUN npm run build

# הצגת הפורט שבו האפליקציה תאזין
EXPOSE 3000

# הפעלת האפליקציה במצב פרודקשן
CMD ["npm", "run", "start"]
