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
5. `unzip kubernetes.zip`
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

1. Install dependencies to run minikube with none driver
   - Install conntrack
   ```bash
   apt install conntrack
   ```
   
   - Install crictl
   ```bash
   VERSION="v1.30.0" # check latest version in /releases page
   wget https://github.com/kubernetes-sigs/cri-tools/releases/download/$VERSION/crictl-$VERSION-linux-amd64.tar.gz
   sudo tar zxvf crictl-$VERSION-linux-amd64.tar.gz -C /usr/local/bin
   rm -f crictl-$VERSION-linux-amd64.tar.gz
   ```
   
   - Install cri-dockerd
   ```bash
   VERSION="0.3.15"
   wget https://github.com/Mirantis/cri-dockerd/releases/download/v$VERSION/cri-dockerd-$VERSION.amd64.tgz
   tar xvf cri-dockerd-$VERSION.amd64.tgz
   mv cri-dockerd/cri-dockerd /usr/local/bin/
   rm -rf cri-dockerd-$VERSION.amd64.tgz cri-dockerd
   ```
   
   ```bash
   wget https://raw.githubusercontent.com/Mirantis/cri-dockerd/master/packaging/systemd/cri-docker.service
   wget https://raw.githubusercontent.com/Mirantis/cri-dockerd/master/packaging/systemd/cri-docker.socket
   sudo mv cri-docker.socket cri-docker.service /etc/systemd/system/
   sudo sed -i -e 's,/usr/bin/cri-dockerd,/usr/local/bin/cri-dockerd,' /etc/systemd/system/cri-docker.service

   systemctl daemon-reload
   systemctl enable cri-docker.service
   systemctl enable --now cri-docker.socket
   ```
   
   ```bash
   systemctl status cri-docker.socket
   ```
   
   - Install kubeadm
   ```bash
   sudo apt-get update
   # apt-transport-https may be a dummy package; if so, you can skip that package
   sudo apt-get install -y apt-transport-https ca-certificates curl gpg
   ```
   
   ```bash
   # If the directory `/etc/apt/keyrings` does not exist, it should be created before the curl command, read the note below.
   # sudo mkdir -p -m 755 /etc/apt/keyrings
   curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.31/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
   ```
   
   ```bash
   # This overwrites any existing configuration in /etc/apt/sources.list.d/kubernetes.list
   echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.31/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list
   ```
   
   ```bash
   sudo apt-get update
   sudo apt-get install -y kubelet kubeadm kubectl
   sudo apt-mark hold kubelet kubeadm kubectl
   ```
   
   ```bash
   sudo systemctl enable --now kubelet
   ```

2. Download and Install Minikube
    ```bash
    curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
    sudo install minikube-linux-amd64 /usr/local/bin/minikube && rm minikube-linux-amd64
    ```

3. Start Minikube with none driver
    ```bash
    minikube start --driver=none --extra-config=apiserver.service-node-port-range=30000-38443
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
   
3. Remote Access (NodePort)

   ```bash
   kubectl apply -f ./kubernetes/dashboard/dashboard-service.yaml
   ```
   Test: `curl -k https://localhost:38443`

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

#### Start

##### After Server Start

- Start Minikube:
   ```bash
   minikube start --driver=None
   ```

#### Usage

- Main: `http://localhost:30080/`
- MinIO: `http://localhost:30080/minio/ui/`
- Kubernetes Dashboard: `https://localhost:38443/`

### Development

#### Windows Develop Environment

1. Setup and run MySQL and MinIO natively / by Docker / by Minikube.
2. Setup and run Next, Nest, FastAPI separately according to their documentations.

#### Windows Production Environment

1. Install and run Minikube with default docker driver
2. `minikube service [-n <namespace>] <service_name>`

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
