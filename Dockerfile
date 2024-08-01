FROM node:14-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npx browserslist@latest --update-db
COPY ./ .

ARG STATE=production

RUN npm run build -- --mode $STATE

FROM nginx as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf
