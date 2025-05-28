# K3S

## Install K3S

1. Install K3S
   ```bash
   curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="--service-node-port-range=30000-39001 --disable=traefik" sh -
   ```

2. Verify Installation
   ```bash
   sudo k3s kubectl get node
   ```

3. Copy Kubernetes Config
   ```bash
   cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
   ```

## Kubernetes Dashboard

1. Install Dependencies

   ```bash
   apt install gpg
   ```

2. Debian Install Helm
   ```bash
   curl https://baltocdn.com/helm/signing.asc | gpg --dearmor | sudo tee /usr/share/keyrings/helm.gpg > /dev/null
   sudo apt-get install apt-transport-https --yes
   echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/helm.gpg] https://baltocdn.com/helm/stable/debian/ all main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list
   sudo apt-get update
   sudo apt-get install helm
   ```

3. Deploy Dashboard
   ```bash
   # Add kubernetes-dashboard repository
   helm repo add kubernetes-dashboard https://kubernetes.github.io/dashboard/
   # Deploy a Helm Release named "kubernetes-dashboard" using the kubernetes-dashboard chart
   helm upgrade --install kubernetes-dashboard kubernetes-dashboard/kubernetes-dashboard --create-namespace --namespace kubernetes-dashboard
   ```

4. Remote Access (NodePort)

   ```bash
   kubectl apply -f ./dashboard/dashboard-service.yaml
   ```
   Test: `curl -k https://localhost:38443`

5. Create admin-user
   ```bash
   kubectl apply -f ./dashboard/dashboard-serviceaccount.yaml
   kubectl apply -f ./dashboard/dashboard-clusterrolebinding.yaml
   kubectl apply -f ./dashboard/dashboard-secret-public.yaml
   ```

6. Get a long-lived Bearer Token
   ```bash
   kubectl get secret admin-user -n kubernetes-dashboard -o jsonpath={".data.token"} | base64 -d
   ```

## Private Docker Registry (Optional)

1. Create Secret `docker-registry`
   ```bash
   kubectl create secret docker-registry regcred [-n <namespace>] \
     --docker-server=https://index.docker.io/v1/ \
     --docker-username='<docker-username>' \
     --docker-password='<docker-password>' \
     --docker-email='<email>'
   ```
