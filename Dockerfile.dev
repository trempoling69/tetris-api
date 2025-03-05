FROM node:20

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

RUN npm install --save-dev sequelize-cli --legacy-peer-deps

COPY . .

EXPOSE ${DEV_PORT}