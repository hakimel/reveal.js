FROM node:argon

RUN mkdir -p /usr/src/app

COPY package.json /usr/src/app
COPY Gruntfile.js /usr/src/app
COPY *.html /usr/src/app
COPY plugin /usr/src/app/plugin
COPY css /usr/src/app/css
COPY js /usr/src/app/js
COPY lib /usr/src/app/lib

WORKDIR /usr/src/app

RUN npm install
RUN npm install -g grunt-cli

EXPOSE 8000 1948
