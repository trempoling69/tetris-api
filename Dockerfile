FROM public.ecr.aws/docker/library/node:20

WORKDIR /app

COPY package*.json ./

RUN npm ci

RUN npm install --save-dev sequelize-cli

COPY . .

RUN npm run build

EXPOSE ${DEV_PORT}

CMD [ "npm", "run", "start:prod" ]