FROM node:12.14.0-alpine
RUN apk add --no-cache git

WORKDIR /court-backend
COPY . .
RUN npm install

CMD ["echo", "starting..."]
