FROM node:10-alpine

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app
COPY package-lock.json /app

RUN npm install

COPY . /app

CMD ["npm", "start"]
