FROM node:alpine

WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .

EXPOSE 8000
CMD ["knex migrate:latest; npm run start:prod"]