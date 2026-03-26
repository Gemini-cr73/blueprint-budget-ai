# 🏡 Blueprint Budget AI

<p align="center">
  <img src="https://img.shields.io/badge/Status-Live-brightgreen?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Cloud-Azure_App_Service-0078D4?style=for-the-badge&logo=microsoftazure" />
  <img src="https://img.shields.io/badge/API-FastAPI-009688?style=for-the-badge&logo=fastapi" />
  <img src="https://img.shields.io/badge/UI-Next.js-000000?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/Containers-Docker-2496ED?style=for-the-badge&logo=docker" />
</p>

**AI-powered SmartBuild planner for budget-aware home design.**  
Blueprint Budget AI helps users design homes by combining budget constraints, layout preferences, and AI-driven planning to generate floor layouts, cost estimates, and material breakdowns.

## 🌐 Live Links (Production)

- **UI:** https://blueprint.ai-coach-lab.com  
- **API Docs (Swagger):** https://api-blueprint.ai-coach-lab.com/docs  
- **Health Check:** https://api-blueprint.ai-coach-lab.com/health  

## 🖼️ App Preview

### AI-Generated Home Plan
![UI Dashboard](docs/screenshots/ui-dashboard.png)

### Cost & Materials Breakdown
![Cost Breakdown](docs/screenshots/ui-dashboard.png)

### Full Dashboard
![Dashboard](docs/screenshots/ui-dashboard.png)

### API Documentation (Swagger)
![API Docs](docs/screenshots/api-docs.png)

### Demo Walkthrough
![Demo](docs/screenshots/demo.gif)

### Production Architecture
![Architecture](docs/screenshots/architecture.png)

## ✅ What This App Does

Blueprint Budget AI combines:

- **Budget-driven home planning**
- **AI-generated floor layouts**
- **Multi-floor design support**
- **Material estimation and cost breakdown**
- **Layout refinement suggestions**
- **Reference image integration**
- **Real-time frontend ↔ backend interaction**

## ✅ Features

| Category | Feature | Description |
|---|---|---|
| Planning | Budget-based design | Generates home layouts based on user budget |
| Planning | Multi-floor layouts | Supports 1+ floor configurations |
| Visualization | Layout rendering | Displays structured floor plans dynamically |
| Cost Analysis | Estimated build cost | Calculates total construction cost |
| Cost Analysis | Material breakdown | Lists materials and associated costs |
| Optimization | Budget fit analysis | Determines if design fits within budget |
| UX | Reference image input | Allows users to guide design visually |
| Platform | UI + API separation | Next.js frontend + FastAPI backend |
| Deployment | Cloud-ready | Dockerized and deployed to Azure |

## 🧠 Architecture

### Production

- **Next.js UI (public):** `blueprint.ai-coach-lab.com`
- **FastAPI API (public):** `api-blueprint.ai-coach-lab.com`
- **Cloudflare:** DNS + routing
- **Azure App Service:** Hosting + SSL

### 🔧 System Flow

```mermaid
flowchart LR
  U["User (Browser)"] --> UI["Next.js UI<br/>blueprint.ai-coach-lab.com"]
  UI -->|HTTPS JSON| API["FastAPI API<br/>api-blueprint.ai-coach-lab.com"]
  API --> ENGINE["Planning Engine"]
  API --> COST["Cost Estimator"]
  API --> MATERIALS["Materials Calculator"]
  API --> LAYOUT["Layout Generator"]
