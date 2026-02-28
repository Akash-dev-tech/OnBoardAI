FROM node:20-alpine

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl openssl-dev

WORKDIR /app

COPY package.json ./
COPY tsconfig.base.json ./
COPY packages/ ./packages/
COPY apps/service-auth/package.json ./apps/service-auth/
COPY apps/service-auth/tsconfig.json ./apps/service-auth/
COPY apps/service-auth/prisma/ ./apps/service-auth/prisma/
COPY apps/service-auth/src/ ./apps/service-auth/src/

RUN npm install

WORKDIR /app/packages/utils
RUN npx tsc || true

WORKDIR /app/apps/service-auth
RUN npx prisma generate
RUN npm run build

EXPOSE 3001

CMD ["node", "dist/index.js"]
