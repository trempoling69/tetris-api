FROM node:20

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE ${DEV_PORT}

CMD ["npm", "run", "start:dev"]