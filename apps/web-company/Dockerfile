FROM node:20-alpine
ARG CACHEBUST=3
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.base.json ./
COPY packages/ ./packages/
COPY apps/web-company/ ./apps/web-company/
RUN npm ci
RUN rm -rf apps/web-company/.next
RUN npm run build --workspace=apps/web-company
EXPOSE 3000
CMD ["npm", "run", "start", "--workspace=apps/web-company"]
