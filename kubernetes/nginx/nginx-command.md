# Command

```bash
kubectl apply -f kubernetes/nginx/nginx-configmap.yaml
kubectl apply -f kubernetes/nginx/nginx-deployment.yaml
kubectl apply -f kubernetes/nginx/nginx-service.yaml
```

## Port Forward

```bash
kubectl port-forward svc/nginx-service 81:80
```

## Restart

```bash
kubectl rollout restart deployment nginx-deployment
```
