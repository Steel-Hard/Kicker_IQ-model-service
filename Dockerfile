FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json tsconfig.json ./

COPY src ./src

RUN npm install

RUN npm run build

FROM node:20-alpine AS production

WORKDIR /app

COPY --from=builder /app/out ./out

COPY package.json ./

# Remover caso não tenha o .env
COPY .env ./

RUN npm install --omit=dev

EXPOSE 3000

CMD ["node", "out/index.js"]