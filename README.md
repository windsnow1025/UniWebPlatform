# UniWebPlatform

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

### Prepare Environment

1. Copy `./kubernetes/app-secret.example.yaml` to `./kubernetes/app-secret.example.yaml`, modify value for each key.
2. Copy `./kubernetes/dashboard/dashboard-secret.copy.yaml` to `./kubernetes/dashboard/dashboard-secret.yaml`.

### Debian Production

Log in as root user

#### Set Config and Environment

1. Compress `./kubernetes` to `./kubernetes.zip`
2. Upload `./kubernetes.zip`
3. `apt update`
4. `apt install unzip`
5. `upzip kubernetes.zip`
6. `rm kubernetes.zip`

#### Debian Docker Compose

```bash
apt-get update
```

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

1. Download and Install Minikube
    ```bash
    curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
    sudo install minikube-linux-amd64 /usr/local/bin/minikube && rm minikube-linux-amd64
    ```

2. Start Minikube with Docker Driver
    ```bash
    minikube start --force
    ```

3. Create a symlink for `kubectl`
    ```bash
    ln -s $(which minikube) /usr/local/bin/kubectl
    ```

#### Kubernetes Dashboard

1. Debian Install Helm
   ```bash
   curl https://baltocdn.com/helm/signing.asc | gpg --dearmor | sudo tee /usr/share/keyrings/helm.gpg > /dev/null
   sudo apt-get install apt-transport-https --yes
   echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/helm.gpg] https://baltocdn.com/helm/stable/debian/ all main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list
   sudo apt-get update
   sudo apt-get install helm
   ```

2. Deploy Dashboard
   ```bash
   # Add kubernetes-dashboard repository
   helm repo add kubernetes-dashboard https://kubernetes.github.io/dashboard/
   # Deploy a Helm Release named "kubernetes-dashboard" using the kubernetes-dashboard chart
   helm upgrade --install kubernetes-dashboard kubernetes-dashboard/kubernetes-dashboard --create-namespace --namespace kubernetes-dashboard
   ```
   
3. Remote Access (Port Forward)

   ```bash
   kubectl -n kubernetes-dashboard port-forward --address 0.0.0.0 svc/kubernetes-dashboard-kong-proxy 8443:443
   ```
   Visit: `<server_address>:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard-kong-proxy:443/proxy/`

4. Create admin-user
   ```bash
   kubectl apply -f ./kubernetes/dashboard/dashboard-serviceaccount.yaml
   kubectl apply -f ./kubernetes/dashboard/dashboard-clusterrolebinding.yaml
   kubectl apply -f ./kubernetes/dashboard/dashboard-secret.yaml
   ```

5. Get a long-lived Bearer Token
   ```bash
   kubectl get secret admin-user -n kubernetes-dashboard -o jsonpath={".data.token"} | base64 -d
   ```

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
        proxy_pass https://localhost:8443/;

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

#### Start

##### After Server Start

- Start Minikube:
   ```bash
   minikube start --force
   ```

##### Keep Running

- Dashboard
   ```bash
   kubectl -n kubernetes-dashboard port-forward --address 0.0.0.0 svc/kubernetes-dashboard-kong-proxy 8443:443
   ```
- Port Forward: see `./kubernetes/app-command.md`

#### Usage

- Main: `<server_address>:81`
- MinIO: `<server_address>:81/minio/ui/`
- Kubernetes Dashboard Port Forward (HTTPS): `<server_address>:8443`

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
