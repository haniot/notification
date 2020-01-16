FROM node:12.13.1

# Create app directory
RUN mkdir -p /usr/src/ns
WORKDIR /usr/src/ns

# Install app dependencies
COPY package.json /usr/src/ns/
RUN npm install

# Copy app source
COPY . /usr/src/ns

# Build app
RUN npm run build

EXPOSE 7000
EXPOSE 7001

CMD ["npm", "start"]
