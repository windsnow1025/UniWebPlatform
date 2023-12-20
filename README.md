# Full Stack Web

## Introduction

A full stack web application for my personal website containing markdown blogs, a user system, an editable bookmark, a message transmitter and a private gpt.

## Tech Stack

Front End: Create-React-App + MUI

Back End: Node.js Express + Python FastAPI + MySQL + Nginx

## Live Demo

[https://www.windsnow1025.com](https://www.windsnow1025.com)

## Requirements

Logged in as the root user in Debian 11 with a minimum RAM of 4GB.

## Setup

### Docker

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

### Nginx

```bash
cd FullStack-Web/nginx
docker build -t nginx .
```

### Front End - React.js

```bash
cd FullStack-Web/react
docker build -t react .
```

### Back End - Node.js

```bash
cd FullStack-Web/node
docker build -t node .
```

### Back End - Python FastAPI

```bash
cd FullStack-Web/fastapi
docker build -t fastapi .
```

### Back End - MySQL

```bash
cd FullStack-Web/mysql
docker build -t mysql .
```

### Docker Compose

Edit `FullStack-Web/config/docker-compose.yaml`, change environment variables.

Copy `FullStack-Web/config/docker-compose.yaml` to `/root/docker-compose.yaml`.

```bash
docker compose up
```

## Usage

### Test

```bash
curl localhost:81
```
