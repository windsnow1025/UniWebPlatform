FROM node:21

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --only=production

COPY . .

RUN npm run build

ENV NODE_ENV production

EXPOSE 3000

CMD ["npm", "start"]