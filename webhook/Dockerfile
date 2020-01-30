FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY . ./

ENV NODE_ENV=production

CMD ["node", "/app/dist/index.js"]

