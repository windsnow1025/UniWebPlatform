# Command

## Apply

```bash
kubectl apply -f kubernetes/next/next-deployment.yaml
kubectl apply -f kubernetes/next/next-service.yaml
```

## Restart

```bash
kubectl rollout restart deployment next-deployment
```
