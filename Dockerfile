FROM public.ecr.aws/docker/library/node:20

WORKDIR /app

COPY package*.json ./

RUN npm ci --legacy-peer-deps

RUN npm install --save-dev sequelize-cli --legacy-peer-deps

COPY . .

RUN npm run build

EXPOSE ${DEV_PORT}

CMD [ "npm", "run", "start:prod" ]