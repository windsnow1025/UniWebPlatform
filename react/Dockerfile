FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./

ENV NODE_ENV=production

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]