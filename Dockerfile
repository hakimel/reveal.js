FROM node:latest

RUN apt-get update \
    && apt-get install git

RUN git clone https://github.com/hakimel/reveal.js.git

WORKDIR reveal.js

RUN npm install

EXPOSE 8000

CMD  npm start -- --port=8000
