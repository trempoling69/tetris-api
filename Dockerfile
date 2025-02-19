FROM node:20

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm install

RUN npm install --save-dev sequelize-cli

COPY . .

EXPOSE ${DEV_PORT}