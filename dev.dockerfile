FROM node:14-alpine

WORKDIR /usr/src

COPY package*.json ./

RUN npm i

COPY . .

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.7.3/wait /wait
RUN chmod +x /wait

CMD /wait && npm run start:dev