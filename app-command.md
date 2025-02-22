# Commands

## Apply

```bash
# App
kubectl apply -f ./app-configmap.yaml
kubectl apply -f ./app-secret.yaml

# MySQL
kubectl apply -f ./mysql/mysql-pvc.yaml
kubectl apply -f ./mysql/mysql-deployment.yaml
kubectl apply -f ./mysql/mysql-service.yaml

# MinIO
kubectl apply -f ./minio/minio-configmap.yaml
kubectl apply -f ./minio/minio-pvc.yaml
kubectl apply -f ./minio/minio-deployment.yaml
kubectl apply -f ./minio/minio-service.yaml

# Nest.js
kubectl apply -f ./nest/nest-service.yaml

# FastAPI
kubectl apply -f ./fastapi/fastapi-service.yaml

# Next.js
kubectl apply -f ./next/next-service.yaml

# Nginx
kubectl apply -f ./nginx/nginx-configmap.yaml
kubectl apply -f ./nginx/nginx-deployment.yaml
kubectl apply -f ./nginx/nginx-service.yaml
```

### Main

```bash
# Nest
kubectl apply -f ./nest/nest-deployment.yaml

# FastAPI
kubectl apply -f ./fastapi/fastapi-deployment.yaml

# Next
kubectl apply -f ./next/next-deployment.yaml
```

### Test

```bash
# Nest
kubectl apply -f ./nest/nest-deployment-test.yaml

# FastAPI
kubectl apply -f ./fastapi/fastapi-deployment-test.yaml

# Next
kubectl apply -f ./next/next-deployment-test.yaml
```

## Restart

```bash
# Dashboard
kubectl rollout restart deployment -n kubernetes-dashboard

# MySQL
kubectl rollout restart deployment mysql-deployment

# MinIO
kubectl rollout restart deployment minio-deployment

# Nest.js
kubectl rollout restart deployment nest-deployment

# FastAPI
kubectl rollout restart deployment fastapi-deployment

# Next.js
kubectl rollout restart deployment next-deployment

# Nginx
kubectl rollout restart deployment nginx-deployment
```
