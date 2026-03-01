FROM node:20-alpine
RUN apk add --no-cache openssl
WORKDIR /app
COPY package.json package-lock.json tsconfig.base.json ./
COPY packages/ ./packages/
COPY apps/service-onboarding/package.json ./apps/service-onboarding/
RUN npm install --workspace=apps/service-onboarding
COPY apps/service-onboarding/ ./apps/service-onboarding/
WORKDIR /app/apps/service-onboarding
RUN npx prisma generate
RUN npm run build
RUN cp -r src/generated dist/generated
EXPOSE 3002
CMD ["node", "dist/index.js"]
