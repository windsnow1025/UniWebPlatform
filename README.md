# Full Stack Web

## Introduction

A full stack web application for my personal website containing markdown blogs, a user system, an editable bookmark, a message transmitter and a private gpt.

## Tech Stack

Front End: Node.js Create-React-App + MUI

Back End: Node.js Express + Python FastAPI

Storage: MySQL

Infrastructure: Nginx

## Live Demo

[https://www.windsnow1025.com](https://www.windsnow1025.com)

## Setup

### Production

#### Requirements

##### Linux

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

##### Windows

Docker Desktop

#### Build

##### Nginx

```bash
cd FullStack-Web/nginx
docker build -t nginx .
```

##### React.js

```bash
cd FullStack-Web/react
docker build -t react .
```

##### Node.js

```bash
cd FullStack-Web/node
docker build -t node .
```

##### Python FastAPI

```bash
cd FullStack-Web/fastapi
docker build -t fastapi .
```

##### MySQL

```bash
cd FullStack-Web/mysql
docker build -t mysql .
```

##### Run

Edit `FullStack-Web/config/docker-compose.yaml`, change environment variables.

Copy `FullStack-Web/config/docker-compose.yaml` to `/root/docker-compose.yaml`.

```bash
docker compose up [-d]
```

### Development

Windows

Manually setup and run React, Node, FastAPI separately according to their documentations.

## Usage

### Test

```bash
curl localhost:81
```
