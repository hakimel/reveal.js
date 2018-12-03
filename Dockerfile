FROM library/node:10-alpine

RUN mkdir /data
WORKDIR /data

ENV PATH="/data/node_modules_grunt-cli/bin:${PATH}"
COPY package.json /data/package.json
RUN npm install --devDependencies

COPY . /data/

CMD ./bin_wrapper.sh
