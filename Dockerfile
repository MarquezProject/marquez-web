# Build the HTML & JS
FROM node:10.16.3-alpine as baseNode
RUN mkdir /home/build
COPY package*.json /home/build/
RUN cd /home/build && npm install
COPY webpack.prod.js webpack.common.js src/index.prod.html /home/build/
COPY tsconfig.json /home/build/
COPY src /home/build/src
EXPOSE 3000 
# ^ Is this necessary? I don't think so
RUN cd /home/build && npm run build --verbose

# Serve the HTML & JS
FROM nginx:alpine as release
LABEL stage=release
EXPOSE 80
COPY --from=baseNode /home/build/dist/ /usr/share/nginx/html