FROM node:12.1

WORKDIR /usr/src/app

COPY package.json ./
RUN npm install
COPY index.js ./
COPY .env ./
COPY ./exemplos /usr/src/app/exemplos

CMD node index.js
