FROM node:alpine

WORKDIR /app
COPY package.json ./
RUN npm install
RUN npm install knex -g
COPY . .

EXPOSE 8000
CMD ../usr/local/bin/knex migrate:latest --env=production; npm run start:prod