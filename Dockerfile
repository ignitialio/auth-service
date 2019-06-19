FROM node:12-alpine

RUN mkdir -p /opt && mkdir -p /opt/auth

ADD . /opt/auth

WORKDIR /opt/auth

RUN mv vue.config.js.prod vue.config.js

RUN npm install && npm run client:build

CMD ["npm", "run", "server:start"]
