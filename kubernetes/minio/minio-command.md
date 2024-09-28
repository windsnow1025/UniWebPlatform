# Command

## Apply

```bash
kubectl apply -f kubernetes/minio/minio-configmap.yaml
kubectl apply -f kubernetes/minio/minio-pvc.yaml
kubectl apply -f kubernetes/minio/minio-deployment.yaml
kubectl apply -f kubernetes/minio/minio-service.yaml
```

## Port Forwarding

```bash
kubectl port-forward svc/minio-service 9000:9000 9001:9001
```

## Restart

```bash
kubectl rollout restart deployment minio-deployment
```
