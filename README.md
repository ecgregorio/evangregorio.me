## Project Overview

Personal full-stack web platform running on AWS EC2 with a containerized FastAPI backend, PostgreSQL, Nginx reverse proxy, HTTPS via Certbot, and GitHub Actions CI/CD.

![Python](https://img.shields.io/badge/python-3.12-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-API-green)
![Docker](https://img.shields.io/badge/docker-containerized-blue)
![AWS](https://img.shields.io/badge/AWS-EC2-orange)
![Last Commit](https://img.shields.io/github/last-commit/ecgregorio/evangregorio.me)
![Repo Size](https://img.shields.io/github/repo-size/ecgregorio/evangregorio.me)

## Live Endpoints

- Root site: https://evangregorio.me
- API docs (Swagger): https://api.evangregorio.me/docs

## Project Scope

This repository includes:

- Static frontend site (`evangregorio.me/`)
- FastAPI backend (`app/`)
- PostgreSQL integration via SQLAlchemy
- Docker/Compose runtime for app + database
- Nginx host-level reverse proxy and TLS
- GitHub Actions deployment workflow
- Production + staging deployment strategy

## Tech Stack

### Backend
- Python 3.12
- FastAPI
- Gunicorn + Uvicorn workers
- SQLAlchemy ORM

### Database
- PostgreSQL 16+

### Infrastructure
- AWS EC2 (Ubuntu 24.04)
- Docker + Docker Compose
- Nginx reverse proxy
- Certbot (Let's Encrypt HTTPS)
- GitHub Actions CI/CD

## Deployment Architecture

```text
Internet
   |
Nginx (host)
   |-- evangregorio.me       -> /var/www/evangregorio.me (static frontend)
   |-- api.evangregorio.me   -> 127.0.0.1:8000 (FastAPI container)
FastAPI container
   |
PostgreSQL container
```

## Preview

> March 04, 2026 20:44
> The FastAPI Swagger UI automatically documents all available endpoints.
<img width="500" height="450" alt="image" src="https://github.com/user-attachments/assets/a81a5ad0-88f0-4ca7-bfbc-7fc12c954342" />

> March 07, 23:29
> Containers running on the EC2 server via Docker Compose
<img width="1779" height="128" alt="image" src="https://github.com/user-attachments/assets/471d7ceb-cf0f-41cb-a11d-54b8d48d1e59" />

## Deployment Automation

- Pushes to `main` trigger GitHub Actions deployment.
- Backend deploy uses `docker compose up -d --build` on EC2.
- Root website files from `evangregorio.me/` are synced to `/var/www/evangregorio.me`.
- Nginx config is tested (`nginx -t`) and reloaded after sync.
- Legacy systemd-only deploy flow is deprecated for this repo.

## Environments

### Production
- Branch: `main`
- API URL: `https://api.evangregorio.me`
- Root URL: `https://evangregorio.me`
- Compose: `docker-compose.yml` +  + `docker-compose.production.yml`
- API host port: `8000`

### Staging
- Branch: `staging`
- API URL: `https://staging-api.evangregorio.me`
- Root URL: `https://staging.evangregorio.me`
- Compose: `docker-compose.yml` + `docker-compose.staging.yml`
- API host port: `8001`

## CI/CD Behavior
- Push to main deploys production.
- Push to staging deploys staging.
- Manual deploy is available via workflow_dispatch.
- Deployment flow:
    - Pull latest branch on EC2
    - Rebuild/restart Docker services
    - Sync frontend files to Nginx web root
    - Validate Nginx config and reload
    - Run health checks

## Project Structure

- `app/                    FastAPI app + DB models/session wiring`
- `evangregorio.me        Static frontend assets`
- `docs/                   Deployment and infrastructure notes`
- `.github/workflows/      CI/CD workflows`
- `docker-compose*.yml     Environment compose definitions`

## Operations Notes

- The root domain is served by Nginx from /var/www/evangregorio.me.
- FastAPI / route is API scope, not the static root website.
- On t3.micro, production should stay always-on; staging is best run on-demand to avoid memory pressure.
- Container worker counts should stay conservative on micro instances (froze my instance one time).
