FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci
RUN npm run build

COPY ./dist ./

EXPOSE 8080
CMD [ "node", "index.js" ]
