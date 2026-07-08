FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run builder

FROM joseluisq/static-web-server:2
EXPOSE 80
COPY --from=builder /app/dist .

ENTRYPOINT [ "/static-web-server", "-d", "." ]