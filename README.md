# 🏡 Blueprint Budget AI

<p align="center">
  <img src="https://img.shields.io/badge/Status-Live-brightgreen?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Cloud-Azure_App_Service-0078D4?style=for-the-badge&logo=microsoftazure" />
  <img src="https://img.shields.io/badge/API-FastAPI-009688?style=for-the-badge&logo=fastapi" />
  <img src="https://img.shields.io/badge/UI-Next.js-000000?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/Containers-Docker-2496ED?style=for-the-badge&logo=docker" />
</p>

## 🚀 AI-Powered SmartBuild Planner

**Blueprint Budget AI is a full-stack AI-assisted home design platform that transforms user constraints (budget, layout, style) into structured floor plans, cost estimates, and material breakdowns — instantly.**

It bridges **design + cost intelligence**, helping users move from idea → actionable plan in seconds.

## 🌐 Live Links (Production)

- **UI:** https://blueprint.ai-coach-lab.com  
- **API:** https://api-blueprint.ai-coach-lab.com  
- **API Docs (Swagger):** https://api-blueprint.ai-coach-lab.com/docs  
- **Health Check:** https://api-blueprint.ai-coach-lab.com/health

## 🖼️ App Preview

### 🧠 AI-Generated Home Plan
![UI Dashboard](docs/screenshots/ui-dashboard.png)

### 📊 API Documentation (Swagger)
![API Docs](docs/screenshots/api-docs.png)

### 🎬 Demo Walkthrough
![Demo](docs/screenshots/demo.gif)

### 🏗️ Production Architecture
![Architecture](docs/screenshots/architecture.png)

## ✅ What This App Does

Blueprint Budget AI enables:

- 🏡 **Budget-driven home planning**
- 🧠 **AI-generated floor layouts**
- 🏢 **Multi-floor design support**
- 💰 **Cost estimation + budget validation**
- 📦 **Material breakdown generation**
- 🖼️ **Reference image-guided design**
- ⚡ **Real-time frontend ↔ backend interaction**

## 💡 Why This Project Is Different

Most home design tools focus only on **visual layout**.

👉 Blueprint Budget AI combines:

- **Design + Cost Intelligence**
- **User constraints → structured outputs**
- **Real-time decision feedback (within budget / over budget)**

This makes it closer to a **decision-support system**, not just a design tool.

## ⚙️ Tech Stack

| Layer | Technology |
|------|-----------|
| Frontend | Next.js (App Router), TypeScript |
| Backend | FastAPI (Python) |
| Deployment | Azure App Service |
| Containers | Docker |
| Networking | Cloudflare (DNS + SSL) |
| API | REST (JSON over HTTPS) |

## 🧠 Architecture

### Production

- **Next.js UI:** `blueprint.ai-coach-lab.com`
- **FastAPI API:** `api-blueprint.ai-coach-lab.com`
- **Cloudflare:** DNS + routing
- **Azure App Service:** Hosting + SSL

## 🔧 System Flow

```mermaid
flowchart LR
  U["User (Browser)"] --> UI["Next.js UI<br/>blueprint.ai-coach-lab.com"]
  UI -->|HTTPS JSON| API["FastAPI API<br/>api-blueprint.ai-coach-lab.com"]

  API --> ENGINE["Planning Engine"]
  API --> COST["Cost Estimator"]
  API --> MATERIALS["Materials Calculator"]
  API --> LAYOUT["Layout Generator"]
