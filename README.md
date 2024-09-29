# UniWebPlatform

## Table of Contents

1. [Introduction](#introduction)
2. [Tech Stack](#tech-stack)
3. [Live Demo](#live-demo)
4. [Setup](#setup)
    - [Environment](#environment)
    - [Debian Production](#debian-production)
        - [Debian Docker Compose](#debian-docker-compose)
        - [Linux Minikube](#linux-minikube)
        - [Minikube Dashboard](#minikube-dashboard)
        - [Start](#start)
        - [Nginx (Optional)](#nginx-optional)
        - [Usage](#usage)
    - [Development](#development)
        - [Windows Develop Environment](#windows-develop-environment)
        - [Windows Production Environment](#windows-production-environment)
    - [CI/CD](#cicd)
5. [Make Contributions](#make-contributions)

## Introduction

A full stack web application for my personal website containing:
1. User Module
2. Markdown Blogs
3. Editable Bookmark
4. Message Transmitter
5. Password Generator
6. Image Generator
7. Advanced AI Chat / Simple AI Chat

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
  - Linux (Debian 11)
    - Docker Compose
    - Kubernetes
      - Docker
```

```yaml
DevOps
  - GitHub Actions
```

## Live Demo

[https://www.windsnow1025.com](https://www.windsnow1025.com)

## Setup

### Environment

1. Copy `./kubernetes/app-secret.example.yaml` to `./kubernetes/app-secret.example.yaml`, modify value for each key.

### Debian Production

#### Debian Docker Compose

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

#### Linux Minikube

```bash
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube && rm minikube-linux-amd64
```

```bash
minikube start --force
```

```bash
ln -s $(which minikube) /usr/local/bin/kubectl
```

#### Minikube Dashboard

```bash
minikube dashboard
```

```bash
kubectl proxy --address 0.0.0.0 --accept-hosts='^.*$'
```

#### Start

1. Create a production directory and cd into it
2. Paste `./kubernetes`

#### Nginx (Optional)

```
server {

	server_name <domain_name>;

	client_max_body_size 100M;

    location / {
        proxy_pass http://localhost:81/;
        proxy_buffering off;
        proxy_request_buffering off;

        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Port $server_port;
        proxy_set_header X-Forwarded-Host $host;

        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    location /kubernetes/ {
        proxy_pass http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/http:kubernetes-dashboard:/proxy/;
    }
}
```

#### After Server Start

```bash
minikube start --force
```

#### Keep Running

```bash
minikube dashboard
```

```bash
kubectl proxy --address 0.0.0.0 --accept-hosts='^.*$'
```

#### Usage

- Main: `<server_address>:81`
- MinIO: `<server_address>:81/minio/ui/`
- MiniKube: `<server_address>:8001/api/v1/namespaces/kubernetes-dashboard/services/http:kubernetes-dashboard:/proxy/`

### Development

#### Windows Develop Environment

1. Setup and run MySQL and MinIO natively / by Docker / by Minikube.
2. Setup and run Next, Nest, FastAPI separately according to their documentations.

#### Windows Production Environment

1. Install Docker Desktop
2. `docker compose pull`, `docker compose up`

#### CI/CD

GitHub >> Repository >> Settings >> Security >> Secrets and variables >> Actions >> Repository secrets: add

- DOCKERHUB_TOKEN
- DOCKERHUB_USERNAME
- SERVER_ADDRESS
- SSH_PRIVATE_KEY

## Make Contributions

Step 1,2,3 should be done by contributors; Step 4,5 should be done by repo owner.

1. Create a new branch based on `main`
2. Commit to the new branch
3. Open a pull request from the new branch
4. Merge the pull request, wait for automatic test to pass and docker push to finish
5. Dispatch workflow for automatic deployment
