FROM node:16 as build-stage

WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH
COPY package.json package-lock.json /usr/src/app/
RUN npm install
COPY . /usr/src/app
ARG VERSION
RUN npm run build

EXPOSE 8080
COPY --from=build-stage /usr/src/app/dist
ARG VERSION
ENV VERSION="${VERSION}"
