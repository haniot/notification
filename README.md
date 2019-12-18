# HANIoT Notification Service
[![License][license-image]][license-url] [![Node][node-image]][node-url] [![Travis][travis-image]][travis-url] [![Coverage][coverage-image]][coverage-url] [![Dependencies][dependencies-image]][dependencies-url] [![DependenciesDev][dependencies-dev-image]][dependencies-dev-url] [![Vulnerabilities][known-vulnerabilities-image]][known-vulnerabilities-url] [![Commit][last-commit-image]][last-commit-url] [![Releases][releases-image]][releases-url] [![Contributors][contributors-image]][contributors-url]  [![Swagger][swagger-image]][swagger-url] 

Service for sending messages: **email**, **sms** or **push**. In this version only the sending of email will be available.

**Main features:**
- Send emails generals;
- Send emails with predefined templates;
- Message Bus Integration (RabbitMQ).
 
 See the [documentation](https://github.com/haniot/notification/wiki) for more information.

## Prerequisites
- [Node 8.0.0+](https://nodejs.org/en/download/)
- [MongoDB Server 3.0.0+](https://www.mongodb.com/download-center/community)
- [RabbitMQ 3.7.0+](https://www.rabbitmq.com/download.html)

---

## Set the environment variables
Application settings are defined by environment variables.. To define the settings, make a copy of the `.env.example` file, naming for `.env`. After that, open and edit the settings as needed. The following environments variables are available:

| VARIABLE | DESCRIPTION  | DEFAULT |
|-----|-----|-----|
| `NODE_ENV` | Defines the environment in which the application runs. You can set: `test` _(in this environment, the database defined in `MONGODB_URI_TEST` is used and the logs are disabled for better visualization of the test output)_, `development` _(in this environment, all log levels are enabled)_ and `production` _(in this environment, only the warning and error logs are enabled)_. | `development` |
| `PORT_HTTP` | Port used to listen for HTTP requests. Any request received on this port is redirected to the HTTPS port. | `7000` |
| `PORT_HTTPS` | Port used to listen for HTTPS requests. Do not forget to provide the private key and the SSL/TLS certificate. See the topic [generate certificates](#generate-certificates). | `7001` |
| `SSL_KEY_PATH` | SSL/TLS certificate private key. | `.certs/server.key` |
| `SSL_CERT_PATH` | SSL/TLS certificate. | `.certs/server.crt` |
| `RABBITMQ_URI` | URI containing the parameters for connection to the message channel RabbitMQ. The [URI specifications ](https://www.rabbitmq.com/uri-spec.html) defined by RabbitMQ are accepted. For example: `amqp://user:pass@host:port/vhost`. | `amqp://guest:guest`<br/>`@127.0.0.1:5672/haniot` |
| `MONGODB_URI` | Database connection URI used if the application is running in development or production environment. The [URI specifications ](https://docs.mongodb.com/manual/reference/connection-string) defined by MongoDB are accepted. For example: `mongodb://user:pass@host:port/database?options`. | `mongodb://127.0.0.1:27017`<br/>`/haniot-notification` |
| `MONGODB_URI_TEST` | Database connection URI used if the application is running in test environment. The [URI specifications ](https://docs.mongodb.com/manual/reference/connection-string) defined by MongoDB are accepted. For example: `mongodb://user:pass@host:port/database?options`. | `mongodb://127.0.0.1:27017`<br/>`/haniot-notification-test` |
| `SMTP_HOST` | SMTP protocol host for sending emails. | `YOUR_SMTP_HOST` |
| `SMTP_PORT` | SMTP port for sending emails. | `587` |
| `SMTP_USER` | User/email who will authenticate to the SMTP host.  | `YOUR_SMTP_USER` |
| `SMTP_PASS` | Password who will authenticate to the SMTP host. | `YOUR_SMTP_PASS` |

## Generate Certificates
For development and testing environments the easiest and fastest way is to generate your own self-signed certificates. These certificates can be used to encrypt data as well as certificates signed by a CA, but users will receive a warning that the certificate is not trusted for their computer or browser. Therefore, self-signed certificates should only be used in non-production environments, that is, development and testing environments. To do this, run the `create-self-signed-certs.sh` script in the root of the repository.

```sh
chmod +x ./create-self-signed-certs.sh
```

```sh
./create-self-signed-certs.sh
```
The following files will be created: `ca.crt`, `jwt.key`, `jwt.key.pub`, `server.crt` and `server.key`.

In production environments its highly recommended to always use valid certificates and provided by a certificate authority (CA). A good option is [Let's Encrypt](https://letsencrypt.org)  which is a CA that provides  free certificates. The service is provided by the Internet Security Research Group (ISRG). The process to obtain the certificate is extremely simple, as it is only required to provide a valid domain and prove control over it. With Let's Encrypt, you do this by using [software](https://certbot.eff.org/) that uses the ACME protocol, which typically runs on your host. If you prefer, you can use the service provided by the [SSL For Free](https://www.sslforfree.com/)  website and follow the walkthrough. The service is free because the certificates are provided by Let's Encrypt, and it makes the process of obtaining the certificates less painful.


## Installation and Execution
#### 1. Install dependencies
```sh  
npm install    
```
 
#### 2. Build
Build the project. The build artifacts will be stored in the `dist/` directory.
```sh  
npm run build    
```

#### 3. Run Server
```sh  
npm start
```
Build the project and initialize the microservice. **Useful for production/deployment.**
```sh  
npm run build && npm start
```
## Running the tests

#### All tests
Run unit testing, integration and coverage by [Mocha](https://mochajs.org/) and [Instanbul](https://istanbul.js.org/).
```sh  
npm test
```

#### Unit test
```sh  
npm run test:unit
```
  
#### Integration test
```sh  
npm run test:integration
```

#### Coverage  test
```sh  
npm run test:cov
```
Navigate to the `coverage` directory and open the `index.html` file in the browser to see the result. Some statistics are also displayed in the terminal.

### Generating code documentation  
```sh  
npm run build:doc
```
The html documentation will be generated in the /docs directory by [typedoc](https://typedoc.org/).

## Using Docker  
In the Docker Hub, you can find the image of the most recent version of this repository. With this image it is easy to create your own containers.
```sh
docker run haniot/notification-service
```
This command will download the latest image and create a container with the default settings.

You can also create the container by passing the settings that are desired by the environment variables. The supported settings are the same as those defined in ["Set the environment variables"](#set-the-environment-variables). See the following example:
```sh
docker run --rm \
  -e PORT_HTTP=8080 \
  -e PORT_HTTPS=8081 \
  -e SSL_KEY_PATH=.certs/server.key \
  -e SSL_CERT_PATH=.certs/server.crt \
  -e RABBITMQ_URI="amqp://guest:guest@192.168.0.1:5672/haniot" \
  -e MONGODB_URI="mongodb://192.168.0.2:27017/haniot-notification" \
  -e SMTP_HOST="SMTP.office365.com" \
  -e SMTP_PORT=587 \  
  -e SMTP_USER="YOUR_SMTP_USER@outlook.com" \    
  -e SMTP_PASS="YOUR_SMTP_PASS" \      
  haniot/notification-service
```
If the MongoDB or RabbitMQ instance is in the host local, add the `--net=host` statement when creating the container, this will cause the docker container to communicate with its local host.
```sh
docker run --rm \
  --net=host \
  -e RABBITMQ_URI="amqp://guest:guest@localhost:5672/haniot" \
  -e MONGODB_URI="mongodb://localhost:27017/haniot-notification" \
  haniot/notification-service
```
To generate your own docker image, run the following command:
```sh
docker build -t image_name:tag .
```

[//]: # (These are reference links used in the body of this note.)
[license-image]: https://img.shields.io/badge/license-Apache%202-blue.svg
[license-url]: https://github.com/haniot/notification/blob/master/LICENSE
[node-image]: https://img.shields.io/badge/node-%3E%3D%208.0.0-brightgreen.svg
[node-url]: https://nodejs.org
[travis-image]: https://travis-ci.org/haniot/notification.svg?branch=master
[travis-url]: https://travis-ci.org/haniot/notification
[coverage-image]: https://coveralls.io/repos/github/haniot/notification/badge.svg
[coverage-url]: https://coveralls.io/github/haniot/notification?branch=master
[known-vulnerabilities-image]: https://snyk.io/test/github/haniot/notification/badge.svg
[known-vulnerabilities-url]: https://snyk.io/test/github/haniot/notification
[dependencies-image]: https://david-dm.org/haniot/notification.svg
[dependencies-url]: https://david-dm.org/haniot/notification
[dependencies-dev-image]: https://david-dm.org/haniot/notification/dev-status.svg
[dependencies-dev-url]: https://david-dm.org/haniot/notification?type=dev
[swagger-image]: https://img.shields.io/badge/swagger-v1-brightgreen.svg
[swagger-url]: https://app.swaggerhub.com/apis-docs/haniot/notification-service/v1
[last-commit-image]: https://img.shields.io/github/last-commit/haniot/notification.svg
[last-commit-url]: https://github.com/haniot/notification/commits
[releases-image]: https://img.shields.io/github/release-date/haniot/notification.svg
[releases-url]: https://github.com/haniot/notification/releases
[contributors-image]: https://img.shields.io/github/contributors/haniot/notification.svg
[contributors-url]: https://github.com/haniot/notification/graphs/contributors
