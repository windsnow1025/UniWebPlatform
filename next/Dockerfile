FROM node:21

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --only=production
RUN npm install -g serve

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]