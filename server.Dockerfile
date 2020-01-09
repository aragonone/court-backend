FROM node:12.14.0-alpine
RUN apk add --no-cache git

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npx lerna bootstrap --scope @aragon/court-backend-server --include-dependencies
WORKDIR packages/server
RUN npm run build

ENV PORT 8080
ENV METRICS_PORT 8081
EXPOSE 8080
EXPOSE 8081
ENV NODE_ENV production
CMD ["npm", "start"]
