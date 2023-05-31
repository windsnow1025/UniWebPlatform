# Docker

## Dockerfile

Example:

```dockerfile
FROM node:12

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]
```

## Docker Commands

### Build

```bash
docker build -t <username>/<repository> <path>
```

### Run

```bash
docker run -p <host port>:<container port> <username>/<repository>
```

### Status

```bash
docker ps
```

### Push

```bash
docker push <username>/<repository>
```

### Pull

```bash
docker pull <username>/<repository>
```

## Installation

### Debian

[Install Docker Engine on Debian](https://docs.docker.com/engine/install/debian/)

## Docker Compose

### docker-compose.yml

Format:

```yaml
version: '3'

services:
  <service name>:
    image: <username>/<repository>
    ports:
      - "<host port>:<container port>"
    restart: always
    environment:
      - <environment variable>
    volumes:
      - <volume>

volume:
  <volume name>:
```

### Docker Compose Commands

Start:

```bash
docker compose up [-d]
```

Stop:

```bash
docker compose down
```

Pull:

```bash
docker compose pull
```

Logs:

```bash
docker compose logs [-f]
```

### Delete All

1. Stop all containers

```bash
docker stop $(docker ps -aq)
```

2. Delete all containers

```bash
docker rm $(docker ps -aq)
```

3. Delete all images

```bash
docker rmi $(docker images -q)
```

4. Delete all volumes

```bash
docker volume rm $(docker volume ls -q)
```
