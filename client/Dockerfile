# Stage 1: Build React App
FROM node:16-alpine AS build

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

# Stage 2: Serve with Caddy
FROM caddy:latest

COPY --from=build /app/build /usr/share/caddy
COPY Caddyfile /etc/caddy/Caddyfile
