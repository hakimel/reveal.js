FROM node:7

ADD package.json /tmp/package.json
RUN cd /tmp && npm install && npm install -g grunt-cli
RUN mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app/

WORKDIR /opt/app
COPY . /opt/app

EXPOSE 8000
ENTRYPOINT ["grunt"]
CMD ["serve"]
