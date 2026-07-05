FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

RUN npm run seed

EXPOSE 3001
CMD ["npm", "run", "start"]
