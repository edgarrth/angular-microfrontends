FROM node:22-alpine AS build
WORKDIR /workspace
COPY package*.json angular.json tsconfig.json ./
COPY projects ./projects
RUN npm ci
ARG APP_NAME=shell
RUN npx ng build shared --configuration production && npx ng build ${APP_NAME} --configuration production

FROM nginx:1.27-alpine AS runtime
ARG APP_NAME=shell
COPY infrastructure/nginx/spa.conf /etc/nginx/conf.d/default.conf
COPY --from=build /workspace/dist/${APP_NAME}/browser /usr/share/nginx/html
EXPOSE 80
