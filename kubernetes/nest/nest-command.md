# Command

## Apply

```bash
kubectl apply -f kubernetes/nest/nest-configmap.yaml
kubectl apply -f kubernetes/nest/nest-deployment.yaml
kubectl apply -f kubernetes/nest/nest-service.yaml
```

## Restart

```bash
kubectl rollout restart deployment nest-deployment
```
