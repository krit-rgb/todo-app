# CI/CD Setup Guide

## Overview

```
Push to main
    │
    ▼
┌─────────────┐    ┌──────────────────┐    ┌───────────────┐    ┌────────────┐
│ Build+Test  │───▶│ Docker Build+Push│───▶│ Security Scan │───▶│   Notify   │
│  (Node 20)  │    │  (Docker Hub)    │    │   (Trivy)     │    │ (Summary)  │
└─────────────┘    └──────────────────┘    └───────────────┘    └────────────┘
```

PRs to main → run lint/test + Docker dry-run build (no push)
Merge to main → full pipeline + push image to Docker Hub

---

## Step 1 — Create a Docker Hub account & token

1. Sign up at https://hub.docker.com (free)
2. Go to **Account Settings → Security → New Access Token**
3. Name it `github-actions`, permission: **Read & Write**
4. Copy the token — you'll only see it once

---

## Step 2 — Add GitHub Secrets

In your GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**

| Secret Name          | Value                          |
|----------------------|--------------------------------|
| `DOCKERHUB_USERNAME` | your Docker Hub username       |
| `DOCKERHUB_TOKEN`    | the access token from Step 1   |

---

## Step 3 — Push to GitHub

```bash
cd todo-app

# Initialize git repo
git init
git add .
git commit -m "feat: initial todo app with CI/CD pipeline"

# Create repo on GitHub (github.com → New repository → todo-app)
git remote add origin https://github.com/YOUR_USERNAME/todo-app.git
git branch -M main
git push -u origin main
```

This push immediately triggers the pipeline.

---

## Step 4 — Watch it run

1. Go to your GitHub repo → **Actions** tab
2. Click the running workflow **"Frontend CI/CD"**
3. Watch each job: Build & Test → Docker Build & Push → Security Scan → Notify

On success, your image will be live at:
```
docker.io/YOUR_USERNAME/todo-frontend:latest
docker.io/YOUR_USERNAME/todo-frontend:sha-abc1234
```

---

## Step 5 — Pull the image (anywhere)

Once pushed, anyone can run your app with just Docker — no code needed:

```bash
# Pull and run frontend from Docker Hub
docker pull YOUR_USERNAME/todo-frontend:latest

# Or update docker-compose.yml to use the remote image instead of building locally:
# image: YOUR_USERNAME/todo-frontend:latest
docker-compose up
```

---

## Tagging strategy

| Trigger             | Tags applied                              |
|---------------------|-------------------------------------------|
| Push to `main`      | `latest`, `sha-abc1234`                   |
| Push to `develop`   | `develop`, `sha-abc1234`                  |
| Git tag `v1.2.3`    | `1.2.3`, `1.2`, `sha-abc1234`             |
| Pull Request        | build check only, no push                 |

---

## Re-trigger pipeline

```bash
# Any push to frontend/ or the workflow file triggers a new build
git commit --allow-empty -m "ci: trigger pipeline"
git push
```
