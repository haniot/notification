FROM node:10.15.3

# Create app directory
RUN mkdir -p /usr/src/ns
WORKDIR /usr/src/ns

# Install app dependencies
COPY package.json /usr/src/ns/
RUN npm install

# Bundle app source
COPY . /usr/src/ns
RUN npm run build

EXPOSE 7000
EXPOSE 7001

CMD ["npm", "start"]