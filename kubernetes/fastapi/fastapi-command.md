# Command

## Apply

```bash
kubectl apply -f kubernetes/fastapi/fastapi-configmap.yaml
kubectl apply -f kubernetes/fastapi/fastapi-deployment.yaml
kubectl apply -f kubernetes/fastapi/fastapi-service.yaml
```

## Restart

```bash
kubectl rollout restart deployment fastapi-deployment
```
