FROM node:12.14.0-alpine
RUN apk add --no-cache git

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
RUN chmod +x docker-entrypoint.sh

ENV PORT 8080
ENV METRICS_PORT 8081
EXPOSE 8080
EXPOSE 8081
ENV NODE_ENV production

ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["npm", "start"]