FROM node:12.14.0-alpine
RUN apk add --no-cache git

WORKDIR /court-backend

COPY . .

# install dependencies
RUN npm install
RUN npx lerna bootstrap

CMD ["echo", "starting..."]
