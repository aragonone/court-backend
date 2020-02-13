FROM node:12.14.0-alpine
RUN apk add --no-cache git

WORKDIR /app
COPY . .
RUN rm -f package-lock.json
RUN rm -Rf node_modules
RUN npm install
# workaround for this: 
RUN ln -s ../../ node_modules/@aragon/court-backend-shared/node_modules

ENV NODE_ENV production
CMD ["npm", "start"]
