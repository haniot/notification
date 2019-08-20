FROM node:10.16.3

# Create app directory
RUN mkdir -p /usr/src/ns
WORKDIR /usr/src/ns

# Install app dependencies
COPY package.json /usr/src/ns/
RUN npm install

# Copy app source
COPY . /usr/src/ns

# Create self-signed certificates
RUN chmod +x ./create-self-signed-certs.sh
RUN ./create-self-signed-certs.sh

# Build app
RUN npm run build

EXPOSE 7000
EXPOSE 7001

CMD ["npm", "start"]
