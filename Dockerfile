FROM node:10.16.3-alpine as baseNode

RUN mkdir /home/build

COPY package*.json /home/build/

RUN cd /home/build && npm install

COPY webpack.prod.js webpack.common.js src/index.prod.html /home/build/
COPY tsconfig.json /home/build/
COPY src /home/build/src
EXPOSE 3000
RUN cd /home/build && npm run build --verbose

# original Dockerfile

# FROM node:8
# WORKDIR /usr/src/app
# COPY package*.json ./
# RUN npm install
# COPY . .
# EXPOSE 3000
# CMD ["npm", "start"]
