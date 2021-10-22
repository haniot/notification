FROM node:14-alpine
RUN apk --no-cache add bash curl grep tzdata

# Create app directory
RUN mkdir -p /usr/src/ns
WORKDIR /usr/src/ns

# Install app dependencies
COPY package.json package-lock.json /usr/src/ns/
RUN npm install

# Copy app source
COPY . /usr/src/ns

# Build app
RUN npm run build

EXPOSE 7000
EXPOSE 7001

CMD ["npm", "start"]
