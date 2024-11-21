# Stage 1: Build React App
FROM node:16-alpine AS build

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

# 환경 변수 복사
COPY .env.production .env
COPY . .

RUN yarn build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
