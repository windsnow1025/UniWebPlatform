# UniWebPlatform

## Introduction

A full stack web application for my personal website containing:
1. User system
2. Markdown blogs
3. Editable bookmark
4. Message transmitter
5. Password generator
6. Image generator
7. AI chatbot

## Tech Stack

```yaml
Front End
  - Node.js
    - React.js
      - Next.js
        - Tailwind CSS
      - MUI
```

```yaml
Back End
  - Node.js
    - Nest.js
  - Python
    - FastAPI
```

```yaml
Storage
  - MySQL
  - MinIO
```

```yaml
Infrastructure
  - Nginx
  - Docker
    - Docker Compose
  - Linux
    - Debian 11
```

```yaml
DevOps
  - GitHub Actions
```

## Live Demo

[https://www.windsnow1025.com](https://www.windsnow1025.com)

## Setup

### Production

#### Environments

Copy `./env.example` to `./env`, add environment variables to each `.env` files.

Copy `./docker-compose.yaml`, `./env`, `./config` to production folder.

#### Debian install Docker Compose

1. Logged in as the root user in Debian 11 with a minimum RAM of 4GB.
2. Install Docker Compose

```bash
apt-get install ca-certificates curl gnupg
```

```bash
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg
```

```bash
echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

```bash
apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

#### Run

```bash
docker compose up [-d]
```

### Development

#### Windows

1. Setup and run MySQL and MinIO either by native approach or by Docker.
2. Setup and run Next, Nest, FastAPI separately according to their documentations.

#### CI/CD

GitHub >> Repository >> Settings >> Security >> Secrets and variables >> Actions >> Repository secrets: add

- DOCKERHUB_TOKEN
- DOCKERHUB_USERNAME
- SERVER_ADDRESS
- SSH_PRIVATE_KEY

## Usage

### Test Availability

```bash
curl localhost:81
```
