FROM node:6

RUN npm install -g grunt-cli
RUN mkdir -p /usr/src/app
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN npm install

EXPOSE 8000
ENTRYPOINT ["grunt"]
CMD ["serve"]
