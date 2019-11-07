# Build the HTML & JS
FROM node:10.16.3-alpine as baseNode
RUN mkdir /home/build
COPY package*.json /home/build/
RUN cd /home/build && npm install
COPY webpack.prod.js webpack.common.js src/index.prod.html /home/build/
COPY tsconfig.json /home/build/
COPY src /home/build/src
COPY setupProxy.js /home/build/
RUN cd /home/build && npm run build --verbose
EXPOSE 3000
CMD ["node", "/home/build/setupProxy.js"]



