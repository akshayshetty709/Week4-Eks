# 🚀 Three-Tier DevOps Project (EKS + GitHub Actions + Monitoring)

## 📌 Overview

This project demonstrates a **production-style 3-tier application** deployed on Kubernetes with a complete **CI/CD pipeline and monitoring stack**.

### 🔹 Tech Stack

* **Frontend**: React + NGINX
* **Backend**: Node.js (Express)
* **Database**: MongoDB
* **Containerization**: Docker
* **CI/CD**: GitHub Actions
* **Registry**: AWS ECR
* **Orchestration**: AWS EKS (Kubernetes)
* **Monitoring**: Prometheus + Grafana
* **Alerting**: AlertManager (Email)

---

## 🏗️ Architecture

```
User (Browser)
     ↓
Frontend (React + NGINX)
     ↓
Backend (Node.js API)
     ↓
MongoDB (Database)

CI/CD:
GitHub → GitHub Actions → Docker → ECR → EKS

Monitoring:
Prometheus → Grafana → AlertManager → Email Alerts
```

---

## 📁 Repository Structure

```
three-tier-devops-project/
│
├── frontend/                # React application + NGINX config
├── backend/                # Node.js API
├── k8s/                    # Kubernetes manifests
├── monitoring/             # Monitoring setup (Prometheus, Grafana)
├── .github/workflows/      # CI/CD pipeline
└── README.md
```

---

## ⚙️ Prerequisites

Make sure you have installed:

* AWS CLI (configured)
* Docker
* kubectl
* eksctl
* Helm

---

## 🚀 Setup & Deployment

### 1️⃣ Create EKS Cluster

```
eksctl create cluster --name my-cluster --region ap-south-1
```

---

### 2️⃣ Create ECR Repositories

```
aws ecr create-repository --repository-name backend
aws ecr create-repository --repository-name frontend
```

---

### 3️⃣ Configure GitHub Secrets

Go to: **GitHub → Settings → Secrets → Actions**

Add:

```
AWS_ACCESS_KEY
AWS_SECRET_KEY
ECR_URL
```

---

### 4️⃣ Update Kubernetes Image Names

Replace:

```
<ECR_BACKEND_IMAGE>
<ECR_FRONTEND_IMAGE>
```

Example:

```
123456789.dkr.ecr.ap-south-1.amazonaws.com/backend:latest
```

---

### 5️⃣ Push Code to GitHub

```
git add .
git commit -m "Initial commit"
git push origin main
```

👉 This triggers the CI/CD pipeline automatically.

---

## 🔄 CI/CD Pipeline Flow

1. Code pushed to GitHub
2. GitHub Actions triggered
3. Docker images built
4. Images pushed to ECR
5. Deployment applied to EKS

---

## 🌐 Access Application

```
kubectl get svc -n three-tier
```

Copy the **EXTERNAL-IP** of frontend service and open in browser.

---

# 📊 MONITORING SETUP (STEP-BY-STEP)

🔹 Step 1: Add Helm Repository
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

✔ This downloads official charts for:

Prometheus
Grafana
AlertManager
🔹 Step 2: Install kube-prometheus-stack
helm install monitoring prometheus-community/kube-prometheus-stack

👉 This creates everything automatically:

Prometheus server
Grafana dashboard
AlertManager
Node Exporter
kube-state-metrics
🔹 Step 3: Verify Installation
kubectl get pods

✔ You should see:

monitoring-grafana
monitoring-kube-prometheus-prometheus
monitoring-kube-prometheus-alertmanager
monitoring-node-exporter

👉 If pods are not Running, fix before proceeding.

🔹 Step 4: Access Grafana Dashboard
kubectl port-forward svc/monitoring-grafana 3000:80

Open in browser:

http://localhost:3000
🔐 Login Credentials:
Username: admin
Password: prom-operator
🔹 Step 5: Verify Prometheus Connection

Inside Grafana:

👉 Go to:

Settings → Data Sources → Prometheus

✔ Should already be configured
✔ URL:

http://monitoring-kube-prometheus-prometheus
🔹 Step 6: Import Dashboards (IMPORTANT)

Go to:

Dashboards → Import

Use these IDs:

Dashboard	ID
Kubernetes Cluster	315
Node Exporter	1860
Kubernetes Pods	6417
🔥 Step 7: Monitor YOUR Application (CRITICAL PART)

