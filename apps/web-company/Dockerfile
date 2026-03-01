FROM node:20-alpine
ARG CACHEBUST=2

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.base.json ./
COPY packages/ ./packages/
COPY apps/web-company/ ./apps/web-company/

RUN npm ci
RUN npm run build --workspace=apps/web-company

EXPOSE 3000

CMD ["npm", "run", "start", "--workspace=apps/web-company"]
