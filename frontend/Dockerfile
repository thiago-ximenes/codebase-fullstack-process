FROM node:20-alpine

WORKDIR /app

COPY package.json .

RUN npm install

expose 5173

COPY . .

CMD ["npm", "dev"]