By default:
👉 Only cluster metrics are visible
👉 Your app metrics are NOT included yet

✅ Option 1: Basic Monitoring (No code change)

Filter by namespace:

namespace = three-tier

You’ll see:

Pod CPU usage
Memory usage
Pod restarts
🚀 Option 2: Advanced (REAL-TIME APP METRICS)
🔹 Step 7.1: Install metrics library in backend
npm install prom-client
🔹 Step 7.2: Update backend code

Add in app.js:

const client = require("prom-client");

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});
🔹 Step 7.3: Enable Prometheus scraping

Update backend deployment:

metadata:
  annotations:
    prometheus.io/scrape: "true"
    prometheus.io/port: "3000"
    prometheus.io/path: "/metrics"

✔ Now Prometheus collects:

Request count
Response time
Custom metrics
📧 Step 8: EMAIL ALERTING (REAL SETUP)
🔹 Step 8.1: Edit AlertManager config
kubectl edit secret alertmanager-monitoring-kube-prometheus-alertmanager
🔹 Add email configuration:
receivers:
- name: email-alert
  email_configs:
  - to: "your-email@gmail.com"
    from: "your-email@gmail.com"
    smarthost: smtp.gmail.com:587
    auth_username: "your-email@gmail.com"
    auth_password: "your-app-password"
🔹 Step 8.2: Create Alert Rule
groups:
- name: app-alerts
  rules:
  - alert: HighCPUUsage
    expr: sum(rate(container_cpu_usage_seconds_total[1m])) > 0.5
    for: 1m
    labels:
      severity: warning
    annotations:
      description: "High CPU usage detected"
🔹 Step 8.3: Test Alerts
kubectl scale deployment backend --replicas=0 -n three-tier

👉 You should receive an email alert 🚀

🔗 FINAL MONITORING FLOW
Application Pods
     ↓
Prometheus (collects metrics)
     ↓
Grafana (visualizes dashboards)
     ↓
AlertManager (checks rules)
     ↓
Email Notification
---

# 📧 ALERTING SETUP (EMAIL)

## 🔹 Step 1: Edit AlertManager Config

```
kubectl edit secret alertmanager-monitoring-kube-prometheus-alertmanager
```

Add:

```
receivers:
- name: email-alert
  email_configs:
  - to: "your-email@gmail.com"
    from: "your-email@gmail.com"
    smarthost: smtp.gmail.com:587
    auth_username: "your-email@gmail.com"
    auth_password: "your-app-password"
```

---

## 🔹 Step 2: Apply Alert Rule

Example:

```
- alert: HighCPUUsage
  expr: sum(rate(container_cpu_usage_seconds_total[1m])) > 0.5
  for: 1m
```

---

## 🔹 Step 3: Test Alerts

* Increase load on pods
* Or scale down pods

📩 You will receive email alerts.

---

# 🔗 Application Flow

```
User → Frontend → Backend → MongoDB
```

---

# ☸️ Kubernetes Design

| Component | Type         | Purpose                |
| --------- | ------------ | ---------------------- |
| Frontend  | LoadBalancer | Public access          |
| Backend   | ClusterIP    | Internal communication |
| MongoDB   | ClusterIP    | Internal database      |

---

# ⚠️ Troubleshooting

### ❌ App not loading

```
kubectl get pods -n three-tier
```

---

### ❌ Backend not reachable

```
kubectl get svc -n three-tier
```

---

### ❌ Pipeline failed

* Check GitHub Secrets
* Check IAM permissions

---

### ❌ Monitoring not working

```
kubectl get pods | grep prometheus
```

---

# 🎯 Interview Explanation

> This project implements a three-tier architecture deployed on AWS EKS. The CI/CD pipeline is built using GitHub Actions, which builds Docker images and pushes them to ECR. Kubernetes manifests deploy the application. Monitoring is implemented using Prometheus and Grafana, and AlertManager is configured for email notifications.

---

# 🚀 Future Improvements

* Ingress + HTTPS (TLS)
* Custom domain
* Helm charts
* ArgoCD (GitOps)
* Terraform for infrastructure
* Persistent storage (EBS for MongoDB)

---

# ⭐ Conclusion

This project demonstrates:

* End-to-end DevOps pipeline
* Kubernetes deployment
* Monitoring and alerting
* Production-ready architecture

---

**Happy Learning & Deploying 🚀**
