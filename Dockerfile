FROM node:12.14.0-alpine
RUN apk add --no-cache git

WORKDIR /celeste-backend

# copy root package and lerna json files
COPY ./package.json /celeste-backend/package.json
COPY ./lerna.json /celeste-backend/lerna.json

# copy app package json
RUN mkdir -p /packages/app
COPY ./packages/app/package.json /celeste-backend/packages/app/package.json

# copy server package json
RUN mkdir -p /packages/server
COPY ./packages/server/package.json /celeste-backend/packages/server/package.json

# copy services package json
RUN mkdir -p /packages/services
COPY ./packages/services/package.json /celeste-backend/packages/services/package.json

# copy shared package json
RUN mkdir -p /packages/shared
COPY ./packages/shared/package.json /celeste-backend/packages/shared/package.json

# install dependencies
COPY ./yarn.lock /celeste-backend/yarn.lock
RUN yarn install
RUN yarn lerna link

COPY . .

CMD echo specify one of the package.json scripts in command line
