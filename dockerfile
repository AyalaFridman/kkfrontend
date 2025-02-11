# FROM node:18-alpine

# WORKDIR /app

# COPY package.json ./

# RUN npm install

# COPY . .

# # --host
# CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# השתמש בתמונה של Node.js (18, Alpine) שהיא קלה וכוללת את Node.js
FROM node:20-alpine

# הגדרת ספריית העבודה
WORKDIR /app

# העתקת קובץ package.json וקובץ package-lock.json (אם קיים)
COPY package.json package-lock.json ./

# התקנת התלויות
RUN npm install

# העתקת כל שאר הקבצים
COPY . .

# חשיפת הפורט שבו Vite מאזין (ברירת המחדל היא 5173)
EXPOSE 5173

# הפעלת האפליקציה במצב פיתוח
CMD ["npm", "run", "dev"]
