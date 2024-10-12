# Commands

## Apply

### Production

```bash
# Secret
kubectl apply -f kubernetes/app-secret.yaml

# MySQL
kubectl apply -f ./kubernetes/mysql/mysql-pvc.yaml
kubectl apply -f ./kubernetes/mysql/mysql-deployment.yaml
kubectl apply -f ./kubernetes/mysql/mysql-service.yaml

# MinIO
kubectl apply -f ./kubernetes/minio/minio-configmap.yaml
kubectl apply -f ./kubernetes/minio/minio-pvc.yaml
kubectl apply -f ./kubernetes/minio/minio-deployment.yaml
kubectl apply -f ./kubernetes/minio/minio-service.yaml

# Nest.js
kubectl apply -f ./kubernetes/nest/nest-configmap.yaml
kubectl apply -f ./kubernetes/nest/nest-deployment.yaml
kubectl apply -f ./kubernetes/nest/nest-service.yaml

# FastAPI
kubectl apply -f ./kubernetes/fastapi/fastapi-configmap.yaml
kubectl apply -f ./kubernetes/fastapi/fastapi-deployment.yaml
kubectl apply -f ./kubernetes/fastapi/fastapi-service.yaml

# Next.js
kubectl apply -f ./kubernetes/next/next-deployment.yaml
kubectl apply -f ./kubernetes/next/next-service.yaml

# Nginx
kubectl apply -f ./kubernetes/nginx/nginx-configmap.yaml
kubectl apply -f ./kubernetes/nginx/nginx-deployment.yaml
kubectl apply -f ./kubernetes/nginx/nginx-service.yaml
```

### Development

```bash
# Secret
kubectl apply -f kubernetes/app-secret.yaml

# MySQL
kubectl apply -f ./kubernetes/mysql/mysql-pvc.yaml
kubectl apply -f ./kubernetes/mysql/mysql-deployment.yaml
kubectl apply -f ./kubernetes/mysql/mysql-service-local.yaml

# MinIO
kubectl apply -f ./kubernetes/minio/minio-configmap.yaml
kubectl apply -f ./kubernetes/minio/minio-pvc.yaml
kubectl apply -f ./kubernetes/minio/minio-deployment.yaml
kubectl apply -f ./kubernetes/minio/minio-service-local.yaml

# Nest.js
kubectl apply -f ./kubernetes/nest/nest-configmap.yaml
kubectl apply -f ./kubernetes/nest/nest-deployment.yaml
kubectl apply -f ./kubernetes/nest/nest-service.yaml

# FastAPI
kubectl apply -f ./kubernetes/fastapi/fastapi-configmap.yaml
kubectl apply -f ./kubernetes/fastapi/fastapi-deployment.yaml
kubectl apply -f ./kubernetes/fastapi/fastapi-service.yaml

# Next.js
kubectl apply -f ./kubernetes/next/next-deployment.yaml
kubectl apply -f ./kubernetes/next/next-service.yaml

# Nginx
kubectl apply -f ./kubernetes/nginx/nginx-configmap.yaml
kubectl apply -f ./kubernetes/nginx/nginx-deployment.yaml
kubectl apply -f ./kubernetes/nginx/nginx-service-local.yaml
```

## Restart

```bash
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
