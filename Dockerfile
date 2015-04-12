FROM node

COPY package.json /code/

WORKDIR /code

RUN npm install -g grunt-cli && \
    npm install

CMD grunt serve
