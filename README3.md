
Video: https://youtu.be/Y89Z94jIUfM

All the commands I use: 

minikube start --driver=docker
minikube status

minikube -p minikube docker-env
& minikube -p minikube docker-env --shell powershell | Invoke-Expression
docker build -t luxembourg-population-api .
docker images 

kubectl create deployment luxembourg-population-api --image=luxembourg-population-api --replicas=2
kubectl apply -f deployment.yaml

kubectl get deployments
kubectl get pods

kubectl expose deployment luxembourg-population-api --type=NodePort --port=8000 

kubectl get services
minikube service luxembourg-population-api --url