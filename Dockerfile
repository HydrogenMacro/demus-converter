FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

FROM joseluisq/static-web-server:2
EXPOSE 80
COPY --from=builder /app/dist /app

ENTRYPOINT [ "/static-web-server", "--root", "/app"]
