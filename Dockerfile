FROM node:latest as node

ARG ENV=prod
ARG APP=frontend-modeling

ENV ENV ${ENV}
ENV APP ${APP}

WORKDIR /app
COPY ./ /app/

# Instala y construye el Angular App
RUN npm install --no-optional --no-shrinkwrap --no-package-lock
RUN npm run build --prod
RUN mv /app/dist/${APP}/* /app/dist/

# Angular app construida, la vamos a hostear un server production, este es Nginx

FROM nginx:1.13.8-alpine
#Solo en debug
#RUN apk update
#RUN apk upgrade
#RUN apk add bash

COPY --from=node /app/dist/ /usr/share/nginx/html
#RUN npm run start
COPY ./nginx.conf /etc/nginx/conf.d/default.conf