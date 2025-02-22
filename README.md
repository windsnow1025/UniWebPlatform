# UniWebPlatform

## Introduction

A full stack web application for my personal website containing:
1. AI Chat
2. Markdown Blogs
3. Editable Bookmark
4. Password Generator
5. Image Generator

## Tech Stack

```yaml
Front End
  - Node.JS
    - React.JS
      - Next.JS
      - Tailwind CSS
      - MUI
```

```yaml
Back End
  - Node.JS
    - Nest.JS
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
  - Linux (Debian 12)
    - Kubernetes (K3S)
```

```yaml
DevOps
  - GitHub Actions
```

## Live Demo

[https://www.windsnow1025.com](https://www.windsnow1025.com)

## Setup

### Prepare Environment

1. Copy `./app-secret.example.yaml` to `./app-secret.example.yaml`, modify value for each key.

### Debian Production

Log in as root user

#### Set Config and Environment

1. Compress `./kubernetes` to `./kubernetes.zip`
2. Run
   ```bash
   mkdir /root/kubernetes
   ```
3. Upload `./kubernetes.zip` to `/root/kubernetes/`
4. Run
   ```bash
   apt update
   apt install unzip
   ```
   ```bash
   cd /root/kubernetes
   unzip kubernetes.zip
   rm kubernetes.zip
   mv kubernetes UniWebPlatform
   ```

#### K3S Installation and Configuration

See `./K3S.md`

#### Apply Custom Configs

See `./app-command.md`

#### Nginx (Optional)

HTTP Block:

```
server {

	server_name <domain_name>;

	client_max_body_size 100M;

    location / {
        proxy_pass http://localhost:30080/;
        
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
        proxy_pass https://localhost:38443/;

        proxy_ssl_verify off;

        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Port $server_port;
        proxy_set_header X-Forwarded-Host $host;
    }
}
```

Stream Block:

```
stream {
    server {
        listen 3306;
        proxy_pass localhost:33306;
    }
}
```

#### Usage

- Main: `http://localhost:30080/`
- MinIO: `http://localhost:30080/minio/ui/`
- Kubernetes Dashboard: `https://localhost:38443/`

### Development

#### Windows Develop Environment

1. Setup and run MySQL and MinIO natively / by Docker / by K3S.
2. Setup and run Next, Nest, FastAPI separately by JetBrains IDE according to their documentations.

#### Windows Production Environment

1. Install WSL2 Debian
2. Enable systemd
   1. Edit config
      ```bash
       vi /etc/wsl.conf
      ```
   2. Add
      ```conf
      [boot]
      systemd=true
      ```
   3. Restart WSL2
      ```bash
      wsl --shutdown
      ```
   4. *Check WSL2 IP
      ```bash
      ip addr show eth0 | grep -oP '(?<=inet\s)\d+(\.\d+){3}'
      ```
3. Follow the Debian Production steps

#### CI/CD

GitHub >> Repository >> Settings >> Security >> Secrets and variables >> Actions >> Repository secrets: add

- DOCKERHUB_TOKEN
- DOCKERHUB_USERNAME

## Make Contributions

Step 1,2,3 should be done by contributors; Step 4,5 should be done by repo owner.

1. Create a new branch based on `main`
2. Commit to the new branch
3. Open a pull request from the new branch
4. Merge the pull request, wait for automatic test to pass and docker push to finish
5. Restart Deployment in Kubernetes Dashboard
